package com.devhub.repository;

import com.devhub.model.Servico;
import com.devhub.model.TipoServico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Integer> {
    List<Servico> findByAtivoTrue();
    List<Servico> findByUsuarioIdAndAtivoTrue(Integer usuarioId);
    List<Servico> findByCategoriaIdAndAtivoTrue(Integer categoriaId);
    List<Servico> findByTipoAndAtivoTrue(TipoServico tipo);
    List<Servico> findByDestaqueTrueAndAtivoTrue();
}

