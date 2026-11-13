package com.universidade.unisinos.service;

import com.universidade.unisinos.dto.MatriculaRequest;
import com.universidade.unisinos.dto.TurmaResponse;
import com.universidade.unisinos.dto.VerificacaoMatriculaResponse;
import com.universidade.unisinos.entity.Aluno;
import com.universidade.unisinos.entity.Disciplina;
import com.universidade.unisinos.entity.Matricula;
import com.universidade.unisinos.entity.Turma;
import com.universidade.unisinos.exception.RecursoNaoEncontradoException;
import com.universidade.unisinos.exception.RegraDeNegocioException;
import com.universidade.unisinos.repository.MatriculaRepository;
import com.universidade.unisinos.util.Horarios;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;
    private final AlunoService alunoService;
    private final TurmaService turmaService;

    @Transactional
    public TurmaResponse matricular(MatriculaRequest request) {
        log.info("Matricula iniciada com sucesso");
        Aluno aluno = alunoService.buscarEntidade(request.alunoId());
        Turma turma = turmaService.buscarEntidade(request.turmaId());

        validarMatricula(aluno, turma);

        matriculaRepository.save(new Matricula(aluno, turma));
        return turmaService.paraResponse(turma);
    }

    @Transactional
    public void cancelar(Long alunoId, Long turmaId) {
        log.info("Cancelando Matricula");
        Matricula matricula = matriculaRepository.findByAlunoIdAndTurmaId(alunoId, turmaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Matrícula não encontrada."));
        matriculaRepository.delete(matricula);
    }

    @Transactional(readOnly = true)
    public VerificacaoMatriculaResponse verificar(Long alunoId, Long turmaId) {
        log.info("Verificando Matricula");
        Aluno aluno = alunoService.buscarEntidade(alunoId);
        Turma turma = turmaService.buscarEntidade(turmaId);

        try {
            validarMatricula(aluno, turma);
            return new VerificacaoMatriculaResponse(true, null);
        } catch (RegraDeNegocioException ex) {
            return new VerificacaoMatriculaResponse(false, ex.getMessage());
        }
    }

    private void validarMatricula(Aluno aluno, Turma turma) {
        if (matriculaRepository.existsByAlunoIdAndTurmaId(aluno.getId(), turma.getId())) {
            throw new RegraDeNegocioException("Você já está matriculado nesta turma.");
        }

        long vagasOcupadas = matriculaRepository.countByTurmaId(turma.getId());
        if (turma.getVagas() - vagasOcupadas <= 0) {
            throw new RegraDeNegocioException("Não há vagas disponíveis nesta turma.");
        }

        List<Turma> turmasDoAluno = matriculaRepository.findByAlunoId(aluno.getId()).stream()
                .map(Matricula::getTurma)
                .toList();

        turmasDoAluno.stream()
                .filter(outra -> outra.getHorario().equals(turma.getHorario()))
                .findFirst()
                .ifPresent(conflito -> {
                    throw new RegraDeNegocioException(
                            "Conflito de horário com " + conflito.getDisciplina().getNome()
                                    + " (" + Horarios.descricao(turma.getHorario()) + ").");
                });

        Disciplina disciplina = turma.getDisciplina();
        if (disciplina.getPreRequisito() != null && !alunoPossuiAprovacao(aluno, disciplina.getPreRequisito())) {
            throw new RegraDeNegocioException(
                    "Pré-requisito não cumprido: é preciso ter aprovação em "
                            + disciplina.getPreRequisito().getNome() + ".");
        }
    }

    private boolean alunoPossuiAprovacao(Aluno aluno, Disciplina disciplina) {
        return aluno.getDisciplinasAprovadas().stream()
                .anyMatch(aprovada -> aprovada.getId().equals(disciplina.getId()));
    }
}
