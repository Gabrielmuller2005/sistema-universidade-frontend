// Regras de negócio. Funções puras: recebem dados e devolvem um resultado,
// sem alterar estado. Quando há erro, devolvem a mensagem; senão, null.

import { textoHorario } from '../utils/horario.js'

export const LIMITE_TURMAS_PROFESSOR = 3

export function vagasLivres(turma, matriculas) {
  const ocupadas = matriculas.filter((m) => m.turmaId === turma.id).length
  return turma.vagas - ocupadas
}

export function cumprePreRequisito(disciplina, aluno) {
  if (!disciplina.preRequisitoId) {
    return true
  }
  return aluno.disciplinasAprovadas.includes(disciplina.preRequisitoId)
}

// ignorarTurmaId: usado na edição, para a própria turma não contar contra o professor.
export function validarCargaProfessor(novaTurma, turmas, ignorarTurmaId = null) {
  const turmasDoProfessor = turmas.filter(
    (t) => t.professorId === novaTurma.professorId && t.id !== ignorarTurmaId,
  )

  if (turmasDoProfessor.length >= LIMITE_TURMAS_PROFESSOR) {
    return `Este professor já possui ${LIMITE_TURMAS_PROFESSOR} turmas.`
  }

  if (turmasDoProfessor.some((t) => t.horario === novaTurma.horario)) {
    return `Este professor já possui uma turma em ${textoHorario(novaTurma.horario)}.`
  }

  return null
}

// Valida a edição de uma turma que já existe (turmaEditada traz o id).
export function validarEdicaoTurma(turmaEditada, turmas, matriculas) {
  const erroCarga = validarCargaProfessor(turmaEditada, turmas, turmaEditada.id)
  if (erroCarga) {
    return erroCarga
  }

  const original = turmas.find((t) => t.id === turmaEditada.id)
  const matriculasDaTurma = matriculas.filter((m) => m.turmaId === turmaEditada.id)

  if (turmaEditada.vagas < matriculasDaTurma.length) {
    return `Esta turma já tem ${matriculasDaTurma.length} aluno(s) matriculado(s). As vagas não podem ser menores que isso.`
  }

  if (matriculasDaTurma.length > 0 && original.disciplinaId !== turmaEditada.disciplinaId) {
    return 'Não é possível trocar a disciplina de uma turma que já tem alunos matriculados.'
  }

  if (original.horario !== turmaEditada.horario) {
    const alunoComConflito = matriculasDaTurma.some((m) =>
      matriculas.some((outra) => {
        if (outra.alunoId !== m.alunoId || outra.turmaId === turmaEditada.id) {
          return false
        }
        const outraTurma = turmas.find((t) => t.id === outra.turmaId)
        return outraTurma.horario === turmaEditada.horario
      }),
    )

    if (alunoComConflito) {
      return `Não é possível mudar para ${textoHorario(turmaEditada.horario)}: um aluno matriculado já tem outra turma nesse horário.`
    }
  }

  return null
}

export function validarMatricula(aluno, turma, turmasDoAluno, disciplinas, matriculas) {
  if (turmasDoAluno.some((t) => t.id === turma.id)) {
    return 'Você já está matriculado nesta turma.'
  }

  if (vagasLivres(turma, matriculas) <= 0) {
    return 'Não há vagas disponíveis nesta turma.'
  }

  const conflito = turmasDoAluno.find((t) => t.horario === turma.horario)
  if (conflito) {
    const disciplinaConflito = disciplinas.find((d) => d.id === conflito.disciplinaId)
    return `Conflito de horário com ${disciplinaConflito.nome} (${textoHorario(turma.horario)}).`
  }

  const disciplina = disciplinas.find((d) => d.id === turma.disciplinaId)
  if (!cumprePreRequisito(disciplina, aluno)) {
    const preRequisito = disciplinas.find((d) => d.id === disciplina.preRequisitoId)
    return `Pré-requisito não cumprido: é preciso ter aprovação em ${preRequisito.nome}.`
  }

  return null
}