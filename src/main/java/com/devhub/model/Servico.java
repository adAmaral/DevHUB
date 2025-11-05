package com.devhub.model;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import org.hibernate.annotations.Type;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "servicos", indexes = {
    @Index(name = "idx_usuario_id", columnList = "usuario_id"),
    @Index(name = "idx_categoria_id", columnList = "categoria_id"),
    @Index(name = "idx_tipo_serv", columnList = "tipo"),
    @Index(name = "idx_ativo_serv", columnList = "ativo")
})
@org.hibernate.annotations.SQLInsert(
    sql = "INSERT INTO servicos (usuario_id, categoria_id, titulo, descricao, tipo, preco, prazo_entrega, imagens, tags, ativo, destaque, visualizacoes, data_cadastro, data_atualizacao) VALUES (?, ?, ?, ?, ?::tipo_servico, ?, ?, ?::JSONB, ?::JSONB, ?::boolean, ?::boolean, ?, ?::TIMESTAMP, ?::TIMESTAMP)",
    check = org.hibernate.annotations.ResultCheckStyle.NONE
)
@org.hibernate.annotations.SQLUpdate(
    sql = "UPDATE servicos SET usuario_id = ?, categoria_id = ?, titulo = ?, descricao = ?, tipo = ?::tipo_servico, preco = ?, prazo_entrega = ?, imagens = ?::JSONB, tags = ?::JSONB, ativo = ?::boolean, destaque = ?::boolean, visualizacoes = ?, data_atualizacao = ?::TIMESTAMP WHERE id_servico = ?",
    check = org.hibernate.annotations.ResultCheckStyle.NONE
)
public class Servico {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servico")
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;
    
    @Column(nullable = false, length = 255)
    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String descricao;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, columnDefinition = "tipo_servico")
    private TipoServico tipo;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;
    
    @Column(name = "prazo_entrega")
    private Integer prazoEntrega;
    
    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private List<String> imagens = new ArrayList<>();
    
    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private List<String> tags = new ArrayList<>();
    
    @Column(nullable = false)
    private Boolean ativo = true;
    
    @Column(nullable = false)
    private Boolean destaque = false;
    
    @Column(nullable = false)
    private Integer visualizacoes = 0;
    
    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;
    
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;
    
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
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public Categoria getCategoria() {
        return categoria;
    }
    
    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
    
    public String getTitulo() {
        return titulo;
    }
    
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    
    public TipoServico getTipo() {
        return tipo;
    }
    
    public void setTipo(TipoServico tipo) {
        this.tipo = tipo;
    }
    
    public BigDecimal getPreco() {
        return preco;
    }
    
    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }
    
    public Integer getPrazoEntrega() {
        return prazoEntrega;
    }
    
    public void setPrazoEntrega(Integer prazoEntrega) {
        this.prazoEntrega = prazoEntrega;
    }
    
    public List<String> getImagens() {
        return imagens != null ? imagens : new ArrayList<>();
    }
    
    public void setImagens(List<String> imagens) {
        this.imagens = imagens != null ? imagens : new ArrayList<>();
    }
    
    public List<String> getTags() {
        return tags != null ? tags : new ArrayList<>();
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags != null ? tags : new ArrayList<>();
    }
    
    public Boolean getAtivo() {
        return ativo;
    }
    
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
    
    public Boolean getDestaque() {
        return destaque;
    }
    
    public void setDestaque(Boolean destaque) {
        this.destaque = destaque;
    }
    
    public Integer getVisualizacoes() {
        return visualizacoes;
    }
    
    public void setVisualizacoes(Integer visualizacoes) {
        this.visualizacoes = visualizacoes;
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
}

