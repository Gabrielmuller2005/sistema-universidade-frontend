import { useState } from 'react'
import Alerta from '../components/Alerta.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import FormTurma from '../components/FormTurma.jsx'
import { useDados } from '../context/DadosContext.jsx'
import { textoHorario } from '../utils/horario.js'

function textoAlunos(quantidade) {
  return quantidade === 1
    ? '1 aluno matriculado perderá a matrícula'
    : `${quantidade} alunos matriculados perderão a matrícula`
}

function Turmas() {
  const {
    turmas,
    disciplinas,
    professores,
    carregando,
    erro,
    contarVagasLivres,
    contarMatriculas,
    adicionarTurma,
    editarTurma,
    removerTurma,
    restaurarDadosIniciais,
  } = useDados()
  const [mensagem, setMensagem] = useState(null)
  const [turmaEmEdicao, setTurmaEmEdicao] = useState(null)
  const [turmaParaRemover, setTurmaParaRemover] = useState(null)
  const [restaurando, setRestaurando] = useState(false)

  async function salvarTurma(dados) {
    const erroApi = turmaEmEdicao
      ? await editarTurma(turmaEmEdicao.id, dados)
      : await adicionarTurma(dados)

    if (erroApi) {
      setMensagem({ tipo: 'danger', texto: erroApi })
      return erroApi
    }

    setMensagem({ tipo: 'success', texto: turmaEmEdicao ? 'Turma atualizada.' : 'Turma cadastrada.' })
    setTurmaEmEdicao(null)
    return null
  }

  async function confirmarRemocao() {
    const erroApi = await removerTurma(turmaParaRemover.id)

    if (turmaEmEdicao && turmaEmEdicao.id === turmaParaRemover.id) {
      setTurmaEmEdicao(null)
    }
    setTurmaParaRemover(null)
    setMensagem(
      erroApi
        ? { tipo: 'danger', texto: erroApi }
        : { tipo: 'success', texto: 'Turma removida.' },
    )
  }

  async function confirmarRestauracao() {
    const erroApi = await restaurarDadosIniciais()
    setTurmaEmEdicao(null)
    setRestaurando(false)
    setMensagem(
      erroApi
        ? { tipo: 'danger', texto: erroApi }
        : { tipo: 'success', texto: 'Dados de exemplo restaurados.' },
    )
  }

  function textoRemocao() {
    const horario = textoHorario(turmaParaRemover.horario)
    const matriculados = contarMatriculas(turmaParaRemover)

    if (matriculados === 0) {
      return `Remover a turma de ${turmaParaRemover.disciplinaNome} (${horario})?`
    }
    return `Remover a turma de ${turmaParaRemover.disciplinaNome} (${horario})? ${textoAlunos(matriculados)}.`
  }

  if (carregando) {
    return <p className="text-secondary">Carregando dados...</p>
  }

  if (erro) {
    return <div className="alert alert-danger">{erro}</div>
  }

  return (
    <>
      <h1 className="h4 mb-4">Turmas ofertadas</h1>

      <Alerta mensagem={mensagem} onFechar={() => setMensagem(null)} />

      <div className="row g-5">
        <div className="col-lg-4">
          <h2 className="h6 text-uppercase text-secondary mb-3">
            {turmaEmEdicao ? 'Editar turma' : 'Nova turma'}
          </h2>
          <FormTurma
            key={turmaEmEdicao ? turmaEmEdicao.id : 'nova'}
            disciplinas={disciplinas}
            professores={professores}
            turma={turmaEmEdicao}
            onSalvar={salvarTurma}
            onCancelar={() => setTurmaEmEdicao(null)}
          />
        </div>

        <div className="col-lg-8">
          {turmas.length === 0 ? (
            <p className="text-secondary">Nenhuma turma cadastrada.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Disciplina</th>
                    <th>Professor</th>
                    <th>Horário</th>
                    <th>Vagas livres</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {turmas.map((turma) => (
                    <tr
                      key={turma.id}
                      className={turmaEmEdicao && turmaEmEdicao.id === turma.id ? 'table-active' : ''}
                    >
                      <td>{turma.disciplinaNome}</td>
                      <td>{turma.professorNome}</td>
                      <td>{textoHorario(turma.horario)}</td>
                      <td>{contarVagasLivres(turma)} de {turma.vagas}</td>
                      <td className="text-end text-nowrap">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => setTurmaEmEdicao(turma)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setTurmaParaRemover(turma)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            className="btn btn-link btn-sm text-secondary p-0 mt-3"
            onClick={() => setRestaurando(true)}
          >
            Restaurar dados de exemplo
          </button>
        </div>
      </div>

      {turmaParaRemover && (
        <ConfirmModal
          titulo="Remover turma"
          texto={textoRemocao()}
          textoConfirmar="Remover"
          onConfirmar={confirmarRemocao}
          onCancelar={() => setTurmaParaRemover(null)}
        />
      )}

      {restaurando && (
        <ConfirmModal
          titulo="Restaurar dados de exemplo"
          texto="Todas as turmas e matrículas voltarão ao estado inicial. Deseja continuar?"
          textoConfirmar="Restaurar"
          onConfirmar={confirmarRestauracao}
          onCancelar={() => setRestaurando(false)}
        />
      )}
    </>
  )
}

export default Turmas
