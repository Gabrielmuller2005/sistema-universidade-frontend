package com.universidade.unisinos.service;

import com.universidade.unisinos.dto.AlunoResponse;
import com.universidade.unisinos.dto.TurmaResponse;
import com.universidade.unisinos.entity.Aluno;
import com.universidade.unisinos.entity.Matricula;
import com.universidade.unisinos.exception.RecursoNaoEncontradoException;
import com.universidade.unisinos.mapper.AlunoMapper;
import com.universidade.unisinos.mapper.TurmaMapper;
import com.universidade.unisinos.repository.AlunoRepository;
import com.universidade.unisinos.repository.MatriculaRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final MatriculaRepository matriculaRepository;

    @Transactional(readOnly = true)
    public Aluno buscarEntidade(Long id) {
        log.info("Buscando aluno: {}", id);
        return alunoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado."));
    }

    @Transactional(readOnly = true)
    public AlunoResponse buscar(Long id) {
        log.info("Buscando aluno: {}", id);
        return AlunoMapper.toResponse(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public List<TurmaResponse> turmasDoAluno(Long alunoId) {
        log.info("Buscando turmas do aluno: {}", alunoId);
        buscarEntidade(alunoId);
        return matriculaRepository.findByAlunoId(alunoId).stream()
                .map(Matricula::getTurma)
                .map(turma -> TurmaMapper.toResponse(turma, matriculaRepository.countByTurmaId(turma.getId())))
                .toList();
    }
}
