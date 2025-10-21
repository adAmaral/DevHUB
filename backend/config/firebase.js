// ==============================
// 🔥 CONFIGURAÇÃO DO FIREBASE ADMIN SDK
// ==============================
import admin from 'firebase-admin';

// Inicializar Firebase Admin
// Para produção, use variáveis de ambiente ou arquivo de credenciais
let db;
let auth;

try {
  // Verificar se já foi inicializado
  if (!admin.apps.length) {
    // Para desenvolvimento local, você pode usar um arquivo de credenciais
    // Para produção (Vercel), use variáveis de ambiente
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Produção: usar variável de ambiente com JSON
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else if (process.env.FIREBASE_PROJECT_ID) {
      // Alternativa: usar credenciais individuais
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
      });
    } else {
      // Desenvolvimento: usar Application Default Credentials ou arquivo local
      console.log('⚠️  Usando configuração padrão do Firebase (certifique-se de ter configurado as credenciais)');
      admin.initializeApp();
    }
  }

  db = admin.firestore();
  auth = admin.auth();
  
  console.log('✅ Firebase Admin inicializado com sucesso!');
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase Admin:', error.message);
  throw error;
}

// Configurações do Firestore
db.settings({
  ignoreUndefinedProperties: true
});

// Função para testar conexão
export async function testConnection() {
  try {
    // Tentar ler uma coleção para verificar conexão
    await db.collection('_health_check').limit(1).get();
    console.log('✅ Conexão com Firestore estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com Firestore:', error.message);
    return false;
  }
}

// Exportar instâncias
export { db, auth };
export default { db, auth, testConnection };

