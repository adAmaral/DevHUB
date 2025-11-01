package dao;

import model.Categoria;
import util.Conexao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class CategoriaDAO {

    private static final String LISTAR_ATIVAS = "SELECT id_categoria, nome, descricao FROM categorias WHERE ativo = TRUE ORDER BY nome";

    public List<Categoria> listarAtivas() throws Exception {
        List<Categoria> categorias = new ArrayList<>();
        try (Connection connection = Conexao.conectar();
             PreparedStatement statement = connection.prepareStatement(LISTAR_ATIVAS);
             ResultSet rs = statement.executeQuery()) {
            while (rs.next()) {
                Categoria categoria = new Categoria();
                categoria.setId(rs.getInt("id_categoria"));
                categoria.setNome(rs.getString("nome"));
                categoria.setDescricao(rs.getString("descricao"));
                categorias.add(categoria);
            }
        }
        return categorias;
    }
}
