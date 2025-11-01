package servlet;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import dao.CategoriaDAO;
import dao.ServicoDAO;
import model.Categoria;
import model.Servico;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ServicoServlet extends HttpServlet {

    private final ServicoDAO servicoDAO = new ServicoDAO();
    private final CategoriaDAO categoriaDAO = new CategoriaDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json;charset=UTF-8");

        String path = req.getPathInfo();

        if (path != null && path.equals("/categorias")) {
            try {
                List<Categoria> categorias = categoriaDAO.listarAtivas();
                writeJson(resp, HttpServletResponse.SC_OK, categorias);
            } catch (Exception e) {
                e.printStackTrace();
                writeError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Não foi possível carregar categorias");
            }
            return;
        }

        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            writeError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Sessão expirada");
            return;
        }

        int userId = (int) session.getAttribute("userId");

        if (path != null && path.startsWith("/me")) {
            String tipo = req.getParameter("tipo");
            try {
                List<Servico> servicos = servicoDAO.listarPorUsuario(userId, tipo);
                writeJson(resp, HttpServletResponse.SC_OK, servicos);
            } catch (Exception e) {
                e.printStackTrace();
                writeError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Não foi possível carregar os registros");
            }
            return;
        }

        writeError(resp, HttpServletResponse.SC_NOT_FOUND, "Endpoint não encontrado");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            writeError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Sessão expirada");
            return;
        }

        String userTipo = (String) session.getAttribute("userTipo");
        if (!"empresa".equals(userTipo) && !"freelancer".equals(userTipo)) {
            writeError(resp, HttpServletResponse.SC_FORBIDDEN, "Usuário sem permissão para cadastrar serviços");
            return;
        }

        try (BufferedReader reader = req.getReader()) {
            ServicoPayload payload = gson.fromJson(reader, ServicoPayload.class);
            validatePayload(payload);

            Servico servico = payload.toServico();
            servico.setUsuarioId((int) session.getAttribute("userId"));

            if ("empresa".equals(userTipo) && !"produto".equals(servico.getTipo())) {
                servico.setTipo("produto");
            }
            if ("freelancer".equals(userTipo) && !"servico".equals(servico.getTipo())) {
                servico.setTipo("servico");
            }

            int novoId = servicoDAO.criar(servico);
            Map<String, Object> result = new HashMap<>();
            result.put("id", novoId);
            writeJson(resp, HttpServletResponse.SC_CREATED, result);
        } catch (JsonSyntaxException ex) {
            writeError(resp, HttpServletResponse.SC_BAD_REQUEST, "JSON inválido");
        } catch (IllegalArgumentException ex) {
            writeError(resp, HttpServletResponse.SC_BAD_REQUEST, ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            writeError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao cadastrar serviço");
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            writeError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Sessão expirada");
            return;
        }

        int userId = (int) session.getAttribute("userId");
        Integer servicoId = extractId(req.getPathInfo());
        if (servicoId == null) {
            writeError(resp, HttpServletResponse.SC_BAD_REQUEST, "Identificador inválido");
            return;
        }

        try (BufferedReader reader = req.getReader()) {
            ServicoPayload payload = gson.fromJson(reader, ServicoPayload.class);
            validatePayload(payload);

            Servico existente = servicoDAO.buscarPorId(servicoId, userId);
            if (existente == null) {
                writeError(resp, HttpServletResponse.SC_NOT_FOUND, "Registro não encontrado");
                return;
            }

            Servico servicoAtualizado = payload.toServico();
            servicoAtualizado.setId(servicoId);
            servicoAtualizado.setUsuarioId(userId);
            servicoAtualizado.setTipo(existente.getTipo());

            boolean atualizado = servicoDAO.atualizar(servicoAtualizado);
            if (!atualizado) {
                writeError(resp, HttpServletResponse.SC_BAD_REQUEST, "Não foi possível atualizar o registro");
                return;
            }

            writeJson(resp, HttpServletResponse.SC_NO_CONTENT, null);
        } catch (JsonSyntaxException ex) {
            writeError(resp, HttpServletResponse.SC_BAD_REQUEST, "JSON inválido");
        } catch (IllegalArgumentException ex) {
            writeError(resp, HttpServletResponse.SC_BAD_REQUEST, ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            writeError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao atualizar registro");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            writeError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Sessão expirada");
            return;
        }

        int userId = (int) session.getAttribute("userId");
        Integer servicoId = extractId(req.getPathInfo());
        if (servicoId == null) {
            writeError(resp, HttpServletResponse.SC_BAD_REQUEST, "Identificador inválido");
            return;
        }

        try {
            boolean removido = servicoDAO.excluir(servicoId, userId);
            if (!removido) {
                writeError(resp, HttpServletResponse.SC_NOT_FOUND, "Registro não encontrado");
                return;
            }
            writeJson(resp, HttpServletResponse.SC_NO_CONTENT, null);
        } catch (Exception ex) {
            ex.printStackTrace();
            writeError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao remover registro");
        }
    }

    private Integer extractId(String pathInfo) {
        if (pathInfo == null || pathInfo.length() <= 1) {
            return null;
        }
        try {
            return Integer.parseInt(pathInfo.substring(1));
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private void validatePayload(ServicoPayload payload) {
        if (payload == null) {
            throw new IllegalArgumentException("Dados obrigatórios não informados");
        }
        if (payload.titulo == null || payload.titulo.isBlank() ||
            payload.descricao == null || payload.descricao.isBlank() ||
            payload.preco == null || payload.preco.compareTo(BigDecimal.ZERO) <= 0 ||
            payload.categoriaId == null || payload.categoriaId <= 0) {
            throw new IllegalArgumentException("Preencha todos os campos obrigatórios");
        }
    }

    private void writeJson(HttpServletResponse resp, int status, Object body) throws IOException {
        resp.setStatus(status);
        if (body == null) {
            return;
        }
        try (PrintWriter writer = resp.getWriter()) {
            writer.write(gson.toJson(body));
        }
    }

    private void writeError(HttpServletResponse resp, int status, String message) throws IOException {
        resp.setStatus(status);
        Map<String, Object> result = new HashMap<>();
        result.put("erro", message);
        try (PrintWriter writer = resp.getWriter()) {
            writer.write(gson.toJson(result));
        }
    }

    private static class ServicoPayload {
        String titulo;
        String descricao;
        BigDecimal preco;
        Integer categoriaId;
        Integer prazoEntrega;
        List<String> tags;
        String tipo;

        Servico toServico() {
            Servico servico = new Servico();
            servico.setTitulo(titulo);
            servico.setDescricao(descricao);
            servico.setPreco(preco);
            servico.setCategoriaId(categoriaId);
            servico.setPrazoEntrega(prazoEntrega);
            servico.setTags(tags);
            servico.setTipo(tipo == null ? "servico" : tipo);
            return servico;
        }
    }
}


