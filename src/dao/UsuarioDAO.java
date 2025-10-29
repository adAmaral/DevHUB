package dao;

import model.Usuario;
import util.Conexao;
import util.PasswordUtil;
import java.sql.*;

public class UsuarioDAO {

    public boolean cadastrar(Usuario u) {
        String sql = "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)";
        try (Connection c = Conexao.conectar();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, u.getNome());
            ps.setString(2, u.getEmail() == null ? null : u.getEmail().toLowerCase());
            String hashed = PasswordUtil.hashPassword(u.getSenha());
            ps.setString(3, hashed);
            ps.setString(4, u.getTipo());
            ps.executeUpdate();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public Usuario login(String email, String senha) {
        String sql = "SELECT id_usuario, nome, email, tipo, senha FROM usuarios WHERE email = ? AND ativo = TRUE";
        try (Connection c = Conexao.conectar();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, email == null ? null : email.toLowerCase());
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                String storedHash = rs.getString("senha");
                // Caso já esteja no formato seguro PBKDF2
                if (PasswordUtil.verifyPassword(senha, storedHash)) {
                    Usuario u = new Usuario();
                    u.setId(rs.getInt("id_usuario"));
                    u.setNome(rs.getString("nome"));
                    u.setEmail(rs.getString("email"));
                    u.setTipo(rs.getString("tipo"));
                    return u;
                }
                // Fallback: senha armazenada em texto puro (seed antigo). Migra para PBKDF2 se bater
                if (storedHash != null && !storedHash.contains(":")) {
                    if (senha != null && senha.equals(storedHash)) {
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
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}