package com.devhub.model;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import org.hibernate.annotations.Type;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_tipo", columnList = "tipo"),
    @Index(name = "idx_ativo", columnList = "ativo")
})
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer id;
    
    @Column(nullable = false, length = 255)
    private String nome;
    
    @Column(nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(nullable = false, length = 255)
    private String senha;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 20)
    private TipoUsuario tipo;
    
    @Column(length = 20)
    private String telefone;
    
    @Column(columnDefinition = "TEXT")
    private String endereco;
    
    @Column(length = 100)
    private String cidade;
    
    @Column(length = 50)
    private String estado;
    
    @Column(length = 10)
    private String cep;
    
    @Column(name = "data_nascimento")
    private java.time.LocalDate dataNascimento;
    
    @Column(name = "cpf_cnpj", length = 20)
    private String cpfCnpj;
    
    @Column(columnDefinition = "TEXT")
    private String descricao;
    
    @Column(name = "foto_perfil", length = 500)
    private String fotoPerfil;
    
    @Column(nullable = false)
    private Boolean ativo = true;
    
    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;
    
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;
    
    @Column(name = "nome_fantasia", length = 255)
    private String nomeFantasia;
    
    @Column(name = "razao_social", length = 255)
    private String razaoSocial;
    
    @Column(name = "area_atuacao", length = 255)
    private String areaAtuacao;
    
    @Type(JsonBinaryType.class)
    @Column(name = "especialidades", columnDefinition = "jsonb", nullable = true)
    private String especialidades;
    
    @Column(name = "portfolio_url", length = 500)
    private String portfolioUrl;
    
    @Column(name = "site_url", length = 500)
    private String siteUrl;
    
    @PrePersist
    protected void onCreate() {
        dataCadastro = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
    
    // Getters and Setters
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
        this.email = email != null ? email.toLowerCase() : null;
    }
    
    public String getSenha() {
        return senha;
    }
    
    public void setSenha(String senha) {
        this.senha = senha;
    }
    
    public TipoUsuario getTipo() {
        return tipo;
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
    
    public String getEndereco() {
        return endereco;
    }
    
    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }
    
    public String getCidade() {
        return cidade;
    }
    
    public void setCidade(String cidade) {
        this.cidade = cidade;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
    
    public String getCep() {
        return cep;
    }
    
    public void setCep(String cep) {
        this.cep = cep;
    }
    
    public java.time.LocalDate getDataNascimento() {
        return dataNascimento;
    }
    
    public void setDataNascimento(java.time.LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }
    
    public String getCpfCnpj() {
        return cpfCnpj;
    }
    
    public void setCpfCnpj(String cpfCnpj) {
        this.cpfCnpj = cpfCnpj;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    
    public String getFotoPerfil() {
        return fotoPerfil;
    }
    
    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }
    
    public Boolean getAtivo() {
        return ativo;
    }
    
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
    
    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }
    
    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }
    
    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }
    
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }
    
    public String getNomeFantasia() {
        return nomeFantasia;
    }
    
    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }
    
    public String getRazaoSocial() {
        return razaoSocial;
    }
    
    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }
    
    public String getAreaAtuacao() {
        return areaAtuacao;
    }
    
    public void setAreaAtuacao(String areaAtuacao) {
        this.areaAtuacao = areaAtuacao;
    }
    
    public String getEspecialidades() {
        return especialidades;
    }
    
    public void setEspecialidades(String especialidades) {
        this.especialidades = especialidades;
    }
    
    public String getPortfolioUrl() {
        return portfolioUrl;
    }
    
    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }
    
    public String getSiteUrl() {
        return siteUrl;
    }
    
    public void setSiteUrl(String siteUrl) {
        this.siteUrl = siteUrl;
    }
}

