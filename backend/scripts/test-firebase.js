#!/usr/bin/env node

// ==============================
// 🧪 SCRIPT DE TESTE - FIREBASE
// ==============================
// Este script testa as funcionalidades básicas do Firebase

import { testConnection, db, auth } from '../config/firebase.js';
import Usuario from '../models/UsuarioFirebase.js';
import Servico from '../models/ServicoFirebase.js';

console.log('🧪 Iniciando testes do Firebase...\n');

async function executarTestes() {
  let testsPassed = 0;
  let testsFailed = 0;

  // Teste 1: Conexão com Firestore
  console.log('📝 Teste 1: Conexão com Firestore');
  try {
    const conexaoOk = await testConnection();
    if (conexaoOk) {
      console.log('✅ PASSOU: Conexão estabelecida\n');
      testsPassed++;
    } else {
      throw new Error('Falha na conexão');
    }
  } catch (error) {
    console.log('❌ FALHOU:', error.message, '\n');
    testsFailed++;
  }

  // Teste 2: Criar usuário
  console.log('📝 Teste 2: Criar usuário');
  let usuarioTeste = null;
  try {
    usuarioTeste = await Usuario.criar({
      nome: 'Teste Firebase',
      email: `teste${Date.now()}@firebase.test`,
      senha: 'senha123',
      tipo: 'freelancer',
      cidade: 'São Paulo',
      especialidades: ['React', 'Node.js']
    });
    console.log('✅ PASSOU: Usuário criado com ID:', usuarioTeste.id, '\n');
    testsPassed++;
  } catch (error) {
    console.log('❌ FALHOU:', error.message, '\n');
    testsFailed++;
  }

  // Teste 3: Buscar usuário por ID
  console.log('📝 Teste 3: Buscar usuário por ID');
  try {
    if (usuarioTeste) {
      const usuario = await Usuario.buscarPorId(usuarioTeste.id);
      if (usuario && usuario.nome === 'Teste Firebase') {
        console.log('✅ PASSOU: Usuário encontrado:', usuario.nome, '\n');
        testsPassed++;
      } else {
        throw new Error('Usuário não encontrado ou dados incorretos');
      }
    } else {
      throw new Error('Usuário de teste não foi criado');
    }
  } catch (error) {
    console.log('❌ FALHOU:', error.message, '\n');
    testsFailed++;
  }

  // Teste 4: Buscar usuário por email
  console.log('📝 Teste 4: Buscar usuário por email');
  try {
    if (usuarioTeste) {
      const usuario = await Usuario.buscarPorEmail(usuarioTeste.email);
      if (usuario && usuario.id === usuarioTeste.id) {
        console.log('✅ PASSOU: Usuário encontrado por email\n');
        testsPassed++;
      } else {
        throw new Error('Usuário não encontrado por email');
      }
    } else {
      throw new Error('Usuário de teste não foi criado');
    }
  } catch (error) {
    console.log('❌ FALHOU:', error.message, '\n');
    testsFailed++;
  }

  // Teste 5: Atualizar usuário
  console.log('📝 Teste 5: Atualizar usuário');
  try {
    if (usuarioTeste) {
      await usuarioTeste.atualizar({
        descricao: 'Desenvolvedor Full Stack',
        telefone: '11999999999'
      });
      const usuarioAtualizado = await Usuario.buscarPorId(usuarioTeste.id);
      if (usuarioAtualizado.descricao === 'Desenvolvedor Full Stack') {
        console.log('✅ PASSOU: Usuário atualizado com sucesso\n');
        testsPassed++;
      } else {
        throw new Error('Dados não foram atualizados');
      }
    } else {
      throw new Error('Usuário de teste não foi criado');
    }
  } catch (error) {
    console.log('❌ FALHOU:', error.message, '\n');
    testsFailed++;
  }

  // Teste 6: Criar serviço
  console.log('📝 Teste 6: Criar serviço');
  let servicoTeste = null;
  try {
    if (usuarioTeste) {
      servicoTeste = await Servico.criar({
        usuario_id: usuarioTeste.id,
        categoria_id: 'cat_programacao',
        titulo: 'Desenvolvimento de Landing Page',
        descricao: 'Landing page profissional com React',
        tipo: 'servico',
        preco: 1200,
        prazo_entrega: 7,
        tags: ['react', 'landing-page', 'web']
      });
      console.log('✅ PASSOU: Serviço criado com ID:', servicoTeste.id, '\n');
      testsPassed++;
    } else {
      throw new Error('Usuário de teste não foi criado');
    }
  } catch (error) {
    console.log('❌ FALHOU:', error.message, '\n');
    testsFailed++;
  }

  // Teste 7: Buscar serviço por ID
  console.log('📝 Teste 7: Buscar serviço por ID');
  try {
    if (servicoTeste) {
      const servico = await Servico.buscarPorId(servicoTeste.id);
      if (servico && servico.titulo === 'Desenvolvimento de Landing Page') {
        console.log('✅ PASSOU: Serviço encontrado\n');
        testsPassed++;
      } else {
        throw new Error('Serviço não encontrado');
      }
    } else {
      throw new Error('Serviço de teste não foi criado');
    }
  } catch (error) {
    console.log('❌ FALHOU:', error.message, '\n');
    testsFailed++;
  }

  // Teste 8: Buscar serviços por usuário
  console.log('📝 Teste 8: Buscar serviços por usuário');
  try {
    if (usuarioTeste) {
      const servicos = await Servico.buscarPorUsuario(usuarioTeste.id);
      if (servicos.length > 0) {
        console.log('✅ PASSOU: Encontrados', servicos.length, 'serviço(s)\n');
        testsPassed++;
      } else {
        throw new Error('Nenhum serviço encontrado');
      }
    } else {
      throw new Error('Usuário de teste não foi criado');
    }
  } catch (error) {
    console.log('❌ FALHOU:', error.message, '\n');
    testsFailed++;
  }

  // Teste 9: Incrementar visualizações
  console.log('📝 Teste 9: Incrementar visualizações');
  try {
    if (servicoTeste) {
      const visualizacoesAntes = servicoTeste.visualizacoes;
      await servicoTeste.incrementarVisualizacoes();
      const servicoAtualizado = await Servico.buscarPorId(servicoTeste.id);
      if (servicoAtualizado.visualizacoes === visualizacoesAntes + 1) {
        console.log('✅ PASSOU: Visualizações incrementadas\n');
        testsPassed++;
      } else {
        throw new Error('Visualizações não foram incrementadas');
      }
    } else {
      throw new Error('Serviço de teste não foi criado');
    }
  } catch (error) {
    console.log('❌ FALHOU:', error.message, '\n');
    testsFailed++;
  }

  // Teste 10: Listar usuários por tipo
  console.log('📝 Teste 10: Listar usuários por tipo');
  try {
    const freelancers = await Usuario.buscarPorTipo('freelancer', 10);
    console.log('✅ PASSOU: Encontrados', freelancers.length, 'freelancer(s)\n');
    testsPassed++;
  } catch (error) {
    console.log('❌ FALHOU:', error.message, '\n');
    testsFailed++;
  }

  // Limpeza: Deletar dados de teste
  console.log('🧹 Limpando dados de teste...');
  try {
    if (servicoTeste) {
      await servicoTeste.deletar();
      console.log('✓ Serviço de teste deletado');
    }
    if (usuarioTeste) {
      await usuarioTeste.desativar();
      await auth.deleteUser(usuarioTeste.id);
      await db.collection('usuarios').doc(usuarioTeste.id).delete();
      console.log('✓ Usuário de teste deletado');
    }
    console.log('');
  } catch (error) {
    console.log('⚠️  Erro na limpeza:', error.message, '\n');
  }

  // Resumo
  console.log('═══════════════════════════════════════');
  console.log('📊 RESUMO DOS TESTES');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Testes passados: ${testsPassed}`);
  console.log(`❌ Testes falhados: ${testsFailed}`);
  console.log(`📈 Taxa de sucesso: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  console.log('═══════════════════════════════════════\n');

  if (testsFailed === 0) {
    console.log('🎉 Todos os testes passaram!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Alguns testes falharam. Verifique a configuração.\n');
    process.exit(1);
  }
}

// Executar testes
executarTestes().catch(error => {
  console.error('❌ Erro fatal nos testes:', error);
  process.exit(1);
});

