package com.devhub.repository;

import com.devhub.model.Avaliacao;
import com.devhub.model.Servico;
import com.devhub.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Integer> {
    
    List<Avaliacao> findByServico(Servico servico);
    
    List<Avaliacao> findByUsuarioAvaliado(Usuario usuario);
    
    List<Avaliacao> findByUsuarioAvaliador(Usuario usuario);
    
    Optional<Avaliacao> findByServicoAndUsuarioAvaliador(Servico servico, Usuario usuarioAvaliador);
    
    @Query("SELECT AVG(a.nota) FROM Avaliacao a WHERE a.servico.id = :servicoId")
    Double findMediaNotaByServicoId(@Param("servicoId") Integer servicoId);
    
    @Query("SELECT AVG(a.nota) FROM Avaliacao a WHERE a.usuarioAvaliado.id = :usuarioId")
    Double findMediaNotaByUsuarioId(@Param("usuarioId") Integer usuarioId);
    
    @Query("SELECT COUNT(a) FROM Avaliacao a WHERE a.servico.id = :servicoId")
    Long countByServicoId(@Param("servicoId") Integer servicoId);
    
    @Query("SELECT COUNT(a) FROM Avaliacao a WHERE a.usuarioAvaliado.id = :usuarioId")
    Long countByUsuarioId(@Param("usuarioId") Integer usuarioId);
}

