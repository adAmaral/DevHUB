// ==============================
// ✅ MODEL - USUÁRIO
// ==============================
const db = require("../config/database");

class Usuario {
  constructor(data) {
    this.nome = data.nome;
    this.email = data.email;
    this.senha = data.senha;
    this.tipo = data.tipo || "cliente";
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
    this.ativo = true;
  }

  async salvar() {
    const sql = `
      INSERT INTO usuarios (
        nome, email, senha, tipo, telefone, endereco, cidade, estado, cep,
        data_nascimento, cpf_cnpj, descricao, foto_perfil, nome_fantasia,
        razao_social, area_atuacao, especialidades, portfolio_url, site_url, ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
      this.nome,
      this.email,
      this.senha,
      this.tipo,
      this.telefone,
      this.endereco,
      this.cidade,
      this.estado,
      this.cep,
      this.data_nascimento,
      this.cpf_cnpj,
      this.descricao,
      this.foto_perfil,
      this.nome_fantasia,
      this.razao_social,
      this.area_atuacao,
      JSON.stringify(this.especialidades || []),
      this.portfolio_url,
      this.site_url,
      this.ativo,
    ];

    try {
      const [resultado] = await db.execute(sql, valores);
      return { id: resultado.insertId, nome: this.nome, email: this.email };
    } catch (erro) {
      console.error("❌ Erro ao salvar usuário no banco:", erro.message);
      throw erro;
    }
  }

  static async buscarPorEmail(email) {
    try {
      const [linhas] = await db.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
      return linhas[0] || null;
    } catch (erro) {
      console.error("❌ Erro ao buscar usuário:", erro.message);
      throw erro;
    }
  }
}

module.exports = Usuario;