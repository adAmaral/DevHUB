package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.postgresql.util.PGobject;

import com.google.gson.Gson;

import model.Servico;
import util.Conexao;

public class ServicoDAO {

    private final Gson gson = new Gson();

    private static final String INSERT_SERVICO =    
            "INSERT INTO servicos (usuario_id, categoria_id, titulo, descricao, tipo, preco, prazo_entrega, tags, ativo) " +
            "VALUES (?, ?, ?, ?, ?::tipo_servico, ?, ?, ?::jsonb, TRUE) RETURNING id_servico";

    private static final String UPDATE_SERVICO =
            "UPDATE servicos SET categoria_id = ?, titulo = ?, descricao = ?, preco = ?, prazo_entrega = ?, tags = ?::jsonb, data_atualizacao = NOW() " +
            "WHERE id_servico = ? AND usuario_id = ?";

    private static final String DELETE_SERVICO =
            "DELETE FROM servicos WHERE id_servico = ? AND usuario_id = ?";

    private static final String SELECT_POR_ID =
            "SELECT s.id_servico, s.usuario_id, s.categoria_id, s.titulo, s.descricao, s.tipo, s.preco, s.prazo_entrega, s.tags, " +
            "s.visualizacoes, s.ativo, c.nome AS categoria_nome " +
            "FROM servicos s JOIN categorias c ON c.id_categoria = s.categoria_id " +
            "WHERE s.id_servico = ? AND s.usuario_id = ?";

    private static final String SELECT_POR_USUARIO =
            "SELECT s.id_servico, s.usuario_id, s.categoria_id, s.titulo, s.descricao, s.tipo, s.preco, s.prazo_entrega, s.tags, " +
            "s.visualizacoes, s.ativo, c.nome AS categoria_nome " +
            "FROM servicos s JOIN categorias c ON c.id_categoria = s.categoria_id " +
            "WHERE s.usuario_id = ? %s ORDER BY s.data_atualizacao DESC";

    private PGobject jsonbValue(List<String> valores) throws SQLException {
        PGobject jsonbObject = new PGobject();
        jsonbObject.setType("jsonb");
        jsonbObject.setValue(valores == null ? "[]" : gson.toJson(valores));
        return jsonbObject;
    }

    private List<String> parseTags(String json) {
        if (json == null || json.isEmpty()) {
            return Collections.emptyList();
        }
        List<?> raw = gson.fromJson(json, List.class);
        List<String> result = new ArrayList<>();
        for (Object item : raw) {
            if (item != null) {
                result.add(item.toString());
            }
        }   
        return result;
    }

    public int criar(Servico servico) throws Exception {
        try (Connection connection = Conexao.conectar();
             PreparedStatement statement = connection.prepareStatement(INSERT_SERVICO)) {
            statement.setInt(1, servico.getUsuarioId());
            statement.setInt(2, servico.getCategoriaId());
            statement.setString(3, servico.getTitulo());
            statement.setString(4, servico.getDescricao());
            statement.setString(5, servico.getTipo());
            statement.setBigDecimal(6, servico.getPreco());
            if (servico.getPrazoEntrega() != null) {
                statement.setInt(7, servico.getPrazoEntrega());
            } else {
                statement.setNull(7, Types.INTEGER);
            }
            statement.setObject(8, jsonbValue(servico.getTags()));

            try (ResultSet rs = statement.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        throw new SQLException("Falha ao criar serviço");
    }

    public boolean atualizar(Servico servico) throws Exception {
        try (Connection connection = Conexao.conectar();
             PreparedStatement statement = connection.prepareStatement(UPDATE_SERVICO)) {
            statement.setInt(1, servico.getCategoriaId());
            statement.setString(2, servico.getTitulo());
            statement.setString(3, servico.getDescricao());
            statement.setBigDecimal(4, servico.getPreco());
            if (servico.getPrazoEntrega() != null) {
                statement.setInt(5, servico.getPrazoEntrega());
            } else {
                statement.setNull(5, Types.INTEGER);
            }
            statement.setObject(6, jsonbValue(servico.getTags()));
            statement.setInt(7, servico.getId());
            statement.setInt(8, servico.getUsuarioId());
            return statement.executeUpdate() > 0;
        }
    }

    public boolean excluir(int servicoId, int usuarioId) throws Exception {
        try (Connection connection = Conexao.conectar();
             PreparedStatement statement = connection.prepareStatement(DELETE_SERVICO)) {
            statement.setInt(1, servicoId);
            statement.setInt(2, usuarioId);
            return statement.executeUpdate() > 0;
        }
    }

    public Servico buscarPorId(int servicoId, int usuarioId) throws Exception {
        try (Connection connection = Conexao.conectar();
             PreparedStatement statement = connection.prepareStatement(SELECT_POR_ID)) {
            statement.setInt(1, servicoId);
            statement.setInt(2, usuarioId);
            try (ResultSet rs = statement.executeQuery()) {
                if (rs.next()) {
                    return mapServico(rs);
                }
            }
        }
        return null;
    }

    public List<Servico> listarPorUsuario(int usuarioId, String tipo) throws Exception {
        String filtroTipo = (tipo != null && !tipo.isEmpty()) ? "AND s.tipo = ?::tipo_servico" : "";
        String sql = String.format(SELECT_POR_USUARIO, filtroTipo);
        try (Connection connection = Conexao.conectar();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, usuarioId);
            if (!filtroTipo.isEmpty()) {
                statement.setString(2, tipo);
            }
            try (ResultSet rs = statement.executeQuery()) {
                List<Servico> servicos = new ArrayList<>();
                while (rs.next()) {
                    servicos.add(mapServico(rs));
                }
                return servicos;
            }
        }
    }

    private Servico mapServico(ResultSet rs) throws SQLException {
        Servico servico = new Servico();
        servico.setId(rs.getInt("id_servico"));
        servico.setUsuarioId(rs.getInt("usuario_id"));
        servico.setCategoriaId(rs.getInt("categoria_id"));
        servico.setCategoriaNome(rs.getString("categoria_nome"));
        servico.setTitulo(rs.getString("titulo"));
        servico.setDescricao(rs.getString("descricao"));
        servico.setTipo(rs.getString("tipo"));
        servico.setPreco(rs.getBigDecimal("preco"));
        int prazo = rs.getInt("prazo_entrega");
        servico.setPrazoEntrega(rs.wasNull() ? null : prazo);
        servico.setTags(parseTags(rs.getString("tags")));
        int views = rs.getInt("visualizacoes");
        servico.setVisualizacoes(rs.wasNull() ? 0 : views);
        servico.setAtivo(rs.getBoolean("ativo"));
        return servico;
    }
}
