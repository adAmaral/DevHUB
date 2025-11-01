param(
    [string]$TomcatHome = $env:TOMCAT_HOME,
    [string]$AppContext = "devhub",
    [int]$Port = 8080,
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

# 1) Resolver TomcatHome
function Resolve-TomcatHome([string]$inputPath) {
    if ($inputPath) {
        if (Test-Path $inputPath) {
            $full = (Resolve-Path $inputPath).Path
            if ($full.ToLower().EndsWith("\bin")) { return (Split-Path -Parent $full) }
            return $full
        }
    }
    $candidates = @(
        "C:\\Program Files\\Apache Software Foundation\\Tomcat 9.0",
        "C:\\apache-tomcat-9.0"
    )
    foreach ($c in $candidates) {
        if (Test-Path $c) { return (Resolve-Path $c).Path }
    }
    # wildcard fallback
    $wild = Get-ChildItem "C:\\apache-tomcat-9.*" -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
    if ($wild) { return $wild.FullName }
    return $null
}

$TomcatHome = Resolve-TomcatHome $TomcatHome
if (-not $TomcatHome) {
    Write-Host "[ERRO] TomcatHome não encontrado. Defina TOMCAT_HOME ou use -TomcatHome." -ForegroundColor Red
    exit 1
}

# Verificar e configurar JAVA_HOME
function Resolve-JavaHome {
    # 1) Verificar JAVA_HOME já definido
    if ($env:JAVA_HOME) {
        $javaHome = $env:JAVA_HOME.TrimEnd('\')
        
        # Se apontar diretamente para java.exe, subir até o diretório raiz
        if ($javaHome.EndsWith("\java.exe") -or $javaHome.EndsWith("\bin\java.exe")) {
            while ($javaHome -and -not (Test-Path "$javaHome\bin\java.exe")) {
                $javaHome = Split-Path $javaHome -Parent
                if ($javaHome -eq (Split-Path $javaHome -Parent)) {
                    # Evitar loop infinito
                    $javaHome = $null
                    break
                }
            }
        }
        
        # Se apontar para bin, subir um nível
        if ($javaHome -and $javaHome.EndsWith("\bin")) {
            $javaHome = Split-Path $javaHome -Parent
        }
        
        # Verificar se o caminho está correto agora
        if ($javaHome -and (Test-Path "$javaHome\bin\java.exe")) {
            return $javaHome
        } elseif ($javaHome -and (Test-Path "$javaHome\java.exe")) {
            # Se java.exe está na raiz, subir um nível
            return Split-Path $javaHome -Parent
        }
        
        # Se ainda não encontrou, tentar subir mais níveis
        if ($javaHome) {
            $currentPath = $javaHome
            for ($i = 0; $i -lt 3; $i++) {
                $currentPath = Split-Path $currentPath -Parent
                if (Test-Path "$currentPath\bin\java.exe") {
                    return $currentPath
                }
            }
        }
    }
    
    # 2) Verificar JRE_HOME
    if ($env:JRE_HOME) {
        $jreHome = $env:JRE_HOME.TrimEnd('\')
        
        # Se apontar diretamente para java.exe, subir até o diretório raiz
        if ($jreHome.EndsWith("\java.exe") -or $jreHome.EndsWith("\bin\java.exe")) {
            while ($jreHome -and -not (Test-Path "$jreHome\bin\java.exe")) {
                $jreHome = Split-Path $jreHome -Parent
                if ($jreHome -eq (Split-Path $jreHome -Parent)) {
                    # Evitar loop infinito
                    $jreHome = $null
                    break
                }
            }
        }
        
        # Se apontar para bin, subir um nível
        if ($jreHome -and $jreHome.EndsWith("\bin")) {
            $jreHome = Split-Path $jreHome -Parent
        }
        
        # Verificar se o caminho está correto agora
        if ($jreHome -and (Test-Path "$jreHome\bin\java.exe")) {
            return $jreHome
        } elseif ($jreHome -and (Test-Path "$jreHome\java.exe")) {
            # Se java.exe está na raiz, subir um nível
            return Split-Path $jreHome -Parent
        }
        
        # Se ainda não encontrou, tentar subir mais níveis
        if ($jreHome) {
            $currentPath = $jreHome
            for ($i = 0; $i -lt 3; $i++) {
                $currentPath = Split-Path $currentPath -Parent
                if (Test-Path "$currentPath\bin\java.exe") {
                    return $currentPath
                }
            }
        }
    }
    
    # 3) Tentar localizar Java via PATH
    try {
        $javaPath = (Get-Command java -ErrorAction Stop).Source
        if (Test-Path $javaPath) {
            $javaDir = Split-Path (Split-Path $javaPath -Parent) -Parent
            if (Test-Path "$javaDir\bin\java.exe") {
                return $javaDir
            }
        }
    } catch {}
    
    # 4) Tentar localizações comuns do Windows
    $commonPaths = @(
        "C:\Program Files\Java",
        "$env:ProgramFiles\Java",
        "${env:ProgramFiles(x86)}\Java",
        "C:\Program Files (x86)\Java"
    )
    
    foreach ($basePath in $commonPaths) {
        if (Test-Path $basePath) {
            # Procurar por JRE/JDK mais recente (priorizando JDK)
            try {
                $javaDirs = Get-ChildItem $basePath -Directory -ErrorAction SilentlyContinue | 
                           Where-Object { $_.Name -like "jdk*" -or $_.Name -like "jre*" } |
                           Sort-Object @{Expression={if ($_.Name -like "jdk*") {0} else {1}}; Ascending=$true}, 
                                     @{Expression={[version]($_.Name -replace '[^\d.]','')}; Descending=$true} -ErrorAction SilentlyContinue
                
                foreach ($javaDir in $javaDirs) {
                    $javaExe = Join-Path $javaDir.FullName "bin\java.exe"
                    if (Test-Path $javaExe) {
                        # Verificar se é Java 11 ou superior
                        try {
                            $versionOutput = & $javaExe -version 2>&1 | Out-String
                            if ($versionOutput -match '"(\d+)') {
                                $majorVersion = [int]$matches[1]
                                if ($majorVersion -ge 11) {
                                    return $javaDir.FullName
                                }
                            }
                        } catch {
                            # Se não conseguir verificar versão, ainda retorna (mas dará erro depois)
                            return $javaDir.FullName
                        }
                    }
                }
            } catch {
                # Continuar procurando em outros caminhos
                continue
            }
        }
    }
    
    return $null
}

$javaHome = Resolve-JavaHome
if (-not $javaHome) {
    Write-Host "[ERRO] Java não encontrado. Defina JAVA_HOME ou instale o Java." -ForegroundColor Red
    Write-Host "[INFO] O projeto requer Java 11 ou superior." -ForegroundColor Yellow
    exit 1
}

$env:JAVA_HOME = $javaHome
$env:JRE_HOME = $javaHome

# Verificar versão do Java
Write-Host "[INFO] Verificando versão do Java..." -ForegroundColor Cyan
$javaExePath = Join-Path $env:JAVA_HOME "bin\java.exe"

if (-not (Test-Path $javaExePath)) {
    Write-Host "[ERRO] java.exe não encontrado em: $javaExePath" -ForegroundColor Red
    Write-Host "[INFO] JAVA_HOME configurado: $env:JAVA_HOME" -ForegroundColor Yellow
    Write-Host "[INFO] Verifique se o caminho está correto." -ForegroundColor Yellow
    exit 1
}

# java -version envia saída para stderr, não stdout (isso é normal e esperado)
# Precisamos capturar a saída sem que o $ErrorActionPreference="Stop" trate como erro
$prevErrorAction = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
try {
    $javaVersionOutput = & $javaExePath -version 2>&1
    $exitCode = $LASTEXITCODE
} finally {
    $ErrorActionPreference = $prevErrorAction
}

# Converter saída para string
$javaVersionString = $javaVersionOutput | Out-String

# Extrair primeira linha para exibição
$javaVersionLine = ($javaVersionString -split "`n" | Select-Object -First 1).Trim()
if ($javaVersionLine) {
    Write-Host "[INFO] Java: $javaVersionLine" -ForegroundColor Cyan
}

# Se houve erro real na execução (exit code != 0 e saída vazia)
if ($exitCode -ne 0 -and -not $javaVersionString) {
    Write-Host "[ERRO] Falha ao executar java.exe (código de saída: $exitCode)" -ForegroundColor Red
    Write-Host "[INFO] Caminho: $javaExePath" -ForegroundColor Yellow
    exit 1
}
$javaMajorVersion = $null

if ($javaVersionString -match '"(\d+)') {
    $javaMajorVersion = [int]$matches[1]
    Write-Host "[INFO] Versão do Java detectada: $javaMajorVersion" -ForegroundColor Cyan
} elseif ($javaVersionString -match 'version "(\d+)\.') {
    $javaMajorVersion = [int]$matches[1]
    Write-Host "[INFO] Versão do Java detectada: $javaMajorVersion" -ForegroundColor Cyan
} else {
    Write-Host "[ALERTA] Não foi possível determinar a versão do Java automaticamente" -ForegroundColor Yellow
    Write-Host "[INFO] Saída: $javaVersionString" -ForegroundColor Gray
}

if ($javaMajorVersion -and $javaMajorVersion -lt 11) {
    Write-Host "[ERRO] Java $javaMajorVersion detectado. O projeto requer Java 11 ou superior." -ForegroundColor Red
    Write-Host "[INFO] O código foi compilado com Java 11 (class file version 55.0)." -ForegroundColor Yellow
    Write-Host "[INFO] O Tomcat precisa usar Java 11+ para executar o código." -ForegroundColor Yellow
    Write-Host "[INFO] JAVA_HOME atual: $env:JAVA_HOME" -ForegroundColor Yellow
    Write-Host "[INFO] Instale Java 11 ou superior e defina JAVA_HOME corretamente." -ForegroundColor Yellow
    exit 1
} elseif ($javaMajorVersion) {
    Write-Host "[INFO] Versão do Java compatível: $javaMajorVersion" -ForegroundColor Green
} else {
    Write-Host "[ALERTA] Continuando sem verificação de versão. Pode haver erros se não for Java 11+." -ForegroundColor Yellow
}

# 2) Ir para a raiz do projeto (pasta do script -> subir um nível)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Split-Path -Parent $scriptDir
Set-Location $projectDir

Write-Host "[INFO] Projeto: $projectDir"
Write-Host "[INFO] Tomcat:  $TomcatHome"

# 3) Build WAR (resolver Maven mesmo sem PATH)
$mvnArgs = @("clean", "package")
if ($SkipTests) { $mvnArgs += "-DskipTests" }

function Invoke-Maven([string[]]$mvnParams) {
    $mvnCmd = $null
    
    # 1) Tentar via PATH
    try { 
        $mvnCmd = (Get-Command mvn -ErrorAction Stop).Source 
        Write-Host "[INFO] Maven encontrado no PATH: $mvnCmd" -ForegroundColor Green
    } catch {}
    
    # 2) Tentar localizações comuns
    if (-not $mvnCmd) {
        $commonPaths = @(
            "$env:LOCALAPPDATA\Programs",
            "$env:ProgramFiles\Apache\Maven",
            "$env:ProgramFiles(x86)\Apache\Maven",
            "C:\apache-maven",
            "C:\maven",
            "$env:ProgramFiles"
        )
        
        foreach ($basePath in $commonPaths) {
            if (Test-Path $basePath) {
                $found = Get-ChildItem $basePath -Recurse -Filter mvn.cmd -ErrorAction SilentlyContinue | Select-Object -First 1
                if ($found) { 
                    $mvnCmd = $found.FullName
                    Write-Host "[INFO] Maven encontrado em: $mvnCmd" -ForegroundColor Green
                    break 
                }
            }
        }
    }
    
    # 3) Tentar busca com wildcard em Program Files
    if (-not $mvnCmd) {
        $wildcard = Get-ChildItem "$env:ProgramFiles" -Directory -Filter "apache-maven*" -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($wildcard) {
            $mvnCmdPath = Join-Path $wildcard.FullName "bin\mvn.cmd"
            if (Test-Path $mvnCmdPath) {
                $mvnCmd = $mvnCmdPath
                Write-Host "[INFO] Maven encontrado em: $mvnCmd" -ForegroundColor Green
            }
        }
    }
    
    # 4) Verificar variável de ambiente MAVEN_HOME
    if (-not $mvnCmd -and $env:MAVEN_HOME) {
        $mvnHomeCmd = Join-Path $env:MAVEN_HOME "bin\mvn.cmd"
        if (Test-Path $mvnHomeCmd) {
            $mvnCmd = $mvnHomeCmd
            Write-Host "[INFO] Maven encontrado via MAVEN_HOME: $mvnCmd" -ForegroundColor Green
        }
    }
    
    if (-not $mvnCmd) {
        Write-Host "[ERRO] Maven não encontrado." -ForegroundColor Red
        Write-Host "[ERRO] Tentativas de localização:" -ForegroundColor Red
        Write-Host "  - PATH" -ForegroundColor Yellow
        Write-Host "  - $env:LOCALAPPDATA\Programs" -ForegroundColor Yellow
        Write-Host "  - $env:ProgramFiles\Apache\Maven" -ForegroundColor Yellow
        Write-Host "  - C:\apache-maven" -ForegroundColor Yellow
        Write-Host "  - MAVEN_HOME: $env:MAVEN_HOME" -ForegroundColor Yellow
        Write-Host "[INFO] Instale o Maven ou defina a variável MAVEN_HOME" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "[INFO] Executando: \"$mvnCmd\" $($mvnParams -join ' ')" -ForegroundColor Cyan
    & "$mvnCmd" @mvnParams
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Maven retornou código $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

Invoke-Maven $mvnArgs

# 4) Encontrar WAR gerado
$targetDir = Join-Path $projectDir "target"
if (-not (Test-Path $targetDir)) {
    Write-Host "[ERRO] Pasta target não encontrada." -ForegroundColor Red
    exit 1
}

$warPreferred = Join-Path $targetDir ("$AppContext.war")
$warVersioned = Get-ChildItem -Path $targetDir -Filter "*.war" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (Test-Path $warPreferred) {
    $warToDeploy = $warPreferred
} elseif ($warVersioned) {
    $warToDeploy = $warVersioned.FullName
    Write-Host "[INFO] WAR versionado encontrado: $($warVersioned.Name)" -ForegroundColor Yellow
} else {
    Write-Host "[ERRO] Nenhum WAR encontrado em $targetDir" -ForegroundColor Red
    exit 1
}

# Verificar tamanho do WAR
$warInfo = Get-Item $warToDeploy
if ($warInfo.Length -lt 1024) {
    Write-Host "[ERRO] WAR parece estar vazio ou corrompido (tamanho: $($warInfo.Length) bytes)" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] WAR: $warToDeploy (Tamanho: $([math]::Round($warInfo.Length / 1MB, 2)) MB)"

# 5) Parar Tomcat
Write-Host "[INFO] Parando Tomcat..."
$env:CATALINA_HOME = $TomcatHome
$env:CATALINA_BASE = $TomcatHome
# Garantir que JAVA_HOME está definido para o Tomcat
if (-not $env:JAVA_HOME) {
    Write-Host "[ERRO] JAVA_HOME não está definido. Defina antes de iniciar o Tomcat." -ForegroundColor Red
    exit 1
}

$shutdownScript = Join-Path $TomcatHome "bin\shutdown.bat"
if (Test-Path $shutdownScript) {
    Start-Process -FilePath $shutdownScript -NoNewWindow -Wait -ErrorAction SilentlyContinue | Out-Null
} else {
    Write-Host "[ALERTA] Script shutdown.bat não encontrado, tentando parar processos Java do Tomcat..." -ForegroundColor Yellow
    Get-Process | Where-Object { $_.ProcessName -eq "java" } | Where-Object {
        $cmdLine = (Get-WmiObject Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine
        if ($cmdLine -and ($cmdLine -like "*catalina*" -or $cmdLine -like "*tomcat*")) {
            $true
        }
    } | Stop-Process -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 5

# 6) Limpar deploy anterior
$webapps = Join-Path $TomcatHome "webapps"
$exploded = Join-Path $webapps $AppContext
$destWar  = Join-Path $webapps ("$AppContext.war")

Write-Host "[INFO] Limpando deploy anterior..."
Remove-Item $exploded -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $destWar -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 7) Copiar novo WAR (renomeando para <contexto>.war)
Write-Host "[INFO] Copiando WAR para: $destWar"
Copy-Item $warToDeploy $destWar -Force
if (-not (Test-Path $destWar)) {
    Write-Host "[ERRO] Falha ao copiar WAR para $destWar" -ForegroundColor Red
    exit 1
}
Write-Host "[INFO] WAR copiado com sucesso (Tamanho: $([math]::Round((Get-Item $destWar).Length / 1MB, 2)) MB)"

# 8) Iniciar Tomcat
Write-Host "[INFO] Iniciando Tomcat..."
$env:CATALINA_HOME = $TomcatHome
$env:CATALINA_BASE = $TomcatHome
# Garantir que JAVA_HOME está definido para o Tomcat
if (-not $env:JAVA_HOME) {
    Write-Host "[ERRO] JAVA_HOME não está definido. Defina antes de iniciar o Tomcat." -ForegroundColor Red
    exit 1
}
Write-Host "[INFO] JAVA_HOME definido para: $env:JAVA_HOME" -ForegroundColor Green

$startupScript = Join-Path $TomcatHome "bin\startup.bat"
if (Test-Path $startupScript) {
    Start-Process -FilePath $startupScript -NoNewWindow | Out-Null
} else {
    Write-Host "[ERRO] Script startup.bat não encontrado em $TomcatHome\bin" -ForegroundColor Red
    exit 1
}

# Aguardar porta subir
Write-Host "[INFO] Aguardando Tomcat iniciar na porta $Port..."
$ok = $false
for ($i=0; $i -lt 60; $i++) {
    try {
        $tnc = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
        if ($tnc.TcpTestSucceeded) { 
            $ok = $true
            Write-Host "[INFO] Tomcat iniciado!" -ForegroundColor Green
            break 
        }
    } catch {}
    Start-Sleep -Milliseconds 500
}
if (-not $ok) {
    Write-Host "[ALERTA] Porta $Port não respondeu dentro do tempo. Verifique logs em '$TomcatHome\logs'." -ForegroundColor Yellow
}

# Aguardar WAR ser descompactado (Tomcat descompacta automaticamente)
Write-Host "[INFO] Aguardando Tomcat descompactar o WAR..."
$deployedOk = $false
$logsDir = Join-Path $TomcatHome "logs"

for ($i=0; $i -lt 60; $i++) {
    if (Test-Path $exploded) {
        $webXml = Join-Path $exploded "WEB-INF\web.xml"
        if (Test-Path $webXml) {
            # Verificar se há erros nos logs durante o deploy
            $latestLog = Get-ChildItem $logsDir -Filter "*localhost*.log" -ErrorAction SilentlyContinue | 
                        Sort-Object LastWriteTime -Descending | Select-Object -First 1
            if ($latestLog) {
                $recentErrors = Get-Content $latestLog.FullName -Tail 100 -ErrorAction SilentlyContinue | 
                               Select-String -Pattern "SEVERE|ERROR|Exception|Failed" | 
                               Select-Object -First 5
                if ($recentErrors) {
                    Write-Host "[ALERTA] Possíveis erros encontrados nos logs durante o deploy:" -ForegroundColor Yellow
                    $recentErrors | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
                }
            }
            
            $deployedOk = $true
            Write-Host "[INFO] WAR descompactado com sucesso em: $exploded" -ForegroundColor Green
            break
        }
    }
    Start-Sleep -Seconds 1
}

if (-not $deployedOk) {
    Write-Host "[ERRO] WAR não foi descompactado corretamente." -ForegroundColor Red
    Write-Host "[INFO] Verifique os logs do Tomcat em: $TomcatHome\logs" -ForegroundColor Yellow
    
    # Mostrar últimas linhas do log catalina.out
    $catalinaLog = Join-Path $TomcatHome "logs\catalina.out"
    if (Test-Path $catalinaLog) {
        Write-Host "[INFO] Últimas 30 linhas do catalina.out:" -ForegroundColor Cyan
        Get-Content $catalinaLog -Tail 30 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "  $_" }
    }
    
    # Verificar log específico do contexto/localhost
    $localhostLog = Get-ChildItem (Join-Path $TomcatHome "logs") -Filter "*localhost*.log" -ErrorAction SilentlyContinue | 
                    Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($localhostLog) {
        Write-Host "[INFO] Verificando log do contexto: $($localhostLog.Name)" -ForegroundColor Cyan
        $contextErrors = Get-Content $localhostLog.FullName -Tail 100 -ErrorAction SilentlyContinue | 
                        Select-String -Pattern "SEVERE|ERROR|Exception|Failed|$AppContext" | 
                        Select-Object -First 15
        if ($contextErrors) {
            Write-Host "[INFO] Erros relacionados ao contexto:" -ForegroundColor Yellow
            $contextErrors | ForEach-Object { Write-Host "  $_" }
        }
    }
    
    # Tentar encontrar erros nos logs mais recentes
    $latestLog = Get-ChildItem (Join-Path $TomcatHome "logs") -Filter "*.log" -ErrorAction SilentlyContinue | 
                 Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($latestLog) {
        Write-Host "[INFO] Verificando log mais recente: $($latestLog.Name)" -ForegroundColor Cyan
        $errors = Get-Content $latestLog.FullName -Tail 100 -ErrorAction SilentlyContinue | 
                 Select-String -Pattern "ERROR|SEVERE|Exception|Failed" | 
                 Select-Object -First 10
        if ($errors) {
            Write-Host "[INFO] Erros encontrados no log:" -ForegroundColor Yellow
            $errors | ForEach-Object { Write-Host "  $_" }
        }
    }
    exit 1
}

# Verificar se index.html existe
$indexHtml = Join-Path $exploded "index.html"
if (-not (Test-Path $indexHtml)) {
    Write-Host "[ALERTA] index.html não encontrado em $exploded" -ForegroundColor Yellow
    Write-Host "[INFO] Arquivos na raiz do deploy:" -ForegroundColor Cyan
    Get-ChildItem $exploded -File | ForEach-Object { Write-Host "  - $($_.Name)" }
} else {
    Write-Host "[INFO] index.html encontrado: $indexHtml" -ForegroundColor Green
}

# Verificar estrutura do deploy
Write-Host "[INFO] Estrutura do deploy:" -ForegroundColor Cyan
Write-Host "  - WAR: $destWar (Existe: $(Test-Path $destWar))" -ForegroundColor Gray
Write-Host "  - Exploded: $exploded (Existe: $(Test-Path $exploded))" -ForegroundColor Gray
if (Test-Path $exploded) {
    $webXmlDeployed = Join-Path $exploded "WEB-INF\web.xml"
    Write-Host "  - web.xml: $webXmlDeployed (Existe: $(Test-Path $webXmlDeployed))" -ForegroundColor Gray
    $indexHtmlDeployed = Join-Path $exploded "index.html"
    Write-Host "  - index.html: $indexHtmlDeployed (Existe: $(Test-Path $indexHtmlDeployed))" -ForegroundColor Gray
}

# 9) Verificar logs do contexto antes de testar
Write-Host "[INFO] Verificando status do deploy no Tomcat..." -ForegroundColor Cyan
$localhostLog = Get-ChildItem (Join-Path $TomcatHome "logs") -Filter "*localhost*.log" -ErrorAction SilentlyContinue | 
                Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($localhostLog) {
    $deployMessages = Get-Content $localhostLog.FullName -Tail 200 -ErrorAction SilentlyContinue | 
                     Select-String -Pattern "$AppContext|context|deploy|start" -CaseSensitive:$false | 
                     Select-Object -Last 10
    if ($deployMessages) {
        Write-Host "[INFO] Mensagens de deploy do contexto:" -ForegroundColor Cyan
        $deployMessages | ForEach-Object { Write-Host "  $_" }
    }
}

# Verificar se o contexto foi iniciado corretamente
$catalinaLog = Join-Path $TomcatHome "logs\catalina.out"
if (Test-Path $catalinaLog) {
    $contextStart = Get-Content $catalinaLog -Tail 100 -ErrorAction SilentlyContinue | 
                   Select-String -Pattern "Context.*$AppContext.*started|Starting Servlet Engine|Deploying.*$AppContext" | 
                   Select-Object -Last 3
    if ($contextStart) {
        Write-Host "[INFO] Mensagens de inicialização do contexto:" -ForegroundColor Cyan
        $contextStart | ForEach-Object { Write-Host "  $_" }
    }
    
    # Verificar se há erros específicos do contexto
    $contextErrors = Get-Content $catalinaLog -Tail 200 -ErrorAction SilentlyContinue | 
                    Select-String -Pattern "$AppContext.*ERROR|$AppContext.*SEVERE|$AppContext.*Exception|$AppContext.*Failed" | 
                    Select-Object -First 5
    if ($contextErrors) {
        Write-Host "[ERRO] Erros encontrados relacionados ao contexto:" -ForegroundColor Red
        $contextErrors | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    }
}

# 10) Testar se a aplicação está respondendo
Write-Host "[INFO] Testando acesso à aplicação..." -ForegroundColor Cyan
$testUrl = "http://localhost:$Port/$AppContext/"
try {
    $response = Invoke-WebRequest -Uri $testUrl -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "[INFO] Aplicação respondendo (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "[ALERTA] Aplicação não está respondendo: $_" -ForegroundColor Yellow
    Write-Host "[INFO] Teste manual: $testUrl" -ForegroundColor Yellow
    Write-Host "[INFO] Verifique os logs em: $TomcatHome\logs" -ForegroundColor Yellow
}

# 11) Abrir navegador
$url = "http://localhost:$Port/$AppContext/"
Start-Sleep -Seconds 2
Start-Process $url

Write-Host "[OK] Deploy concluído: $url" -ForegroundColor Green