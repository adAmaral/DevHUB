package com.devhub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "categorias")
@org.hibernate.annotations.SQLInsert(
    sql = "INSERT INTO categorias (nome, descricao, icone, ativo, data_cadastro) VALUES (?, ?, ?, ?::boolean, ?::TIMESTAMP)",
    check = org.hibernate.annotations.ResultCheckStyle.NONE
)
@org.hibernate.annotations.SQLUpdate(
    sql = "UPDATE categorias SET nome = ?, descricao = ?, icone = ?, ativo = ?::boolean WHERE id_categoria = ?",
    check = org.hibernate.annotations.ResultCheckStyle.NONE
)
public class Categoria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Integer id;
    
    @Column(nullable = false, unique = true, length = 100)
    private String nome;
    
    @Column(columnDefinition = "TEXT")
    private String descricao;
    
    @Column(length = 100)
    private String icone;
    
    @Column(nullable = false)
    private Boolean ativo = true;
    
    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;
    
    @PrePersist
    protected void onCreate() {
        if (dataCadastro == null) {
            dataCadastro = LocalDateTime.now();
        }
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
    
    public String getDescricao() {
        return descricao;
    }
    
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    
    public String getIcone() {
        return icone;
    }
    
    public void setIcone(String icone) {
        this.icone = icone;
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
}

