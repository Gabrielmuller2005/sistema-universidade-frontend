import { useState } from 'react'
import Alerta from '../components/Alerta.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import GradeSemanal from '../components/GradeSemanal.jsx'
import { useDados } from '../context/DadosContext.jsx'
import { useSessao } from '../context/SessaoContext.jsx'

function MinhaGrade() {
  const { turmasDoAluno, buscarDisciplina, buscarProfessor, cancelarMatricula } = useDados()
  const { alunoLogado } = useSessao()
  const [mensagem, setMensagem] = useState(null)
  const [turmaParaCancelar, setTurmaParaCancelar] = useState(null)

  const turmasDaGrade = turmasDoAluno(alunoLogado.id).map((turma) => ({
    id: turma.id,
    horario: turma.horario,
    disciplina: buscarDisciplina(turma.disciplinaId).nome,
    professor: buscarProfessor(turma.professorId).nome,
  }))

  const turmaSelecionada = turmasDaGrade.find((t) => t.id === turmaParaCancelar)

  function confirmarCancelamento() {
    cancelarMatricula(alunoLogado.id, turmaParaCancelar)
    setTurmaParaCancelar(null)
    setMensagem({ tipo: 'success', texto: 'Matrícula cancelada.' })
  }

  return (
    <>
      <h1 className="h4 mb-4">Minha grade</h1>

      <Alerta mensagem={mensagem} onFechar={() => setMensagem(null)} />

      {turmasDaGrade.length === 0 && (
        <p className="text-secondary">Você ainda não está matriculado em nenhuma turma.</p>
      )}

      <GradeSemanal turmas={turmasDaGrade} onCancelar={setTurmaParaCancelar} />

      {turmaSelecionada && (
        <ConfirmModal
          titulo="Cancelar matrícula"
          texto={`Cancelar sua matrícula em ${turmaSelecionada.disciplina}?`}
          textoConfirmar="Cancelar matrícula"
          onConfirmar={confirmarCancelamento}
          onCancelar={() => setTurmaParaCancelar(null)}
        />
      )}
    </>
  )
}

export default MinhaGrade