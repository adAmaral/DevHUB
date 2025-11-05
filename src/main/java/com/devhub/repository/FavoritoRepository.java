package com.devhub.repository;

import com.devhub.model.Favorito;
import com.devhub.model.Servico;
import com.devhub.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Integer> {
    
    List<Favorito> findByUsuario(Usuario usuario);
    
    List<Favorito> findByServico(Servico servico);
    
    Optional<Favorito> findByUsuarioAndServico(Usuario usuario, Servico servico);
    
    @Query("SELECT f FROM Favorito f WHERE f.usuario.id = :usuarioId ORDER BY f.dataFavoritado DESC")
    List<Favorito> findByUsuarioId(@Param("usuarioId") Integer usuarioId);
    
    @Query("SELECT COUNT(f) FROM Favorito f WHERE f.servico.id = :servicoId")
    Long countByServicoId(@Param("servicoId") Integer servicoId);
    
    @Query("SELECT COUNT(f) FROM Favorito f WHERE f.usuario.id = :usuarioId")
    Long countByUsuarioId(@Param("usuarioId") Integer usuarioId);
    
    boolean existsByUsuarioAndServico(Usuario usuario, Servico servico);
}

