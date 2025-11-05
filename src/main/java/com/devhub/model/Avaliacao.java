package com.devhub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "avaliacoes", indexes = {
    @Index(name = "idx_servico_id_aval", columnList = "servico_id"),
    @Index(name = "idx_usuario_avaliador", columnList = "usuario_avaliador_id"),
    @Index(name = "idx_usuario_avaliado", columnList = "usuario_avaliado_id"),
    @Index(name = "idx_nota", columnList = "nota"),
    @Index(name = "idx_data_avaliacao", columnList = "data_avaliacao")
},
uniqueConstraints = {
    @UniqueConstraint(name = "uk_servico_usuario_avaliador", columnNames = {"servico_id", "usuario_avaliador_id"})
})
public class Avaliacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_avaliacao")
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_avaliador_id", nullable = false)
    private Usuario usuarioAvaliador;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_avaliado_id", nullable = false)
    private Usuario usuarioAvaliado;
    
    @Column(nullable = false)
    private Integer nota;
    
    @Column(columnDefinition = "TEXT")
    private String comentario;
    
    @Column(name = "data_avaliacao", nullable = false, updatable = false)
    private LocalDateTime dataAvaliacao;
    
    @PrePersist
    protected void onCreate() {
        if (dataAvaliacao == null) {
            dataAvaliacao = LocalDateTime.now();
        }
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public Servico getServico() {
        return servico;
    }
    
    public void setServico(Servico servico) {
        this.servico = servico;
    }
    
    public Usuario getUsuarioAvaliador() {
        return usuarioAvaliador;
    }
    
    public void setUsuarioAvaliador(Usuario usuarioAvaliador) {
        this.usuarioAvaliador = usuarioAvaliador;
    }
    
    public Usuario getUsuarioAvaliado() {
        return usuarioAvaliado;
    }
    
    public void setUsuarioAvaliado(Usuario usuarioAvaliado) {
        this.usuarioAvaliado = usuarioAvaliado;
    }
    
    public Integer getNota() {
        return nota;
    }
    
    public void setNota(Integer nota) {
        if (nota != null && (nota < 1 || nota > 5)) {
            throw new IllegalArgumentException("Nota deve estar entre 1 e 5");
        }
        this.nota = nota;
    }
    
    public String getComentario() {
        return comentario;
    }
    
    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
    
    public LocalDateTime getDataAvaliacao() {
        return dataAvaliacao;
    }
    
    public void setDataAvaliacao(LocalDateTime dataAvaliacao) {
        this.dataAvaliacao = dataAvaliacao;
    }
}

