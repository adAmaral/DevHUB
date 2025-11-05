package com.devhub.controller;

import com.devhub.dto.LoginRequest;
import com.devhub.dto.RegisterRequest;
import com.devhub.dto.UserResponse;
import com.devhub.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private UsuarioService usuarioService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
        try {
            // Validações básicas
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("erro", "Email é obrigatório");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            if (request.getSenha() == null || request.getSenha().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("erro", "Senha é obrigatória");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            UserResponse user = usuarioService.login(request);
            
            // Configurar sessão
            session.setAttribute("userId", user.getId());
            session.setAttribute("userTipo", user.getTipoString());
            session.setAttribute("userNome", user.getNome());
            session.setMaxInactiveInterval(3600); // 1 hora
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            
            // Criar objeto user com tipo como string
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("nome", user.getNome());
            userMap.put("email", user.getEmail());
            userMap.put("tipo", user.getTipoString()); // Garantir que tipo seja string
            userMap.put("telefone", user.getTelefone());
            userMap.put("foto_perfil", user.getFotoPerfil());
            
            response.put("user", userMap);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            String errorMessage = e.getMessage();
            if (errorMessage == null || errorMessage.trim().isEmpty()) {
                errorMessage = "Erro ao fazer login. Verifique suas credenciais e tente novamente.";
            }
            error.put("erro", errorMessage);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("erro", "Erro interno ao fazer login. Tente novamente mais tarde.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpSession session) {
        try {
            logger.info("Recebendo requisição de registro: nome={}, email={}, accountType={}, senha={}, confirmarSenha={}", 
                request.getNome(), request.getEmail(), request.getAccountType(), 
                request.getSenha() != null ? "***" : null, 
                request.getConfirmarSenha() != null ? "***" : null);
            
            // Validações básicas
            if (request.getNome() == null || request.getNome().trim().isEmpty()) {
                logger.warn("Registro falhou: Nome é obrigatório");
                Map<String, String> error = new HashMap<>();
                error.put("erro", "Nome é obrigatório");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                logger.warn("Registro falhou: Email é obrigatório");
                Map<String, String> error = new HashMap<>();
                error.put("erro", "Email é obrigatório");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            if (request.getSenha() == null || request.getSenha().isEmpty()) {
                logger.warn("Registro falhou: Senha é obrigatória");
                Map<String, String> error = new HashMap<>();
                error.put("erro", "Senha é obrigatória");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            if (request.getAccountType() == null || request.getAccountType().trim().isEmpty()) {
                logger.warn("Registro falhou: Tipo de conta é obrigatório");
                Map<String, String> error = new HashMap<>();
                error.put("erro", "Tipo de conta é obrigatório");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            logger.debug("Chamando service.register()");
            UserResponse user = usuarioService.register(request);
            logger.info("Usuário registrado com sucesso: ID={}, email={}", user.getId(), user.getEmail());
            
            // Configurar sessão após registro
            session.setAttribute("userId", user.getId());
            session.setAttribute("userTipo", user.getTipoString());
            session.setAttribute("userNome", user.getNome());
            session.setMaxInactiveInterval(3600); // 1 hora
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Conta criada com sucesso!");
            
            // Criar objeto user com tipo como string
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("nome", user.getNome());
            userMap.put("email", user.getEmail());
            userMap.put("tipo", user.getTipoString()); // Garantir que tipo seja string
            userMap.put("telefone", user.getTelefone());
            userMap.put("foto_perfil", user.getFotoPerfil());
            
            response.put("user", userMap);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Erro ao registrar usuário (RuntimeException): {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            String errorMessage = e.getMessage();
            if (errorMessage == null || errorMessage.trim().isEmpty()) {
                errorMessage = "Erro ao criar conta. Verifique os dados e tente novamente.";
            }
            error.put("erro", errorMessage);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            logger.error("Erro ao registrar usuário (Exception): {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            String errorMessage = e.getMessage();
            if (errorMessage != null && errorMessage.contains("JSONB")) {
                error.put("erro", "Erro ao salvar dados. Tente novamente.");
            } else {
                error.put("erro", "Erro interno ao criar conta. Tente novamente mais tarde.");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        
        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("erro", "Não autenticado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        
        try {
            UserResponse user = usuarioService.getUsuarioById(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("id_usuario", user.getId()); // Compatibilidade com frontend antigo
            response.put("nome", user.getNome());
            response.put("email", user.getEmail());
            response.put("tipo", user.getTipoString());
            response.put("telefone", user.getTelefone());
            response.put("foto_perfil", user.getFotoPerfil());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("erro", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        Map<String, String> response = new HashMap<>();
        response.put("success", "true");
        response.put("message", "Logout realizado com sucesso");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/preferencias")
    public ResponseEntity<?> getPreferencias(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        
        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("erro", "Não autenticado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        
        try {
            UserResponse user = usuarioService.getUsuarioById(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("preferencias", user.getPreferencias());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("erro", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    @PostMapping("/preferencias")
    public ResponseEntity<?> salvarPreferencias(@RequestBody Map<String, Object> preferencias, HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        
        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("erro", "Não autenticado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        
        try {
            usuarioService.salvarPreferencias(userId, preferencias);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Preferências salvas com sucesso");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("erro", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PostMapping("/alterar-senha")
    public ResponseEntity<?> alterarSenha(@RequestBody Map<String, String> request, HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        
        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("erro", "Não autenticado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        
        try {
            String senhaAtual = request.get("senhaAtual");
            String novaSenha = request.get("novaSenha");
            String confirmarSenha = request.get("confirmarSenha");
            
            if (senhaAtual == null || novaSenha == null || confirmarSenha == null) {
                Map<String, String> error = new HashMap<>();
                error.put("erro", "Todos os campos são obrigatórios");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            if (!novaSenha.equals(confirmarSenha)) {
                Map<String, String> error = new HashMap<>();
                error.put("erro", "As senhas não coincidem");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            usuarioService.alterarSenha(userId, senhaAtual, novaSenha);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Senha alterada com sucesso");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("erro", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}

