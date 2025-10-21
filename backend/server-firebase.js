import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { testConnection } from './config/firebase.js';
import Usuario from './models/UsuarioFirebase.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Função para inicializar o servidor
async function inicializarServidor() {
    try {
        // Testar conexão com Firebase
        const conexaoOk = await testConnection();
        if (!conexaoOk) {
            console.error('❌ Não foi possível conectar ao Firebase');
            process.exit(1);
        }

        console.log('✅ Firebase conectado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao inicializar servidor:', error);
        process.exit(1);
    }
}

// =====================================================
// ROTAS DA API
// =====================================================

// Rota de health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        database: 'Firebase Firestore',
        version: '2.0.0'
    });
});

// Endpoint para cadastrar usuário (POST /cadastrar)
app.post('/cadastrar', async (req, res) => {
    try {
        const { nome, tipo, email, senha, telefone, endereco, cidade, estado, cep, data_nascimento, cpf_cnpj, descricao, foto_perfil, nome_fantasia, razao_social, area_atuacao, especialidades, portfolio_url, site_url } = req.body;
        
        // Validação básica
        if (!nome || !tipo || !email || !senha) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Nome, tipo, email e senha são obrigatórios' 
            });
        }

        // Validar tipo de usuário
        if (!['cliente', 'empresa', 'freelancer'].includes(tipo)) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Tipo de usuário inválido' 
            });
        }

        // Validar formato do email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Formato de email inválido' 
            });
        }

        // Validar senha
        if (senha.length < 6) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'A senha deve ter pelo menos 6 caracteres' 
            });
        }

        // Criar usuário
        const novoUsuario = await Usuario.criar({
            nome: nome.trim(),
            tipo,
            email: email.trim().toLowerCase(),
            senha,
            telefone,
            endereco,
            cidade,
            estado,
            cep,
            data_nascimento,
            cpf_cnpj,
            descricao,
            foto_perfil,
            nome_fantasia,
            razao_social,
            area_atuacao,
            especialidades,
            portfolio_url,
            site_url
        });

        res.status(201).json({ 
            status: 'ok', 
            message: 'Usuário cadastrado com sucesso',
            usuario: novoUsuario.toJSON()
        });

    } catch (error) {
        console.error('Erro no cadastro:', error);
        
        if (error.message === 'Email já cadastrado') {
            return res.status(400).json({ 
                status: 'error', 
                message: error.message 
            });
        }

        res.status(500).json({ 
            status: 'error', 
            message: 'Erro interno do servidor' 
        });
    }
});

// Endpoint para login (POST /login)
// NOTA: Este endpoint é limitado. A autenticação completa deve ser feita no frontend
// usando Firebase Client SDK com signInWithEmailAndPassword
app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        if (!email || !senha) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Email e senha são obrigatórios' 
            });
        }

        // Buscar usuário por email
        const usuario = await Usuario.buscarPorEmail(email.trim().toLowerCase());

        if (usuario && usuario.ativo) {
            res.json({ 
                status: 'ok', 
                message: 'Login realizado com sucesso',
                usuario: usuario.toJSON(),
                note: 'Para autenticação completa, use Firebase Client SDK no frontend'
            });
        } else {
            res.status(401).json({ 
                status: 'error', 
                message: 'Email ou senha incorretos' 
            });
        }

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Erro interno do servidor' 
        });
    }
});

// Endpoint para listar usuários (GET /usuarios)
app.get('/usuarios', async (req, res) => {
    try {
        const { limite = 50, offset = 0, tipo, cidade } = req.query;
        
        let usuarios;
        
        if (tipo) {
            usuarios = await Usuario.buscarPorTipo(tipo, parseInt(limite), parseInt(offset));
        } else if (cidade) {
            usuarios = await Usuario.buscarPorCidade(cidade, parseInt(limite), parseInt(offset));
        } else {
            usuarios = await Usuario.listarTodos(parseInt(limite), parseInt(offset));
        }
        
        res.json(usuarios.map(user => user.toJSON()));
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Erro interno do servidor' 
        });
    }
});

// Endpoint para buscar usuário por ID (GET /usuarios/:id)
app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.buscarPorId(id);
        
        if (usuario) {
            res.json(usuario.toJSON());
        } else {
            res.status(404).json({ 
                status: 'error', 
                message: 'Usuário não encontrado' 
            });
        }
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Erro interno do servidor' 
        });
    }
});

// Endpoint para atualizar usuário (PUT /usuarios/:id)
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dadosAtualizacao = req.body;

        const usuario = await Usuario.buscarPorId(id);
        
        if (!usuario) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Usuário não encontrado' 
            });
        }

        const usuarioAtualizado = await usuario.atualizar(dadosAtualizacao);
        
        res.json({ 
            status: 'ok', 
            message: 'Usuário atualizado com sucesso',
            usuario: usuarioAtualizado.toJSON()
        });

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Erro interno do servidor' 
        });
    }
});

// Endpoint para estatísticas (GET /estatisticas)
app.get('/estatisticas', async (req, res) => {
    try {
        const estatisticas = await Usuario.obterEstatisticas();
        const total = await Usuario.contarTotal();
        
        res.json({
            total_usuarios: total,
            por_tipo: estatisticas
        });
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Erro interno do servidor' 
        });
    }
});

// Endpoint para alterar senha (POST /usuarios/:id/alterar-senha)
app.post('/usuarios/:id/alterar-senha', async (req, res) => {
    try {
        const { id } = req.params;
        const { senhaAtual, novaSenha } = req.body;
        
        if (!senhaAtual || !novaSenha) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Senha atual e nova senha são obrigatórias' 
            });
        }

        if (novaSenha.length < 6) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'A nova senha deve ter pelo menos 6 caracteres' 
            });
        }

        const usuario = await Usuario.buscarPorId(id);
        
        if (!usuario) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Usuário não encontrado' 
            });
        }

        await usuario.alterarSenha(senhaAtual, novaSenha);
        
        res.json({ 
            status: 'ok', 
            message: 'Senha alterada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        
        if (error.message === 'Senha atual incorreta') {
            return res.status(400).json({ 
                status: 'error', 
                message: error.message 
            });
        }

        res.status(500).json({ 
            status: 'error', 
            message: 'Erro interno do servidor' 
        });
    }
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        status: 'error', 
        message: 'Endpoint não encontrado' 
    });
});

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
    console.error('Erro não tratado:', error);
    res.status(500).json({ 
        status: 'error', 
        message: 'Erro interno do servidor' 
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🔄 Encerrando servidor...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🔄 Encerrando servidor...');
    process.exit(0);
});

// Inicializar e iniciar servidor (apenas se não estiver no Vercel)
if (process.env.VERCEL !== '1') {
    inicializarServidor().then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor Node.js com Firebase rodando em http://localhost:${PORT}`);
            console.log('📋 Endpoints disponíveis:');
            console.log('  GET  /health - Status do servidor');
            console.log('  POST /cadastrar - Cadastrar novo usuário');
            console.log('  POST /login - Fazer login');
            console.log('  GET  /usuarios - Listar usuários');
            console.log('  GET  /usuarios?tipo=freelancer - Listar usuários por tipo');
            console.log('  GET  /usuarios/:id - Buscar usuário por ID');
            console.log('  PUT  /usuarios/:id - Atualizar usuário');
            console.log('  POST /usuarios/:id/alterar-senha - Alterar senha');
            console.log('  GET  /estatisticas - Estatísticas do sistema');
            console.log('');
            console.log('💾 Banco de dados: Firebase Firestore');
            console.log('🔐 Autenticação: Firebase Authentication');
        });
    });
} else {
    // No Vercel, apenas inicializar sem listen
    inicializarServidor();
}

export default app;

