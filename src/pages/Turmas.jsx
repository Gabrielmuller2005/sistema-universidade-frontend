import { useState } from 'react'
import FormTurma from '../components/FormTurma.jsx'
import { useDados } from '../context/DadosContext.jsx'
import { textoHorario } from '../utils/horario.js'

function Turmas() {
  const {
    turmas,
    disciplinas,
    professores,
    buscarDisciplina,
    buscarProfessor,
    contarVagasLivres,
    adicionarTurma,
    removerTurma,
  } = useDados()
  const [mensagem, setMensagem] = useState(null)

  function salvarTurma(novaTurma) {
    const erro = adicionarTurma(novaTurma)

    if (erro) {
      setMensagem({ tipo: 'danger', texto: erro })
    } else {
      setMensagem({ tipo: 'success', texto: 'Turma cadastrada.' })
    }

    return erro
  }

  function excluirTurma(turmaId) {
    removerTurma(turmaId)
    setMensagem({ tipo: 'success', texto: 'Turma removida.' })
  }

  return (
    <>
      <h1 className="h4 mb-4">Turmas ofertadas</h1>

      {mensagem && <div className={`alert alert-${mensagem.tipo}`}>{mensagem.texto}</div>}

      <div className="row g-5">
        <div className="col-lg-4">
          <h2 className="h6 text-uppercase text-secondary mb-3">Nova turma</h2>
          <FormTurma disciplinas={disciplinas} professores={professores} onSalvar={salvarTurma} />
        </div>

        <div className="col-lg-8">
          {turmas.length === 0 ? (
            <p className="text-secondary">Nenhuma turma cadastrada.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
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
                    <tr key={turma.id}>
                      <td>{buscarDisciplina(turma.disciplinaId).nome}</td>
                      <td>{buscarProfessor(turma.professorId).nome}</td>
                      <td>{textoHorario(turma.horario)}</td>
                      <td>{contarVagasLivres(turma)} de {turma.vagas}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => excluirTurma(turma.id)}
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
        </div>
      </div>
    </>
  )
}

export default Turmas
