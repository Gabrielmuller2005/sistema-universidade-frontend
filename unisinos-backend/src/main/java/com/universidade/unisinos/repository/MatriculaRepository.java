package com.universidade.unisinos.repository;

import com.universidade.unisinos.entity.Matricula;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatriculaRepository extends JpaRepository<Matricula, Long> {

    List<Matricula> findByAlunoId(Long alunoId);

    List<Matricula> findByTurmaId(Long turmaId);

    long countByTurmaId(Long turmaId);

    boolean existsByAlunoIdAndTurmaId(Long alunoId, Long turmaId);

    Optional<Matricula> findByAlunoIdAndTurmaId(Long alunoId, Long turmaId);

    void deleteByAlunoIdAndTurmaId(Long alunoId, Long turmaId);

    void deleteByTurmaId(Long turmaId);
}
