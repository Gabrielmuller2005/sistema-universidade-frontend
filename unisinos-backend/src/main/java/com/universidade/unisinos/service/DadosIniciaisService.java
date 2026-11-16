package com.universidade.unisinos.service;

import com.universidade.unisinos.entity.Aluno;
import com.universidade.unisinos.entity.Disciplina;
import com.universidade.unisinos.entity.Matricula;
import com.universidade.unisinos.entity.Professor;
import com.universidade.unisinos.entity.Turma;
import com.universidade.unisinos.entity.UsuarioInstituicao;
import com.universidade.unisinos.repository.AlunoRepository;
import com.universidade.unisinos.repository.DisciplinaRepository;
import com.universidade.unisinos.repository.MatriculaRepository;
import com.universidade.unisinos.repository.ProfessorRepository;
import com.universidade.unisinos.repository.TurmaRepository;
import com.universidade.unisinos.repository.UsuarioInstituicaoRepository;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DadosIniciaisService implements CommandLineRunner {

    private static final String SENHA_ALUNO = "1234";
    private static final String SENHA_INSTITUICAO = "admin";

    private final DisciplinaRepository disciplinaRepository;
    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final UsuarioInstituicaoRepository usuarioInstituicaoRepository;
    private final TurmaRepository turmaRepository;
    private final MatriculaRepository matriculaRepository;
    private final SenhaService senhaService;

    @Override
    @Transactional
    public void run(String... args) {
        semearSeNecessario();
    }

    @Transactional
    public void semearSeNecessario() {
        if (disciplinaRepository.count() == 0) {
            semearBase();
        }
        if (turmaRepository.count() == 0) {
            semearTurmasEMatriculas();
        }
    }

    @Transactional
    public void restaurarTurmasEMatriculas() {
        matriculaRepository.deleteAll();
        turmaRepository.deleteAll();
        semearTurmasEMatriculas();
    }

    private void semearBase() {
        Disciplina algoritmos = disciplinaRepository.save(new Disciplina("Algoritmos", null));
        Disciplina estruturas = disciplinaRepository.save(new Disciplina("Estruturas de Dados", algoritmos));
        disciplinaRepository.save(new Disciplina("Programação Front-end", null));
        disciplinaRepository.save(new Disciplina("Banco de Dados", estruturas));

        professorRepository.save(new Professor("Ana Ribeiro"));
        professorRepository.save(new Professor("Bruno Carvalho"));
        professorRepository.save(new Professor("Carla Mendes"));

        alunoRepository.save(new Aluno(
                "Maria Souza",
                "2026001",
                senhaService.criptografar(SENHA_ALUNO),
                Set.of(algoritmos)));
        alunoRepository.save(new Aluno(
                "João Lima",
                "2026002",
                senhaService.criptografar(SENHA_ALUNO),
                Set.of()));

        usuarioInstituicaoRepository.save(new UsuarioInstituicao(
                "Secretaria",
                "secretaria",
                senhaService.criptografar(SENHA_INSTITUICAO)));
    }

    private void semearTurmasEMatriculas() {
        Disciplina algoritmos = buscarDisciplina("Algoritmos");
        Disciplina estruturas = buscarDisciplina("Estruturas de Dados");
        Disciplina frontEnd = buscarDisciplina("Programação Front-end");
        Disciplina bancoDeDados = buscarDisciplina("Banco de Dados");

        Professor ana = buscarProfessor("Ana Ribeiro");
        Professor bruno = buscarProfessor("Bruno Carvalho");
        Professor carla = buscarProfessor("Carla Mendes");

        Turma algoritmosSegundaManha = turmaRepository.save(new Turma(algoritmos, ana, "21", 1));
        turmaRepository.save(new Turma(estruturas, bruno, "33", 25));
        turmaRepository.save(new Turma(frontEnd, carla, "33", 20));
        turmaRepository.save(new Turma(bancoDeDados, ana, "52", 30));

        Aluno joao = alunoRepository.findByMatricula("2026002")
                .orElseThrow(() -> new IllegalStateException("Aluno de exemplo não encontrado."));
        matriculaRepository.save(new Matricula(joao, algoritmosSegundaManha));
    }

    private Disciplina buscarDisciplina(String nome) {
        return disciplinaRepository.findByNome(nome)
                .orElseThrow(() -> new IllegalStateException("Disciplina de exemplo não encontrada: " + nome));
    }

    private Professor buscarProfessor(String nome) {
        return professorRepository.findByNome(nome)
                .orElseThrow(() -> new IllegalStateException("Professor de exemplo não encontrado: " + nome));
    }
}
