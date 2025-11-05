package com.devhub.repository;

import com.devhub.model.Contrato;
import com.devhub.model.Servico;
import com.devhub.model.StatusContrato;
import com.devhub.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContratoRepository extends JpaRepository<Contrato, Integer> {
    
    List<Contrato> findByServico(Servico servico);
    
    List<Contrato> findByCliente(Usuario cliente);
    
    List<Contrato> findByPrestador(Usuario prestador);
    
    List<Contrato> findByStatus(StatusContrato status);
    
    @Query("SELECT c FROM Contrato c WHERE c.cliente.id = :usuarioId OR c.prestador.id = :usuarioId")
    List<Contrato> findByUsuarioId(@Param("usuarioId") Integer usuarioId);
    
    @Query("SELECT c FROM Contrato c WHERE c.prestador.id = :usuarioId AND c.status = :status")
    List<Contrato> findByPrestadorIdAndStatus(@Param("usuarioId") Integer usuarioId, @Param("status") StatusContrato status);
    
    @Query("SELECT c FROM Contrato c WHERE c.cliente.id = :usuarioId AND c.status = :status")
    List<Contrato> findByClienteIdAndStatus(@Param("usuarioId") Integer usuarioId, @Param("status") StatusContrato status);
    
    @Query("SELECT COUNT(c) FROM Contrato c WHERE c.prestador.id = :usuarioId AND c.status = 'concluido'")
    Long countContratosConcluidosByPrestadorId(@Param("usuarioId") Integer usuarioId);
    
    @Query("SELECT COUNT(c) FROM Contrato c WHERE c.prestador.id = :usuarioId")
    Long countTotalContratosByPrestadorId(@Param("usuarioId") Integer usuarioId);
}

