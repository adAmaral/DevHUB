// ==============================
// 🔥 MODEL - SERVIÇO (FIREBASE)
// ==============================
import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

class Servico {
  constructor(data) {
    this.id = data.id || null;
    this.usuario_id = data.usuario_id;
    this.categoria_id = data.categoria_id;
    this.titulo = data.titulo;
    this.descricao = data.descricao || null;
    this.tipo = data.tipo || 'servico'; // 'servico' ou 'produto'
    this.preco = data.preco || 0;
    this.prazo_entrega = data.prazo_entrega || null;
    this.imagens = Array.isArray(data.imagens) ? data.imagens : [];
    this.tags = Array.isArray(data.tags) ? data.tags : [];
    this.ativo = data.ativo !== undefined ? data.ativo : true;
    this.destaque = data.destaque !== undefined ? data.destaque : false;
    this.visualizacoes = data.visualizacoes || 0;
    this.data_cadastro = data.data_cadastro || null;
    this.data_atualizacao = data.data_atualizacao || null;
  }

  // Criar serviço
  static async criar(dados) {
    try {
      const servico = new Servico({
        ...dados,
        data_cadastro: FieldValue.serverTimestamp(),
        data_atualizacao: FieldValue.serverTimestamp()
      });

      const docRef = await db.collection('servicos').add(servico.toFirestore());
      servico.id = docRef.id;

      console.log('✅ Serviço criado com sucesso:', docRef.id);
      return servico;

    } catch (error) {
      console.error('❌ Erro ao criar serviço:', error.message);
      throw error;
    }
  }

  // Buscar serviço por ID
  static async buscarPorId(id) {
    try {
      const doc = await db.collection('servicos').doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      return new Servico({
        id: doc.id,
        ...doc.data()
      });

    } catch (error) {
      console.error('❌ Erro ao buscar serviço:', error.message);
      throw error;
    }
  }

  // Listar todos os serviços
  static async listarTodos(limite = 50, lastDoc = null) {
    try {
      let query = db.collection('servicos')
        .where('ativo', '==', true)
        .orderBy('data_cadastro', 'desc')
        .limit(limite);

      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const snapshot = await query.get();
      
      return snapshot.docs.map(doc => new Servico({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error('❌ Erro ao listar serviços:', error.message);
      throw error;
    }
  }

  // Buscar serviços por categoria
  static async buscarPorCategoria(categoriaId, limite = 50) {
    try {
      const snapshot = await db.collection('servicos')
        .where('categoria_id', '==', categoriaId)
        .where('ativo', '==', true)
        .orderBy('data_cadastro', 'desc')
        .limit(limite)
        .get();
      
      return snapshot.docs.map(doc => new Servico({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error('❌ Erro ao buscar serviços por categoria:', error.message);
      throw error;
    }
  }

  // Buscar serviços por usuário
  static async buscarPorUsuario(usuarioId, limite = 50) {
    try {
      const snapshot = await db.collection('servicos')
        .where('usuario_id', '==', usuarioId)
        .orderBy('data_cadastro', 'desc')
        .limit(limite)
        .get();
      
      return snapshot.docs.map(doc => new Servico({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error('❌ Erro ao buscar serviços por usuário:', error.message);
      throw error;
    }
  }

  // Buscar serviços em destaque
  static async buscarDestaques(limite = 10) {
    try {
      const snapshot = await db.collection('servicos')
        .where('destaque', '==', true)
        .where('ativo', '==', true)
        .orderBy('data_cadastro', 'desc')
        .limit(limite)
        .get();
      
      return snapshot.docs.map(doc => new Servico({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error('❌ Erro ao buscar serviços em destaque:', error.message);
      throw error;
    }
  }

  // Buscar serviços por tag
  static async buscarPorTag(tag, limite = 50) {
    try {
      const snapshot = await db.collection('servicos')
        .where('tags', 'array-contains', tag)
        .where('ativo', '==', true)
        .orderBy('data_cadastro', 'desc')
        .limit(limite)
        .get();
      
      return snapshot.docs.map(doc => new Servico({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error('❌ Erro ao buscar serviços por tag:', error.message);
      throw error;
    }
  }

  // Atualizar serviço
  async atualizar(dadosAtualizacao) {
    try {
      if (!this.id) {
        throw new Error('ID do serviço não definido');
      }

      const { id, data_cadastro, ...camposPermitidos } = dadosAtualizacao;

      const dadosParaAtualizar = {
        ...camposPermitidos,
        data_atualizacao: FieldValue.serverTimestamp()
      };

      await db.collection('servicos').doc(this.id).update(dadosParaAtualizar);

      Object.assign(this, camposPermitidos);
      
      console.log('✅ Serviço atualizado com sucesso:', this.id);
      return this;

    } catch (error) {
      console.error('❌ Erro ao atualizar serviço:', error.message);
      throw error;
    }
  }

  // Incrementar visualizações
  async incrementarVisualizacoes() {
    try {
      if (!this.id) {
        throw new Error('ID do serviço não definido');
      }

      await db.collection('servicos').doc(this.id).update({
        visualizacoes: FieldValue.increment(1)
      });

      this.visualizacoes++;
      
      return this;

    } catch (error) {
      console.error('❌ Erro ao incrementar visualizações:', error.message);
      throw error;
    }
  }

  // Desativar serviço
  async desativar() {
    try {
      if (!this.id) {
        throw new Error('ID do serviço não definido');
      }

      await db.collection('servicos').doc(this.id).update({
        ativo: false,
        data_atualizacao: FieldValue.serverTimestamp()
      });

      this.ativo = false;
      
      console.log('✅ Serviço desativado com sucesso:', this.id);
      return this;

    } catch (error) {
      console.error('❌ Erro ao desativar serviço:', error.message);
      throw error;
    }
  }

  // Deletar serviço (permanente)
  async deletar() {
    try {
      if (!this.id) {
        throw new Error('ID do serviço não definido');
      }

      await db.collection('servicos').doc(this.id).delete();
      
      console.log('✅ Serviço deletado com sucesso:', this.id);
      return true;

    } catch (error) {
      console.error('❌ Erro ao deletar serviço:', error.message);
      throw error;
    }
  }

  // Converter para objeto Firestore
  toFirestore() {
    const obj = {};
    
    Object.keys(this).forEach(key => {
      if (this[key] !== undefined && this[key] !== null && key !== 'id') {
        obj[key] = this[key];
      }
    });

    return obj;
  }

  // Converter para JSON
  toJSON() {
    const obj = {
      id: this.id,
      usuario_id: this.usuario_id,
      categoria_id: this.categoria_id,
      titulo: this.titulo,
      descricao: this.descricao,
      tipo: this.tipo,
      preco: this.preco,
      prazo_entrega: this.prazo_entrega,
      imagens: this.imagens,
      tags: this.tags,
      ativo: this.ativo,
      destaque: this.destaque,
      visualizacoes: this.visualizacoes,
      data_cadastro: this.data_cadastro,
      data_atualizacao: this.data_atualizacao
    };

    Object.keys(obj).forEach(key => {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    });

    return obj;
  }
}

export default Servico;

