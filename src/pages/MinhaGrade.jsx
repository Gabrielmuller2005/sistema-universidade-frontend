import { useCallback, useEffect, useState } from 'react'
import Alerta from '../components/Alerta.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import GradeSemanal from '../components/GradeSemanal.jsx'
import { useDados } from '../context/DadosContext.jsx'
import { useSessao } from '../context/SessaoContext.jsx'

function MinhaGrade() {
  const { turmasDoAluno, cancelarMatricula } = useDados()
  const { alunoLogado } = useSessao()
  const alunoId = alunoLogado?.id
  const [mensagem, setMensagem] = useState(null)
  const [turmasDaGrade, setTurmasDaGrade] = useState(null)
  const [turmaParaCancelar, setTurmaParaCancelar] = useState(null)

  const carregarGrade = useCallback(async () => {
    if (!alunoId) {
      return
    }

    const turmas = await turmasDoAluno(alunoId)
    setTurmasDaGrade(
      turmas.map((turma) => ({
        id: turma.id,
        horario: turma.horario,
        disciplina: turma.disciplinaNome,
        professor: turma.professorNome,
      })),
    )
  }, [alunoId, turmasDoAluno])

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        await carregarGrade()
      } catch (excecao) {
        if (ativo) {
          setMensagem({ tipo: 'danger', texto: excecao.message })
        }
      }
    }

    carregar()

    return () => {
      ativo = false
    }
  }, [carregarGrade])

  const turmaSelecionada = turmasDaGrade?.find((t) => t.id === turmaParaCancelar)

  async function confirmarCancelamento() {
    const erroApi = await cancelarMatricula(alunoId, turmaParaCancelar)
    setTurmaParaCancelar(null)

    if (erroApi) {
      setMensagem({ tipo: 'danger', texto: erroApi })
      return
    }

    setMensagem({ tipo: 'success', texto: 'Matrícula cancelada.' })
    await carregarGrade()
  }

  if (!turmasDaGrade) {
    return <p className="text-secondary">Carregando dados...</p>
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
