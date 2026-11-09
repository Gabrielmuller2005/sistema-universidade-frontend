import { useState } from 'react'
import GradeSemanal from '../components/GradeSemanal.jsx'
import { useDados } from '../context/DadosContext.jsx'
import { useSessao } from '../context/SessaoContext.jsx'

function MinhaGrade() {
  const { turmasDoAluno, buscarDisciplina, buscarProfessor, cancelarMatricula } = useDados()
  const { alunoLogado } = useSessao()
  const [mensagem, setMensagem] = useState(null)

  const turmasDaGrade = turmasDoAluno(alunoLogado.id).map((turma) => ({
    id: turma.id,
    horario: turma.horario,
    disciplina: buscarDisciplina(turma.disciplinaId).nome,
    professor: buscarProfessor(turma.professorId).nome,
  }))

  function cancelar(turmaId) {
    cancelarMatricula(alunoLogado.id, turmaId)
    setMensagem('Matrícula cancelada.')
  }

  return (
    <>
      <h1 className="h4 mb-4">Minha grade</h1>

      {mensagem && <div className="alert alert-success">{mensagem}</div>}

      {turmasDaGrade.length === 0 && (
        <p className="text-secondary">Você ainda não está matriculado em nenhuma turma.</p>
      )}

      <GradeSemanal turmas={turmasDaGrade} onCancelar={cancelar} />
    </>
  )
}

export default MinhaGrade
