package com.universidade.unisinos.repository;

import com.universidade.unisinos.entity.Disciplina;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {

    Optional<Disciplina> findByNome(String nome);
}
