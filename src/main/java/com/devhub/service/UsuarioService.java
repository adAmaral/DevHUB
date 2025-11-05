package com.devhub.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.QueryTimeoutException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devhub.dto.LoginRequest;
import com.devhub.dto.RegisterRequest;
import com.devhub.dto.UserResponse;
import com.devhub.model.TipoUsuario;
import com.devhub.model.Usuario;
import com.devhub.repository.UsuarioRepository;
import com.devhub.util.PasswordUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Transactional
public class UsuarioService {
    
    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public UserResponse login(LoginRequest request) {
        String emailNormalized = request.getEmail() != null 
            ? request.getEmail().toLowerCase().trim() 
            : null;
        
        if (emailNormalized == null || emailNormalized.isEmpty()) {
            throw new RuntimeException("Email é obrigatório");
        }
        
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(emailNormalized);
        
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Credenciais inválidas");
        }
        
        Usuario usuario = usuarioOpt.get();
        
        if (!usuario.getAtivo()) {
            throw new RuntimeException("Usuário inativo");
        }
        
        if (!PasswordUtil.verifyPassword(request.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Credenciais inválidas");
        }
        
        return new UserResponse(usuario);
    }
    
    public UserResponse register(RegisterRequest request) {
        logger.debug("Iniciando registro: email={}, tipo={}", request.getEmail(), request.getAccountType());
        
        if (request.getSenha() == null || request.getSenha().isEmpty()) {
            throw new RuntimeException("Senha é obrigatória");
        }
        
        if (request.getConfirmarSenha() == null || request.getConfirmarSenha().isEmpty()) {
            throw new RuntimeException("Confirmação de senha é obrigatória");
        }
        
        if (!request.getSenha().equals(request.getConfirmarSenha())) {
            throw new RuntimeException("As senhas não coincidem");
        }
        
        if (request.getSenha().length() < 6) {
            throw new RuntimeException("A senha deve ter pelo menos 6 caracteres");
        }
        
        String emailNormalized = request.getEmail() != null 
            ? request.getEmail().toLowerCase().trim() 
            : null;
        
        if (emailNormalized == null || emailNormalized.isEmpty()) {
            throw new RuntimeException("Email é obrigatório");
        }
        
        try {
            if (usuarioRepository.existsByEmail(emailNormalized)) {
                throw new RuntimeException("Este email já está cadastrado");
            }
        } catch (QueryTimeoutException e) {
            logger.error("Timeout ao verificar email duplicado: {}", e.getMessage(), e);
            throw new RuntimeException("Tempo limite excedido ao verificar email. Tente novamente.");
        }
        
        if ("empresa".equals(request.getAccountType())) {
            if (request.getNomeEmpresa() == null || request.getNomeEmpresa().trim().isEmpty()) {
                throw new RuntimeException("Nome da empresa é obrigatório");
            }
            if (request.getCnpj() == null || request.getCnpj().trim().isEmpty()) {
                throw new RuntimeException("CNPJ é obrigatório");
            }
        }
        
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(emailNormalized);
        usuario.setSenha(PasswordUtil.hashPassword(request.getSenha()));
        String accountTypeNormalized = request.getAccountType() != null 
            ? request.getAccountType().toLowerCase().trim() 
            : null;
        if (accountTypeNormalized == null) {
            throw new RuntimeException("Tipo de conta é obrigatório");
        }
        try {
            usuario.setTipo(TipoUsuario.valueOf(accountTypeNormalized));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Tipo de conta inválido: " + request.getAccountType());
        }
        usuario.setTelefone(request.getTelefone());
        usuario.setAtivo(true);
        
        if ("empresa".equals(request.getAccountType())) {
            usuario.setNomeFantasia(request.getNomeEmpresa());
            usuario.setCpfCnpj(request.getCnpj());
            usuario.setEndereco(request.getEndereco());
        }
        
        usuario.setEspecialidades(null);
        
        try {
            logger.debug("Tentando salvar usuário com email: {}", emailNormalized);
            usuario = usuarioRepository.save(usuario);
            logger.debug("Usuário salvo com sucesso! ID: {}", usuario.getId());
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            logger.error("Erro de integridade ao salvar: {}", e.getMessage(), e);
            String errorMsg = e.getMessage();
            if (errorMsg != null && (errorMsg.contains("email") || errorMsg.contains("unique"))) {
                throw new RuntimeException("Este email já está cadastrado");
            }
            throw new RuntimeException("Erro ao criar conta. Verifique os dados e tente novamente.");
        } catch (org.springframework.dao.QueryTimeoutException e) {
            logger.error("Timeout ao salvar usuário: {}", e.getMessage(), e);
            throw new RuntimeException("Tempo limite excedido. Tente novamente.");
        } catch (org.springframework.dao.DataAccessException e) {
            logger.error("Erro ao salvar usuário: {} - {}", e.getClass().getName(), e.getMessage(), e);
            String errorMsg = e.getMessage();
            if (errorMsg != null && (errorMsg.contains("email") || errorMsg.contains("unique"))) {
                throw new RuntimeException("Este email já está cadastrado");
            }
            throw new RuntimeException("Erro ao criar conta: " + (errorMsg != null ? errorMsg : "Erro desconhecido"));
        }
        
        return new UserResponse(usuario);
    }
    
    public UserResponse getUsuarioById(Integer id) {
        if (id == null) {
            throw new RuntimeException("ID do usuário é obrigatório");
        }
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }
        return new UserResponse(usuarioOpt.get());
    }
    
    public UserResponse getUsuarioByEmail(String email) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }
        return new UserResponse(usuarioOpt.get());
    }
    
    public void salvarPreferencias(Integer userId, java.util.Map<String, Object> preferencias) {
        if (userId == null) {
            throw new RuntimeException("ID do usuário é obrigatório");
        }
        
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(userId);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }
        
        Usuario usuario = usuarioOpt.get();
        
        try {
            ObjectMapper mapper = new ObjectMapper();
            String preferenciasJson = mapper.writeValueAsString(preferencias);
            usuario.setPreferencias(preferenciasJson);
            usuarioRepository.save(usuario);
            logger.info("Preferências salvas para usuário ID: {}", userId);
        } catch (Exception e) {
            logger.error("Erro ao salvar preferências: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao salvar preferências: " + e.getMessage());
        }
    }
    
    public void alterarSenha(Integer userId, String senhaAtual, String novaSenha) {
        if (userId == null) {
            throw new RuntimeException("ID do usuário é obrigatório");
        }
        
        if (senhaAtual == null || senhaAtual.isEmpty()) {
            throw new RuntimeException("Senha atual é obrigatória");
        }
        
        if (novaSenha == null || novaSenha.isEmpty()) {
            throw new RuntimeException("Nova senha é obrigatória");
        }
        
        if (novaSenha.length() < 6) {
            throw new RuntimeException("A nova senha deve ter pelo menos 6 caracteres");
        }
        
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(userId);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }
        
        Usuario usuario = usuarioOpt.get();
        
        if (!PasswordUtil.verifyPassword(senhaAtual, usuario.getSenha())) {
            throw new RuntimeException("Senha atual incorreta");
        }
        
        String novaSenhaHash = PasswordUtil.hashPassword(novaSenha);
        usuario.setSenha(novaSenhaHash);
        usuarioRepository.save(usuario);
        
        logger.info("Senha alterada para usuário ID: {}", userId);
    }
}

