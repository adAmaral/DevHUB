package filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CORSFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) {
        System.err.println("[CORS FILTER INIT] CORSFilter inicializado!");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        String method = req.getMethod();
        String requestURI = req.getRequestURI();
        
        System.err.println("[CORS FILTER] Método: " + method);
        System.err.println("[CORS FILTER] Request URI: " + requestURI);
        System.err.println("[CORS FILTER] ServletPath: " + req.getServletPath());
        System.err.println("[CORS FILTER] PathInfo: " + req.getPathInfo());
        
        // Log específico para /auth/me
        if (requestURI != null && requestURI.contains("/auth/me")) {
            System.err.println("[CORS FILTER] *** REQUISIÇÃO /auth/me DETECTADA ***");
        }

        String origin = req.getHeader("Origin");
        if (origin == null || origin.isEmpty()) {
            origin = "*";
        }

        resp.setHeader("Access-Control-Allow-Origin", origin);
        resp.setHeader("Vary", "Origin");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Max-Age", "86400");

        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            System.err.println("[CORS FILTER] Requisição OPTIONS, retornando 204");
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
            return;
        }

        System.err.println("[CORS FILTER] Continuando chain doFilter para: " + requestURI);
        chain.doFilter(request, response);
        System.err.println("[CORS FILTER] Chain doFilter finalizado para: " + requestURI);
    }

    @Override
    public void destroy() {}
}


