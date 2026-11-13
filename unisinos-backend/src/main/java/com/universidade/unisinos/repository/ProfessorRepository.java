package com.universidade.unisinos.repository;

import com.universidade.unisinos.entity.Professor;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {

    Optional<Professor> findByNome(String nome);
}
