#!/usr/bin/env node

// ==============================
// 🔥 SCRIPT DE INICIALIZAÇÃO DO FIRESTORE
// ==============================
// Este script popula o Firestore com dados iniciais (categorias)

import 'dotenv/config';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Inicializar Firebase Admin
if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  } else {
    console.log('⚠️  Usando configuração padrão do Firebase');
    admin.initializeApp();
  }
}

const db = admin.firestore();

// Categorias iniciais
const categorias = [
  {
    nome: 'Design',
    descricao: 'Serviços de design gráfico, logos, identidade visual',
    icone: 'design',
    ativo: true
  },
  {
    nome: 'Programação',
    descricao: 'Desenvolvimento de sites, aplicativos e sistemas',
    icone: 'code',
    ativo: true
  },
  {
    nome: 'Marketing',
    descricao: 'Marketing digital, gestão de redes sociais, SEO',
    icone: 'marketing',
    ativo: true
  },
  {
    nome: 'Redação',
    descricao: 'Criação de conteúdo, copywriting, tradução',
    icone: 'edit',
    ativo: true
  },
  {
    nome: 'Fotografia',
    descricao: 'Fotografia profissional, edição de imagens',
    icone: 'camera',
    ativo: true
  },
  {
    nome: 'Vídeo',
    descricao: 'Produção e edição de vídeos, motion graphics',
    icone: 'video',
    ativo: true
  },
  {
    nome: 'Música',
    descricao: 'Produção musical, trilhas sonoras, locução',
    icone: 'music',
    ativo: true
  },
  {
    nome: 'Consultoria',
    descricao: 'Consultoria empresarial, financeira, jurídica',
    icone: 'business',
    ativo: true
  },
  {
    nome: 'Educação',
    descricao: 'Aulas particulares, cursos online, treinamentos',
    icone: 'education',
    ativo: true
  },
  {
    nome: 'Comércio',
    descricao: 'Produtos físicos, artesanato, vendas',
    icone: 'shopping',
    ativo: true
  }
];

async function inicializarFirestore() {
  console.log('🔥 Iniciando população do Firestore...\n');

  try {
    // Verificar se já existem categorias
    const categoriasSnapshot = await db.collection('categorias').limit(1).get();
    
    if (!categoriasSnapshot.empty) {
      console.log('⚠️  Categorias já existem no Firestore.');
      const resposta = await perguntarUsuario('Deseja sobrescrever? (s/n): ');
      
      if (resposta.toLowerCase() !== 's') {
        console.log('❌ Operação cancelada.');
        process.exit(0);
      }
    }

    // Inserir categorias
    console.log('📝 Inserindo categorias...');
    let count = 0;
    
    for (const categoria of categorias) {
      await db.collection('categorias').add({
        ...categoria,
        data_cadastro: FieldValue.serverTimestamp()
      });
      count++;
      console.log(`  ✓ ${categoria.nome}`);
    }

    console.log(`\n✅ ${count} categorias inseridas com sucesso!`);

    // Criar índices compostos (instruções)
    console.log('\n📊 Índices recomendados:');
    console.log('  Acesse o Firebase Console > Firestore > Índices');
    console.log('  E crie os seguintes índices compostos:\n');
    
    console.log('  1. Coleção: usuarios');
    console.log('     Campos: tipo (ASC) + ativo (ASC) + data_cadastro (DESC)\n');
    
    console.log('  2. Coleção: usuarios');
    console.log('     Campos: cidade (ASC) + ativo (ASC) + data_cadastro (DESC)\n');
    
    console.log('  3. Coleção: servicos');
    console.log('     Campos: categoria_id (ASC) + ativo (ASC) + data_cadastro (DESC)\n');
    
    console.log('  4. Coleção: servicos');
    console.log('     Campos: usuario_id (ASC) + ativo (ASC) + data_cadastro (DESC)\n');

    console.log('\n🎉 Inicialização concluída!');

  } catch (error) {
    console.error('❌ Erro ao inicializar Firestore:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Função auxiliar para perguntar ao usuário
function perguntarUsuario(pergunta) {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question(pergunta, (resposta) => {
      readline.close();
      resolve(resposta);
    });
  });
}

// Executar
inicializarFirestore();

