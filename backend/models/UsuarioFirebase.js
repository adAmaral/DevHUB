// ==============================
// 🔥 MODEL - USUÁRIO (FIREBASE)
// ==============================
import { db, auth } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

class Usuario {
  constructor(data) {
    this.id = data.id || null;
    this.nome = data.nome;
    this.email = data.email;
    this.tipo = data.tipo || 'cliente';
    this.telefone = data.telefone || null;
    this.endereco = data.endereco || null;
    this.cidade = data.cidade || null;
    this.estado = data.estado || null;
    this.cep = data.cep || null;
    this.data_nascimento = data.data_nascimento || null;
    this.cpf_cnpj = data.cpf_cnpj || null;
    this.descricao = data.descricao || null;
    this.foto_perfil = data.foto_perfil || null;
    this.nome_fantasia = data.nome_fantasia || null;
    this.razao_social = data.razao_social || null;
    this.area_atuacao = data.area_atuacao || null;
    this.especialidades = Array.isArray(data.especialidades) ? data.especialidades : [];
    this.portfolio_url = data.portfolio_url || null;
    this.site_url = data.site_url || null;
    this.ativo = data.ativo !== undefined ? data.ativo : true;
    this.data_cadastro = data.data_cadastro || null;
    this.data_atualizacao = data.data_atualizacao || null;
  }

  // Criar usuário no Firebase Authentication e Firestore
  static async criar(dados) {
    try {
      const { email, senha, ...dadosUsuario } = dados;

      // 1. Criar usuário no Firebase Authentication
      const userRecord = await auth.createUser({
        email: email,
        password: senha,
        displayName: dadosUsuario.nome,
        disabled: false
      });

      // 2. Criar documento no Firestore
      const usuario = new Usuario({
        id: userRecord.uid,
        email: email,
        ...dadosUsuario,
        data_cadastro: FieldValue.serverTimestamp(),
        data_atualizacao: FieldValue.serverTimestamp()
      });

      await db.collection('usuarios').doc(userRecord.uid).set(usuario.toFirestore());

      console.log('✅ Usuário criado com sucesso:', userRecord.uid);
      return usuario;

    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error.message);
      
      // Traduzir erros comuns do Firebase
      if (error.code === 'auth/email-already-exists') {
        throw new Error('Email já cadastrado');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('Senha muito fraca');
      }
      
      throw error;
    }
  }

  // Autenticar usuário (verificar credenciais)
  static async autenticar(email, senha) {
    try {
      // No Firebase Admin SDK, não podemos autenticar diretamente com senha
      // A autenticação deve ser feita no frontend com Firebase Client SDK
      // Aqui apenas buscamos o usuário por email
      const userRecord = await auth.getUserByEmail(email);
      
      if (!userRecord) {
        return null;
      }

      // Buscar dados completos no Firestore
      const doc = await db.collection('usuarios').doc(userRecord.uid).get();
      
      if (!doc.exists) {
        return null;
      }

      const usuario = new Usuario({
        id: doc.id,
        ...doc.data()
      });

      return usuario;

    } catch (error) {
      console.error('❌ Erro ao autenticar usuário:', error.message);
      return null;
    }
  }

  // Buscar usuário por ID
  static async buscarPorId(id) {
    try {
      const doc = await db.collection('usuarios').doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      return new Usuario({
        id: doc.id,
        ...doc.data()
      });

    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error.message);
      throw error;
    }
  }

  // Buscar usuário por email
  static async buscarPorEmail(email) {
    try {
      const snapshot = await db.collection('usuarios')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return new Usuario({
        id: doc.id,
        ...doc.data()
      });

    } catch (error) {
      console.error('❌ Erro ao buscar usuário por email:', error.message);
      throw error;
    }
  }

  // Listar todos os usuários com paginação
  static async listarTodos(limite = 50, offset = 0) {
    try {
      let query = db.collection('usuarios')
        .where('ativo', '==', true)
        .orderBy('data_cadastro', 'desc')
        .limit(limite);

      // Firestore não suporta offset diretamente, usa cursor
      if (offset > 0) {
        const skipSnapshot = await db.collection('usuarios')
          .orderBy('data_cadastro', 'desc')
          .limit(offset)
          .get();
        
        if (!skipSnapshot.empty) {
          const lastDoc = skipSnapshot.docs[skipSnapshot.docs.length - 1];
          query = query.startAfter(lastDoc);
        }
      }

      const snapshot = await query.get();
      
      return snapshot.docs.map(doc => new Usuario({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error('❌ Erro ao listar usuários:', error.message);
      throw error;
    }
  }

  // Buscar usuários por tipo
  static async buscarPorTipo(tipo, limite = 50, offset = 0) {
    try {
      let query = db.collection('usuarios')
        .where('tipo', '==', tipo)
        .where('ativo', '==', true)
        .orderBy('data_cadastro', 'desc')
        .limit(limite);

      if (offset > 0) {
        const skipSnapshot = await db.collection('usuarios')
          .where('tipo', '==', tipo)
          .orderBy('data_cadastro', 'desc')
          .limit(offset)
          .get();
        
        if (!skipSnapshot.empty) {
          const lastDoc = skipSnapshot.docs[skipSnapshot.docs.length - 1];
          query = query.startAfter(lastDoc);
        }
      }

      const snapshot = await query.get();
      
      return snapshot.docs.map(doc => new Usuario({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error('❌ Erro ao buscar usuários por tipo:', error.message);
      throw error;
    }
  }

  // Buscar usuários por cidade
  static async buscarPorCidade(cidade, limite = 50, offset = 0) {
    try {
      let query = db.collection('usuarios')
        .where('cidade', '==', cidade)
        .where('ativo', '==', true)
        .orderBy('data_cadastro', 'desc')
        .limit(limite);

      if (offset > 0) {
        const skipSnapshot = await db.collection('usuarios')
          .where('cidade', '==', cidade)
          .orderBy('data_cadastro', 'desc')
          .limit(offset)
          .get();
        
        if (!skipSnapshot.empty) {
          const lastDoc = skipSnapshot.docs[skipSnapshot.docs.length - 1];
          query = query.startAfter(lastDoc);
        }
      }

      const snapshot = await query.get();
      
      return snapshot.docs.map(doc => new Usuario({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error('❌ Erro ao buscar usuários por cidade:', error.message);
      throw error;
    }
  }

  // Atualizar usuário
  async atualizar(dadosAtualizacao) {
    try {
      if (!this.id) {
        throw new Error('ID do usuário não definido');
      }

      // Remover campos que não devem ser atualizados
      const { id, email, data_cadastro, ...camposPermitidos } = dadosAtualizacao;

      const dadosParaAtualizar = {
        ...camposPermitidos,
        data_atualizacao: FieldValue.serverTimestamp()
      };

      await db.collection('usuarios').doc(this.id).update(dadosParaAtualizar);

      // Atualizar objeto atual
      Object.assign(this, camposPermitidos);
      
      console.log('✅ Usuário atualizado com sucesso:', this.id);
      return this;

    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error.message);
      throw error;
    }
  }

  // Alterar senha
  async alterarSenha(senhaAtual, novaSenha) {
    try {
      if (!this.id) {
        throw new Error('ID do usuário não definido');
      }

      // No Firebase Admin, não verificamos a senha atual
      // Isso deve ser feito no frontend com Firebase Client SDK
      await auth.updateUser(this.id, {
        password: novaSenha
      });

      console.log('✅ Senha alterada com sucesso:', this.id);
      return true;

    } catch (error) {
      console.error('❌ Erro ao alterar senha:', error.message);
      throw error;
    }
  }

  // Desativar usuário (soft delete)
  async desativar() {
    try {
      if (!this.id) {
        throw new Error('ID do usuário não definido');
      }

      await db.collection('usuarios').doc(this.id).update({
        ativo: false,
        data_atualizacao: FieldValue.serverTimestamp()
      });

      await auth.updateUser(this.id, {
        disabled: true
      });

      this.ativo = false;
      
      console.log('✅ Usuário desativado com sucesso:', this.id);
      return this;

    } catch (error) {
      console.error('❌ Erro ao desativar usuário:', error.message);
      throw error;
    }
  }

  // Obter estatísticas de usuários
  static async obterEstatisticas() {
    try {
      const snapshot = await db.collection('usuarios').get();
      
      const stats = {
        cliente: { total: 0, ativos: 0 },
        empresa: { total: 0, ativos: 0 },
        freelancer: { total: 0, ativos: 0 }
      };

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const tipo = data.tipo;
        
        if (stats[tipo]) {
          stats[tipo].total++;
          if (data.ativo) {
            stats[tipo].ativos++;
          }
        }
      });

      return stats;

    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error.message);
      throw error;
    }
  }

  // Contar total de usuários
  static async contarTotal() {
    try {
      const snapshot = await db.collection('usuarios').count().get();
      return snapshot.data().count;
    } catch (error) {
      console.error('❌ Erro ao contar usuários:', error.message);
      throw error;
    }
  }

  // Converter para objeto Firestore (sem campos undefined)
  toFirestore() {
    const obj = {};
    
    Object.keys(this).forEach(key => {
      if (this[key] !== undefined && this[key] !== null && key !== 'id') {
        obj[key] = this[key];
      }
    });

    return obj;
  }

  // Converter para JSON (para resposta da API)
  toJSON() {
    const obj = {
      id: this.id,
      nome: this.nome,
      email: this.email,
      tipo: this.tipo,
      telefone: this.telefone,
      endereco: this.endereco,
      cidade: this.cidade,
      estado: this.estado,
      cep: this.cep,
      data_nascimento: this.data_nascimento,
      cpf_cnpj: this.cpf_cnpj,
      descricao: this.descricao,
      foto_perfil: this.foto_perfil,
      nome_fantasia: this.nome_fantasia,
      razao_social: this.razao_social,
      area_atuacao: this.area_atuacao,
      especialidades: this.especialidades,
      portfolio_url: this.portfolio_url,
      site_url: this.site_url,
      ativo: this.ativo,
      data_cadastro: this.data_cadastro,
      data_atualizacao: this.data_atualizacao
    };

    // Remover campos null/undefined
    Object.keys(obj).forEach(key => {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    });

    return obj;
  }
}

export default Usuario;

