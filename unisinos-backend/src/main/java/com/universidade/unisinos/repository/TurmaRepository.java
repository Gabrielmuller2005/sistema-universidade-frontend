package com.universidade.unisinos.repository;

import com.universidade.unisinos.entity.Turma;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TurmaRepository extends JpaRepository<Turma, Long> {

    long countByProfessorId(Long professorId);

    long countByProfessorIdAndIdNot(Long professorId, Long id);

    boolean existsByProfessorIdAndHorario(Long professorId, String horario);

    boolean existsByProfessorIdAndHorarioAndIdNot(Long professorId, String horario, Long id);
}
