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
        "C:\\apache-tomcat-9.0.111"
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
    try { $mvnCmd = (Get-Command mvn -ErrorAction Stop).Source } catch {}
    if (-not $mvnCmd) {
        $guess = Get-ChildItem "$env:LOCALAPPDATA\Programs" -Recurse -Filter mvn.cmd -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($guess) { $mvnCmd = $guess.FullName }
    }
    if (-not $mvnCmd) {
        Write-Host "[ERRO] Maven não encontrado no PATH. Instale ou adicione mvn ao PATH." -ForegroundColor Red
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
} else {
    Write-Host "[ERRO] Nenhum WAR encontrado em $targetDir" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] WAR: $warToDeploy"

# 5) Parar Tomcat
Write-Host "[INFO] Parando Tomcat..."
& (Join-Path $TomcatHome "bin\\shutdown.bat") | Out-Null
Start-Sleep -Seconds 3

# 6) Limpar deploy anterior
$webapps = Join-Path $TomcatHome "webapps"
$exploded = Join-Path $webapps $AppContext
$destWar  = Join-Path $webapps ("$AppContext.war")

Remove-Item $exploded -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $destWar -Force -ErrorAction SilentlyContinue

# 7) Copiar novo WAR (renomeando para <contexto>.war)
Copy-Item $warToDeploy $destWar -Force
Write-Host "[INFO] Copiado para: $destWar"

# 8) Iniciar Tomcat
Write-Host "[INFO] Iniciando Tomcat..."
& (Join-Path $TomcatHome "bin\\startup.bat") | Out-Null

# Aguardar porta subir
Write-Host "[INFO] Aguardando Tomcat na porta $Port ..."
$ok = $false
for ($i=0; $i -lt 30; $i++) {
    try {
        $tnc = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
        if ($tnc.TcpTestSucceeded) { $ok = $true; break }
    } catch {}
    Start-Sleep -Milliseconds 500
}
if (-not $ok) {
    Write-Host "[ALERTA] Porta $Port não respondeu dentro do tempo. Verifique logs em '$TomcatHome\\logs'." -ForegroundColor Yellow
}

# 9) Abrir navegador
$url = "http://localhost:$Port/$AppContext/"
Start-Sleep -Seconds 2
Start-Process $url

Write-Host "[OK] Deploy concluído: $url" -ForegroundColor Green