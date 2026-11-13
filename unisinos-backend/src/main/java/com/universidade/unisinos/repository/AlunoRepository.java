package com.universidade.unisinos.repository;

import com.universidade.unisinos.entity.Aluno;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    Optional<Aluno> findByMatricula(String matricula);
}
