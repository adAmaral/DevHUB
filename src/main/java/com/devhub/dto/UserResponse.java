package com.devhub.dto;

import com.devhub.model.Usuario;
import com.devhub.model.TipoUsuario;

public class UserResponse {
    private Integer id;
    private String nome;
    private String email;
    private TipoUsuario tipo;
    private String telefone;
    private String fotoPerfil;

    public UserResponse() {
    }

    public UserResponse(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.tipo = usuario.getTipo();
        this.telefone = usuario.getTelefone();
        this.fotoPerfil = usuario.getFotoPerfil();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public TipoUsuario getTipo() {
        return tipo;
    }
    
    public String getTipoString() {
        return tipo != null ? tipo.toString() : null;
    }

    public void setTipo(TipoUsuario tipo) {
        this.tipo = tipo;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }
}

