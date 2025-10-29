package servlet;

import dao.UsuarioDAO;
import model.Usuario;
import com.google.gson.Gson;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;

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

        try (BufferedReader reader = req.getReader()) {
            Usuario u = gson.fromJson(reader, Usuario.class);

            if (path == null) {
                resp.setStatus(404);
                resp.getWriter().write("{\"erro\":\"Endpoint não encontrado\"}");
                return;
            }

            switch (path) {
                case "/register":
                    boolean sucesso = dao.cadastrar(u);
                    if (sucesso) {
                        resp.setStatus(201);
                    }
                    resp.getWriter().write("{\"sucesso\":" + sucesso + "}");
                    break;
                case "/login":
                    Usuario user = dao.login(u.getEmail(), u.getSenha());
                    if (user != null) {
                        resp.getWriter().write(gson.toJson(user));
                    } else {
                        resp.setStatus(401);
                        resp.getWriter().write("{\"erro\":\"Credenciais inválidas\"}");
                    }
                    break;
                default:
                    resp.setStatus(404);
                    resp.getWriter().write("{\"erro\":\"Endpoint não encontrado\"}");
            }
        } catch (Exception e) {
            resp.setStatus(400);
            resp.getWriter().write("{\"erro\":\"Requisição inválida\"}");
        }
    }
}