package servlet;

import dao.UsuarioDAO;
import model.Usuario;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;
import java.util.logging.Level;

@WebServlet(name = "AuthServlet", urlPatterns = {"/auth/*"})
public class AuthServlet extends HttpServlet {

    private final UsuarioDAO dao = new UsuarioDAO();
    private final Gson gson = new Gson();
    private static final Logger logger = Logger.getLogger(AuthServlet.class.getName());

    @Override
    public void init() throws ServletException {
        super.init();
        System.err.println("[AUTH INIT] AuthServlet inicializado!");
        logger.log(Level.INFO, "[AUTH INIT] AuthServlet inicializado");
    }

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String method = req.getMethod();
        String requestURI = req.getRequestURI();
        
        // Logs MUITO visíveis para debug - ANTES DE QUALQUER COISA
        System.err.println("========================================");
        System.err.println("[AUTH SERVICE] *** SERVLET FOI CHAMADO ***");
        System.err.println("[AUTH SERVICE] Método: " + method);
        System.err.println("[AUTH SERVICE] Request URI: " + requestURI);
        System.err.println("[AUTH SERVICE] PathInfo: " + req.getPathInfo());
        System.err.println("[AUTH SERVICE] ServletPath: " + req.getServletPath());
        System.err.println("[AUTH SERVICE] ContextPath: " + req.getContextPath());
        System.err.println("[AUTH SERVICE] QueryString: " + req.getQueryString());
        System.err.println("[AUTH SERVICE] Request URL: " + req.getRequestURL());
        System.err.println("========================================");
        
        // Usar o comportamento padrão do HttpServlet que roteia para doGet/doPost
        super.service(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");
        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json;charset=UTF-8");
        String path = req.getPathInfo();
        String requestURI = req.getRequestURI();
        
        System.err.println("[AUTH POST DEBUG] Method: " + req.getMethod());
        System.err.println("[AUTH POST DEBUG] PathInfo: " + path);
        System.err.println("[AUTH POST DEBUG] Request URI: " + requestURI);
        System.err.println("[AUTH POST DEBUG] Servlet Path: " + req.getServletPath());
        
        // Se pathInfo for null, tentar extrair da URI
        if (path == null && requestURI != null && requestURI.contains("/auth")) {
            String[] parts = requestURI.split("/auth");
            if (parts.length > 1) {
                path = parts[1];
                if (path.isEmpty()) {
                    path = null;
                } else if (!path.startsWith("/")) {
                    path = "/" + path;
                }
                System.err.println("[AUTH POST DEBUG] Path extraído da URI: " + path);
            }
        }

        if (path == null) {
            System.err.println("[AUTH POST DEBUG] PathInfo é null, retornando 404");
            sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Endpoint não encontrado");
            return;
        }

        if ("/logout".equals(path)) {
            System.err.println("[AUTH POST DEBUG] Processando logout");
            HttpSession session = req.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
            return;
        }

        try (BufferedReader reader = req.getReader()) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            String body = sb.toString();
            System.err.println("[AUTH POST DEBUG] Body recebido (tamanho: " + (body != null ? body.length() : 0) + " chars)");
            if (body != null && body.length() > 200) {
                System.err.println("[AUTH POST DEBUG] Body preview: " + body.substring(0, 200));
            } else {
                System.err.println("[AUTH POST DEBUG] Body completo: " + body);
            }
            
            if (body == null || body.trim().isEmpty()) {
                System.err.println("[AUTH POST DEBUG] Body está vazio ou null");
                throw new IllegalArgumentException("Corpo da requisição inválido");
            }
            
            Usuario payload = gson.fromJson(body, Usuario.class);
            if (payload == null) {
                System.err.println("[AUTH POST DEBUG] Payload é null após parse do JSON");
                throw new IllegalArgumentException("Corpo da requisição inválido");
            }
            
            System.err.println("[AUTH POST DEBUG] Payload parseado - Email: " + payload.getEmail() + 
                ", Nome: " + payload.getNome() + ", Tipo: " + payload.getTipo());

            switch (path) {
                case "/register":
                    System.err.println("[AUTH POST DEBUG] Roteando para handleRegister");
                    handleRegister(payload, resp);
                    break;
                case "/login":
                    System.err.println("[AUTH POST DEBUG] Roteando para handleLogin");
                    handleLogin(payload, req, resp);
                    break;
                default:
                    System.err.println("[AUTH POST DEBUG] Path desconhecido: " + path);
                    sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Endpoint não encontrado");
            }
        } catch (IllegalArgumentException ex) {
            System.err.println("[AUTH POST DEBUG] IllegalArgumentException: " + ex.getMessage());
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, ex.getMessage());
        } catch (Exception ex) {
            System.err.println("[AUTH POST DEBUG] Exception geral: " + ex.getMessage());
            ex.printStackTrace();
            sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Não foi possível processar a requisição");
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json;charset=UTF-8");

        String path = req.getPathInfo();
        String requestURI = req.getRequestURI();
        String servletPath = req.getServletPath();
        String contextPath = req.getContextPath();
        
        System.err.println("[AUTH GET DEBUG] PathInfo: " + path);
        System.err.println("[AUTH GET DEBUG] Request URI: " + requestURI);
        System.err.println("[AUTH GET DEBUG] Servlet Path: " + servletPath);
        System.err.println("[AUTH GET DEBUG] Context Path: " + contextPath);
        System.err.println("[AUTH GET DEBUG] Method: " + req.getMethod());
        
        // Se pathInfo for null, tentar extrair da URI
        if (path == null || path.isEmpty()) {
            if (requestURI != null && requestURI.contains("/auth")) {
                // Remover contextPath se existir
                String uri = requestURI;
                if (contextPath != null && !contextPath.isEmpty()) {
                    uri = requestURI.substring(contextPath.length());
                }
                
                // Extrair o path após /auth
                int authIndex = uri.indexOf("/auth");
                if (authIndex >= 0) {
                    String afterAuth = uri.substring(authIndex + "/auth".length());
                    if (afterAuth.isEmpty() || "/".equals(afterAuth)) {
                        path = "/me"; // Default para /me se não houver path
                    } else {
                        path = afterAuth.startsWith("/") ? afterAuth : "/" + afterAuth;
                    }
                    System.err.println("[AUTH GET DEBUG] Path extraído da URI: " + path);
                } else {
                    // Se a URI contém /auth mas não conseguimos extrair, assumir /me
                    path = "/me";
                    System.err.println("[AUTH GET DEBUG] URI contém /auth mas path não pôde ser extraído, assumindo /me");
                }
            } else {
                // Se não há /auth na URI mas estamos aqui, assumir /me
                path = "/me";
                System.err.println("[AUTH GET DEBUG] PathInfo null e URI não contém /auth, assumindo /me");
            }
        }
        
        // Verificar se é o endpoint /me
        boolean isMeEndpoint = "/me".equals(path) || path == null || path.isEmpty() || "/".equals(path);
        
        System.err.println("[AUTH GET DEBUG] Processando - path: " + path + ", isMeEndpoint: " + isMeEndpoint);
        
        if (isMeEndpoint) {
            System.err.println("[AUTH GET DEBUG] Acessando endpoint /me");
            HttpSession session = req.getSession(false);
            System.err.println("[AUTH GET DEBUG] Sessão existe: " + (session != null));
            
            if (session == null) {
                System.err.println("[AUTH GET DEBUG] Sessão não encontrada");
                sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Sessão expirada");
                return;
            }
            
            Object userIdObj = session.getAttribute("userId");
            System.err.println("[AUTH GET DEBUG] userId na sessão: " + userIdObj);
            
            if (userIdObj == null) {
                System.err.println("[AUTH GET DEBUG] userId não encontrado na sessão");
                sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Sessão expirada");
                return;
            }

            try {
                int userId = (int) userIdObj;
                System.err.println("[AUTH GET DEBUG] Buscando usuário com ID: " + userId);
                Usuario user = dao.buscarPorId(userId);
                
                if (user == null) {
                    System.err.println("[AUTH GET DEBUG] Usuário não encontrado no banco");
                    session.invalidate();
                    sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Usuário não encontrado");
                    return;
                }

                System.err.println("[AUTH GET DEBUG] Usuário encontrado - ID: " + user.getId() + 
                    ", Nome: " + user.getNome() + ", Tipo: " + user.getTipo());
                
                user.setSenha(null);
                sendJson(resp, HttpServletResponse.SC_OK, user);
            } catch (Exception e) {
                System.err.println("[AUTH GET DEBUG] Erro ao buscar usuário: " + e.getMessage());
                e.printStackTrace();
                String errorMessage = e.getMessage();
                if (errorMessage != null && errorMessage.contains("banco de dados")) {
                    sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                        "Erro ao conectar com o banco de dados. Verifique se o PostgreSQL está rodando e as credenciais estão corretas.");
                } else {
                    sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                        "Erro interno ao buscar usuário. Verifique os logs do servidor.");
                }
            }
        } else {
            System.err.println("[AUTH GET DEBUG] Path desconhecido: " + path);
            sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Endpoint não encontrado");
        }
    }

    private void handleRegister(Usuario usuario, HttpServletResponse resp) throws IOException {
        try {
            System.err.println("[REGISTER DEBUG] Iniciando registro - Email: " + usuario.getEmail() + 
                ", Nome: " + usuario.getNome() + ", Tipo: " + usuario.getTipo());
            logger.log(Level.INFO, "[AUTH] Tentativa de registro para email: {0}", usuario.getEmail());
            
            boolean sucesso = dao.cadastrar(usuario);
            
            if (sucesso) {
                System.err.println("[REGISTER DEBUG] Registro bem-sucedido para email: " + usuario.getEmail());
                logger.log(Level.INFO, "[AUTH] Registro bem-sucedido para email: {0}", usuario.getEmail());
                Map<String, Object> result = new HashMap<>();
                result.put("sucesso", true);
                sendJson(resp, HttpServletResponse.SC_CREATED, result);
            } else {
                System.err.println("[REGISTER DEBUG] Registro retornou false (usuário já existe?)");
                logger.log(Level.WARNING, "[AUTH] Registro falhou para email: {0}", usuario.getEmail());
                sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Não foi possível realizar o cadastro. Verifique se o e-mail já está cadastrado.");
            }
        } catch (Exception e) {
            System.err.println("[REGISTER DEBUG] ERRO ao processar registro: " + e.getMessage());
            System.err.println("[REGISTER DEBUG] Tipo do erro: " + e.getClass().getName());
            e.printStackTrace();
            logger.log(Level.SEVERE, "[AUTH] Erro ao processar registro: {0}", e.getMessage());
            String errorMessage = e.getMessage();
            if (errorMessage != null && errorMessage.contains("banco de dados")) {
                sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                    "Erro ao conectar com o banco de dados. Verifique se o PostgreSQL está rodando e as credenciais estão corretas.");
            } else if (errorMessage != null && (errorMessage.contains("UNIQUE") || errorMessage.contains("duplicate") || errorMessage.contains("já existe"))) {
                sendError(resp, HttpServletResponse.SC_BAD_REQUEST, 
                    "E-mail já cadastrado. Use outro e-mail ou faça login.");
            } else {
                sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                    "Erro interno ao processar cadastro. Verifique os logs do servidor.");
            }
        }
    }

    private void handleLogin(Usuario usuario, HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            System.err.println("[AUTH DEBUG] Tentativa de login - Email: " + usuario.getEmail() + ", Senha: " + (usuario.getSenha() != null ? "***" : "null"));
            logger.log(Level.INFO, "[AUTH] Tentativa de login para email: {0}", usuario.getEmail());
            Usuario autenticado = dao.login(usuario.getEmail(), usuario.getSenha());
            if (autenticado == null) {
                logger.log(Level.WARNING, "[AUTH] Login falhou - credenciais inválidas para email: {0}", usuario.getEmail());
                sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Credenciais inválidas");
                return;
            }

            logger.log(Level.INFO, "[AUTH] Login bem-sucedido para email: {0}", usuario.getEmail());
            
            // Criar ou obter sessão existente
            HttpSession session = req.getSession(true);
            if (session.isNew()) {
                System.err.println("[AUTH DEBUG] Nova sessão criada - ID: " + session.getId());
            } else {
                System.err.println("[AUTH DEBUG] Usando sessão existente - ID: " + session.getId());
            }
            
            // Configurar atributos da sessão
            session.setAttribute("userId", autenticado.getId());
            session.setAttribute("userTipo", autenticado.getTipo());
            session.setAttribute("userNome", autenticado.getNome());
            
            // Configurar tempo de expiração da sessão (30 minutos)
            session.setMaxInactiveInterval(30 * 60);
            
            System.err.println("[AUTH DEBUG] Sessão configurada - userId: " + session.getAttribute("userId") + 
                ", userTipo: " + session.getAttribute("userTipo") + 
                ", Session ID: " + session.getId());

            autenticado.setSenha(null);
            
            // Debug: verificar o que está sendo retornado
            System.err.println("[AUTH DEBUG] Usuário autenticado - ID: " + autenticado.getId() + 
                ", Nome: " + autenticado.getNome() + 
                ", Email: " + autenticado.getEmail() + 
                ", Tipo: " + autenticado.getTipo());
            
            String jsonResponse = gson.toJson(autenticado);
            System.err.println("[AUTH DEBUG] JSON sendo enviado: " + jsonResponse);
            
            // Adicionar header para garantir que o cookie de sessão seja enviado
            resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            resp.setHeader("Pragma", "no-cache");
            resp.setHeader("Expires", "0");
            
            sendJson(resp, HttpServletResponse.SC_OK, autenticado);
        } catch (Exception e) {
            // Se houver exceção, é erro de conexão com o banco
            logger.log(Level.SEVERE, "[AUTH] Erro ao processar login: {0}", e.getMessage());
            e.printStackTrace();
            String errorMessage = e.getMessage();
            if (errorMessage != null && errorMessage.contains("banco de dados")) {
                sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                    "Erro ao conectar com o banco de dados. Verifique se o PostgreSQL está rodando e as credenciais estão corretas.");
            } else {
                sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                    "Erro interno ao processar login. Verifique os logs do servidor.");
            }
        }
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