package com.devhub.repository;

import com.devhub.model.Mensagem;
import com.devhub.model.Servico;
import com.devhub.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Integer> {
    
    List<Mensagem> findByRemetente(Usuario remetente);
    
    List<Mensagem> findByDestinatario(Usuario destinatario);
    
    List<Mensagem> findByServico(Servico servico);
    
    @Query("SELECT m FROM Mensagem m WHERE (m.remetente.id = :usuarioId OR m.destinatario.id = :usuarioId) ORDER BY m.dataEnvio DESC")
    List<Mensagem> findByUsuarioId(@Param("usuarioId") Integer usuarioId);
    
    @Query("SELECT m FROM Mensagem m WHERE m.destinatario.id = :usuarioId AND m.lida = false")
    List<Mensagem> findMensagensNaoLidasByDestinatarioId(@Param("usuarioId") Integer usuarioId);
    
    @Query("SELECT COUNT(m) FROM Mensagem m WHERE m.destinatario.id = :usuarioId AND m.lida = false")
    Long countMensagensNaoLidasByDestinatarioId(@Param("usuarioId") Integer usuarioId);
    
    @Query("SELECT m FROM Mensagem m WHERE (m.remetente.id = :usuario1Id AND m.destinatario.id = :usuario2Id) OR (m.remetente.id = :usuario2Id AND m.destinatario.id = :usuario1Id) ORDER BY m.dataEnvio ASC")
    List<Mensagem> findConversaEntreUsuarios(@Param("usuario1Id") Integer usuario1Id, @Param("usuario2Id") Integer usuario2Id);
}

