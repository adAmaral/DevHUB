package com.devhub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensagens", indexes = {
    @Index(name = "idx_remetente", columnList = "remetente_id"),
    @Index(name = "idx_destinatario", columnList = "destinatario_id"),
    @Index(name = "idx_servico_msg", columnList = "servico_id"),
    @Index(name = "idx_lida", columnList = "lida"),
    @Index(name = "idx_data_envio", columnList = "data_envio")
})
public class Mensagem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mensagem")
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "remetente_id", nullable = false)
    private Usuario remetente;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destinatario_id", nullable = false)
    private Usuario destinatario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servico_id")
    private Servico servico;
    
    @Column(length = 255)
    private String assunto;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensagem;
    
    @Column(nullable = false)
    private Boolean lida = false;
    
    @Column(name = "data_envio", nullable = false, updatable = false)
    private LocalDateTime dataEnvio;
    
    @PrePersist
    protected void onCreate() {
        if (dataEnvio == null) {
            dataEnvio = LocalDateTime.now();
        }
        if (lida == null) {
            lida = false;
        }
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public Usuario getRemetente() {
        return remetente;
    }
    
    public void setRemetente(Usuario remetente) {
        this.remetente = remetente;
    }
    
    public Usuario getDestinatario() {
        return destinatario;
    }
    
    public void setDestinatario(Usuario destinatario) {
        this.destinatario = destinatario;
    }
    
    public Servico getServico() {
        return servico;
    }
    
    public void setServico(Servico servico) {
        this.servico = servico;
    }
    
    public String getAssunto() {
        return assunto;
    }
    
    public void setAssunto(String assunto) {
        this.assunto = assunto;
    }
    
    public String getMensagem() {
        return mensagem;
    }
    
    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }
    
    public Boolean getLida() {
        return lida;
    }
    
    public void setLida(Boolean lida) {
        this.lida = lida != null ? lida : false;
    }
    
    public LocalDateTime getDataEnvio() {
        return dataEnvio;
    }
    
    public void setDataEnvio(LocalDateTime dataEnvio) {
        this.dataEnvio = dataEnvio;
    }
}

