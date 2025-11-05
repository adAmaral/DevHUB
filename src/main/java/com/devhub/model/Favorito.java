package com.devhub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favoritos", indexes = {
    @Index(name = "idx_usuario_id_fav", columnList = "usuario_id"),
    @Index(name = "idx_servico_id_fav", columnList = "servico_id"),
    @Index(name = "idx_data_favoritado", columnList = "data_favoritado")
},
uniqueConstraints = {
    @UniqueConstraint(name = "uk_usuario_servico_favorito", columnNames = {"usuario_id", "servico_id"})
})
public class Favorito {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_favorito")
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;
    
    @Column(name = "data_favoritado", nullable = false, updatable = false)
    private LocalDateTime dataFavoritado;
    
    @PrePersist
    protected void onCreate() {
        if (dataFavoritado == null) {
            dataFavoritado = LocalDateTime.now();
        }
    }
    
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public Servico getServico() {
        return servico;
    }
    
    public void setServico(Servico servico) {
        this.servico = servico;
    }
    
    public LocalDateTime getDataFavoritado() {
        return dataFavoritado;
    }
    
    public void setDataFavoritado(LocalDateTime dataFavoritado) {
        this.dataFavoritado = dataFavoritado;
    }
}

