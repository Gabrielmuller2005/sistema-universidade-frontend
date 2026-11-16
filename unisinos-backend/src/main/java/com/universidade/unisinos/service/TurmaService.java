package com.universidade.unisinos.service;

import com.universidade.unisinos.dto.TurmaRequest;
import com.universidade.unisinos.dto.TurmaResponse;
import com.universidade.unisinos.entity.Disciplina;
import com.universidade.unisinos.entity.Matricula;
import com.universidade.unisinos.entity.Professor;
import com.universidade.unisinos.entity.Turma;
import com.universidade.unisinos.exception.RecursoNaoEncontradoException;
import com.universidade.unisinos.exception.RegraDeNegocioException;
import com.universidade.unisinos.mapper.TurmaMapper;
import com.universidade.unisinos.repository.DisciplinaRepository;
import com.universidade.unisinos.repository.MatriculaRepository;
import com.universidade.unisinos.repository.ProfessorRepository;
import com.universidade.unisinos.repository.TurmaRepository;
import com.universidade.unisinos.util.Horarios;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TurmaService {

    public static final int LIMITE_TURMAS_PROFESSOR = 3;

    private final TurmaRepository turmaRepository;
    private final MatriculaRepository matriculaRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final ProfessorRepository professorRepository;

    @Transactional(readOnly = true)
    public List<TurmaResponse> listar() {
        log.info("Listando turmas");
        return turmaRepository.findAll().stream()
                .map(this::paraResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TurmaResponse buscar(Long id) {
        log.info("Buscando turmas");
        return paraResponse(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public Turma buscarEntidade(Long id) {
        log.info("Buscando turmas");
        return turmaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Turma não encontrada."));
    }

    @Transactional
    public TurmaResponse criar(TurmaRequest request) {
        log.info("Criando turmas");
        Disciplina disciplina = buscarDisciplina(request.disciplinaId());
        Professor professor = buscarProfessor(request.professorId());

        validarCargaProfessor(professor, request.horario(), null);

        Turma turma = new Turma(disciplina, professor, request.horario(), request.vagas());
        return paraResponse(turmaRepository.save(turma));
    }

    @Transactional
    public TurmaResponse atualizar(Long id, TurmaRequest request) {
        log.info("Atualizando turmas");
        Turma turma = buscarEntidade(id);
        Disciplina disciplina = buscarDisciplina(request.disciplinaId());
        Professor professor = buscarProfessor(request.professorId());

        validarCargaProfessor(professor, request.horario(), id);

        List<Matricula> matriculasDaTurma = matriculaRepository.findByTurmaId(id);

        if (request.vagas() < matriculasDaTurma.size()) {
            throw new RegraDeNegocioException(
                    "Esta turma já tem " + matriculasDaTurma.size()
                            + " aluno(s) matriculado(s). As vagas não podem ser menores que isso.");
        }

        if (!matriculasDaTurma.isEmpty() && !turma.getDisciplina().getId().equals(disciplina.getId())) {
            throw new RegraDeNegocioException(
                    "Não é possível trocar a disciplina de uma turma que já tem alunos matriculados.");
        }

        if (!turma.getHorario().equals(request.horario())) {
            validarConflitoHorarioDosAlunos(id, request.horario(), matriculasDaTurma);
        }

        turma.setDisciplina(disciplina);
        turma.setProfessor(professor);
        turma.setHorario(request.horario());
        turma.setVagas(request.vagas());

        return paraResponse(turmaRepository.save(turma));
    }

    @Transactional
    public void remover(Long id) {
        log.info("Removendo turmas");
        Turma turma = buscarEntidade(id);
        matriculaRepository.deleteByTurmaId(id);
        turmaRepository.delete(turma);
    }

    public TurmaResponse paraResponse(Turma turma) {
        return TurmaMapper.toResponse(turma, matriculaRepository.countByTurmaId(turma.getId()));
    }

    private void validarCargaProfessor(Professor professor, String horario, Long turmaIdIgnorar) {
        long totalTurmas = turmaIdIgnorar == null
                ? turmaRepository.countByProfessorId(professor.getId())
                : turmaRepository.countByProfessorIdAndIdNot(professor.getId(), turmaIdIgnorar);

        if (totalTurmas >= LIMITE_TURMAS_PROFESSOR) {
            throw new RegraDeNegocioException(
                    "Este professor já possui " + LIMITE_TURMAS_PROFESSOR + " turmas.");
        }

        boolean horarioOcupado = turmaIdIgnorar == null
                ? turmaRepository.existsByProfessorIdAndHorario(professor.getId(), horario)
                : turmaRepository.existsByProfessorIdAndHorarioAndIdNot(professor.getId(), horario, turmaIdIgnorar);

        if (horarioOcupado) {
            throw new RegraDeNegocioException(
                    "Este professor já possui uma turma em " + Horarios.descricao(horario) + ".");
        }
    }

    private void validarConflitoHorarioDosAlunos(Long turmaId, String novoHorario, List<Matricula> matriculasDaTurma) {
        boolean alunoComConflito = matriculasDaTurma.stream()
                .map(matricula -> matricula.getAluno().getId())
                .anyMatch(alunoId -> matriculaRepository.findByAlunoId(alunoId).stream()
                        .filter(outra -> !outra.getTurma().getId().equals(turmaId))
                        .anyMatch(outra -> outra.getTurma().getHorario().equals(novoHorario)));

        if (alunoComConflito) {
            throw new RegraDeNegocioException(
                    "Não é possível mudar para " + Horarios.descricao(novoHorario)
                            + ": um aluno matriculado já tem outra turma nesse horário.");
        }
    }

    private Disciplina buscarDisciplina(Long id) {
        return disciplinaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Disciplina não encontrada."));
    }

    private Professor buscarProfessor(Long id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado."));
    }
}
