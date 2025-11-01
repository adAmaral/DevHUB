package servlet;

import dao.UsuarioDAO;
import model.Usuario;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

public class AuthServlet extends HttpServlet {

    private final UsuarioDAO dao = new UsuarioDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");
        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json;charset=UTF-8");
        String path = req.getPathInfo();

        if (path == null) {
            sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Endpoint não encontrado");
            return;
        }

        if ("/logout".equals(path)) {
            HttpSession session = req.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
            return;
        }

        try (BufferedReader reader = req.getReader()) {
            Usuario payload = gson.fromJson(reader, Usuario.class);
            if (payload == null) {
                throw new IllegalArgumentException("Corpo da requisição inválido");
            }

            switch (path) {
                case "/register":
                    handleRegister(payload, resp);
                    break;
                case "/login":
                    handleLogin(payload, req, resp);
                    break;
                default:
                    sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Endpoint não encontrado");
            }
        } catch (IllegalArgumentException ex) {
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Não foi possível processar a requisição");
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json;charset=UTF-8");

        String path = req.getPathInfo();
        if (path == null || "/me".equals(path)) {
            HttpSession session = req.getSession(false);
            if (session == null || session.getAttribute("userId") == null) {
                sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Sessão expirada");
                return;
            }

            int userId = (int) session.getAttribute("userId");
            Usuario user = dao.buscarPorId(userId);
            if (user == null) {
                session.invalidate();
                sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Usuário não encontrado");
                return;
            }

            sendJson(resp, HttpServletResponse.SC_OK, user);
        } else {
            sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Endpoint não encontrado");
        }
    }

    private void handleRegister(Usuario usuario, HttpServletResponse resp) throws IOException {
        boolean sucesso = dao.cadastrar(usuario);
        if (sucesso) {
            Map<String, Object> result = new HashMap<>();
            result.put("sucesso", true);
            sendJson(resp, HttpServletResponse.SC_CREATED, result);
        } else {
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Não foi possível realizar o cadastro");
        }
    }

    private void handleLogin(Usuario usuario, HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Usuario autenticado = dao.login(usuario.getEmail(), usuario.getSenha());
        if (autenticado == null) {
            sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Credenciais inválidas");
            return;
        }

        HttpSession session = req.getSession(true);
        session.setAttribute("userId", autenticado.getId());
        session.setAttribute("userTipo", autenticado.getTipo());
        session.setAttribute("userNome", autenticado.getNome());

        autenticado.setSenha(null);
        sendJson(resp, HttpServletResponse.SC_OK, autenticado);
    }

    private void sendJson(HttpServletResponse resp, int status, Object body) throws IOException {
        resp.setStatus(status);
        try (PrintWriter writer = resp.getWriter()) {
            writer.write(gson.toJson(body));
        }
    }

    private void sendError(HttpServletResponse resp, int status, String message) throws IOException {
        resp.setStatus(status);
        Map<String, Object> result = new HashMap<>();
        result.put("erro", message);
        try (PrintWriter writer = resp.getWriter()) {
            writer.write(gson.toJson(result));
        }
    }
}