import { useState } from 'react'
import { useDados } from '../context/DadosContext.jsx'
import { useSessao } from '../context/SessaoContext.jsx'
import { textoHorario } from '../utils/horario.js'

function Matricula() {
  const { turmas, buscarDisciplina, buscarProfessor, contarVagasLivres, turmasDoAluno, matricular } =
    useDados()
  const { alunoLogado } = useSessao()
  const [mensagem, setMensagem] = useState(null)

  const minhasTurmas = turmasDoAluno(alunoLogado.id)

  function fazerMatricula(turmaId) {
    const erro = matricular(alunoLogado.id, turmaId)

    if (erro) {
      setMensagem({ tipo: 'danger', texto: erro })
    } else {
      setMensagem({ tipo: 'success', texto: 'Matrícula realizada.' })
    }
  }

  function nomePreRequisito(disciplina) {
    if (!disciplina.preRequisitoId) {
      return '-'
    }
    return buscarDisciplina(disciplina.preRequisitoId).nome
  }

  return (
    <>
      <h1 className="h4 mb-4">Matrícula</h1>

      {mensagem && <div className={`alert alert-${mensagem.tipo}`}>{mensagem.texto}</div>}

      {turmas.length === 0 ? (
        <p className="text-secondary">Nenhuma turma ofertada no momento.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Disciplina</th>
                <th>Pré-requisito</th>
                <th>Professor</th>
                <th>Horário</th>
                <th>Vagas livres</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {turmas.map((turma) => {
                const disciplina = buscarDisciplina(turma.disciplinaId)
                const jaMatriculado = minhasTurmas.some((t) => t.id === turma.id)

                return (
                  <tr key={turma.id}>
                    <td>{disciplina.nome}</td>
                    <td>{nomePreRequisito(disciplina)}</td>
                    <td>{buscarProfessor(turma.professorId).nome}</td>
                    <td>{textoHorario(turma.horario)}</td>
                    <td>{contarVagasLivres(turma)}</td>
                    <td className="text-end">
                      {jaMatriculado ? (
                        <span className="text-success small">Matriculado</span>
                      ) : (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => fazerMatricula(turma.id)}
                        >
                          Matricular
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default Matricula
