package com.universidade.unisinos.repository;

import com.universidade.unisinos.entity.UsuarioInstituicao;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioInstituicaoRepository extends JpaRepository<UsuarioInstituicao, Long> {

    Optional<UsuarioInstituicao> findByUsuario(String usuario);
}
