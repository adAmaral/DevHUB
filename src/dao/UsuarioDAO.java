package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.logging.Logger;
import java.util.logging.Level;

import model.Usuario;
import util.Conexao;
import util.PasswordUtil;

public class UsuarioDAO {
    
    private static final Logger logger = Logger.getLogger(UsuarioDAO.class.getName());

    public boolean cadastrar(Usuario u) throws Exception {
        System.err.println("[CADASTRO DEBUG] Iniciando cadastro de usuário");
        System.err.println("[CADASTRO DEBUG] Nome: " + u.getNome() + ", Email: " + u.getEmail() + ", Tipo: " + u.getTipo());
        
        String sql = "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)";
        System.err.println("[CADASTRO DEBUG] Tentando conectar ao banco...");
        
        try (Connection c = Conexao.conectar()) {
            // Garantir que auto-commit está habilitado (deve estar por padrão)
            boolean autoCommit = c.getAutoCommit();
            System.err.println("[CADASTRO DEBUG] Auto-commit está: " + autoCommit);
            
            System.err.println("[CADASTRO DEBUG] Conexão estabelecida, preparando statement...");
            try (PreparedStatement ps = c.prepareStatement(sql)) {
                ps.setString(1, u.getNome());
                ps.setString(2, u.getEmail() == null ? null : u.getEmail().toLowerCase());
                String hashed = PasswordUtil.hashPassword(u.getSenha());
                System.err.println("[CADASTRO DEBUG] Senha hash gerada (primeiros 50 chars): " + 
                    (hashed != null && hashed.length() > 50 ? hashed.substring(0, 50) : hashed));
                ps.setString(3, hashed);
                ps.setString(4, u.getTipo());
                
                System.err.println("[CADASTRO DEBUG] Executando INSERT...");
                int rowsAffected = ps.executeUpdate();
                System.err.println("[CADASTRO DEBUG] INSERT executado, linhas afetadas: " + rowsAffected);
                
                // Garantir commit explícito
                if (!autoCommit) {
                    c.commit();
                    System.err.println("[CADASTRO DEBUG] Commit explícito executado");
                } else {
                    System.err.println("[CADASTRO DEBUG] Auto-commit já garante persistência");
                }
                
                if (rowsAffected > 0) {
                    System.err.println("[CADASTRO DEBUG] Cadastro bem-sucedido! Usuário inserido.");
                    
                    // Verificar se o usuário foi realmente inserido
                    try (PreparedStatement checkPs = c.prepareStatement(
                            "SELECT id_usuario, email, ativo FROM usuarios WHERE email = ?")) {
                        checkPs.setString(1, u.getEmail() == null ? null : u.getEmail().toLowerCase());
                        ResultSet rs = checkPs.executeQuery();
                        if (rs.next()) {
                            System.err.println("[CADASTRO DEBUG] Verificação pós-INSERT - ID: " + rs.getInt("id_usuario") + 
                                ", Email: " + rs.getString("email") + ", Ativo: " + rs.getBoolean("ativo"));
                        } else {
                            System.err.println("[CADASTRO DEBUG] AVISO: Usuário não encontrado após INSERT!");
                        }
                    }
                    
                    return true;
                } else {
                    System.err.println("[CADASTRO DEBUG] Nenhuma linha foi inserida");
                    return false;
                }
            }
        } catch (java.sql.SQLException e) {
            System.err.println("[CADASTRO DEBUG] Erro SQL: " + e.getMessage());
            System.err.println("[CADASTRO DEBUG] SQL State: " + e.getSQLState());
            System.err.println("[CADASTRO DEBUG] Error Code: " + e.getErrorCode());
            e.printStackTrace();
            
            // Verificar se é erro de email duplicado
            if (e.getSQLState() != null && e.getSQLState().equals("23505")) { // UNIQUE violation
                System.err.println("[CADASTRO DEBUG] Erro: E-mail já cadastrado (UNIQUE constraint)");
                throw new Exception("E-mail já cadastrado. Use outro e-mail ou faça login.", e);
            }
            
            throw new Exception("Erro de conexão com o banco de dados: " + e.getMessage(), e);
        }
    }

    public Usuario login(String email, String senha) throws Exception {
        System.err.println("[DAO DEBUG] Iniciando login para email: " + email);
        String sql = "SELECT id_usuario, nome, email, tipo, senha FROM usuarios WHERE email = ? AND ativo = TRUE";
        System.err.println("[DAO DEBUG] Tentando conectar ao banco...");
        try (Connection c = Conexao.conectar()) {
            System.err.println("[DAO DEBUG] Conexão estabelecida, criando PreparedStatement...");
            try (PreparedStatement ps = c.prepareStatement(sql)) {
                ps.setString(1, email == null ? null : email.toLowerCase());
                System.err.println("[DAO DEBUG] Executando query...");
                ResultSet rs = ps.executeQuery();
                System.err.println("[DAO DEBUG] Query executada, verificando resultados...");
                if (rs.next()) {
                String storedHash = rs.getString("senha");
                
                // Debug: verificar formato da senha armazenada
                logger.log(Level.INFO, "[LOGIN] Email: {0}", email);
                logger.log(Level.INFO, "[LOGIN] Senha recebida: {0}", senha != null ? "***" : "null");
                logger.log(Level.INFO, "[LOGIN] Hash armazenado (primeiros 50 chars): {0}", 
                    storedHash != null ? storedHash.substring(0, Math.min(50, storedHash.length())) : "null");
                
                // Detectar se a senha está no formato SCRAM-SHA-256 do PostgreSQL (formato incorreto)
                if (storedHash != null && storedHash.startsWith("SCRAM-SHA-256$")) {
                    logger.log(Level.WARNING, "[LOGIN] Formato SCRAM-SHA-256 detectado - senha precisa ser atualizada no banco");
                    return null;
                }
                
                // Caso já esteja no formato seguro PBKDF2
                System.err.println("[LOGIN DEBUG] Email: " + email);
                System.err.println("[LOGIN DEBUG] Senha recebida: " + (senha != null ? "***" : "null"));
                System.err.println("[LOGIN DEBUG] Hash armazenado (primeiros 60 chars): " + 
                    (storedHash != null && storedHash.length() > 60 ? storedHash.substring(0, 60) : storedHash));
                logger.log(Level.INFO, "[LOGIN] Tentando verificar senha com PBKDF2. Hash armazenado inicia com: {0}", 
                    storedHash != null && storedHash.length() > 50 ? storedHash.substring(0, 50) : storedHash);
                boolean verified = PasswordUtil.verifyPassword(senha, storedHash);
                System.err.println("[LOGIN DEBUG] Verificação PBKDF2 resultado: " + verified);
                logger.log(Level.INFO, "[LOGIN] Verificação PBKDF2 resultado: {0}", verified);
                if (verified) {
                    System.err.println("[LOGIN DEBUG] Autenticação bem-sucedida!");
                    logger.log(Level.INFO, "[LOGIN] Autenticação bem-sucedida para email: {0}", email);
                    Usuario u = new Usuario();
                    u.setId(rs.getInt("id_usuario"));
                    u.setNome(rs.getString("nome"));
                    u.setEmail(rs.getString("email"));
                    u.setTipo(rs.getString("tipo"));
                    return u;
                } else {
                    System.err.println("[LOGIN DEBUG] Senha NÃO confere para email: " + email);
                    logger.log(Level.WARNING, "[LOGIN] Senha não confere para email: {0}", email);
                }
                
                // Fallback: senha armazenada em texto puro (legado). Migra para PBKDF2 se bater
                if (storedHash != null && !storedHash.contains(":") && senha != null) {
                    logger.log(Level.INFO, "[LOGIN] Tentando verificação texto puro");
                    if (senha.equals(storedHash)) {
                        logger.log(Level.INFO, "[LOGIN] Senha texto puro verificada - migrando para PBKDF2");
                        String newHash = PasswordUtil.hashPassword(senha);
                        try (PreparedStatement up = c.prepareStatement(
                                "UPDATE usuarios SET senha = ? WHERE id_usuario = ?")) {
                            up.setString(1, newHash);
                            up.setInt(2, rs.getInt("id_usuario"));
                            up.executeUpdate();
                        }
                        Usuario u = new Usuario();
                        u.setId(rs.getInt("id_usuario"));
                        u.setNome(rs.getString("nome"));
                        u.setEmail(rs.getString("email"));
                        u.setTipo(rs.getString("tipo"));
                        return u;
                    }
                }
                
                    logger.log(Level.WARNING, "[LOGIN] Nenhuma verificação de senha passou para email: {0}", email);
                } else {
                    System.err.println("[DAO DEBUG] Usuário não encontrado ou inativo para email: " + email);
                    logger.log(Level.WARNING, "[LOGIN] Usuário não encontrado ou inativo para email: {0}", email);
                }
                // Usuário não encontrado ou credenciais inválidas - retorna null sem exceção
                return null;
            }
        } catch (java.sql.SQLException e) {
            // Re-lançar exceções de SQL para que o servlet possa diferenciá-las
            e.printStackTrace();
            throw new Exception("Erro de conexão com o banco de dados: " + e.getMessage(), e);
        }
    }

    public Usuario buscarPorId(int id) throws Exception {
        String sql = "SELECT id_usuario, nome, email, tipo FROM usuarios WHERE id_usuario = ? AND ativo = TRUE";
        try (Connection c = Conexao.conectar();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Usuario u = new Usuario();
                u.setId(rs.getInt("id_usuario"));
                u.setNome(rs.getString("nome"));
                u.setEmail(rs.getString("email"));
                u.setTipo(rs.getString("tipo"));
                return u;
            }
            return null;
        } catch (java.sql.SQLException e) {
            e.printStackTrace();
            throw new Exception("Erro de conexão com o banco de dados: " + e.getMessage(), e);
        }
    }
}