import { useState } from 'react'
import Alerta from '../components/Alerta.jsx'
import { useDados } from '../context/DadosContext.jsx'
import { useSessao } from '../context/SessaoContext.jsx'
import { DIAS, textoHorario } from '../utils/horario.js'

// Tira acentos e maiúsculas para a busca não depender de como a pessoa digita.
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function Matricula() {
  const {
    turmas,
    buscarDisciplina,
    buscarProfessor,
    contarVagasLivres,
    turmasDoAluno,
    verificarMatricula,
    matricular,
  } = useDados()
  const { alunoLogado } = useSessao()
  const [mensagem, setMensagem] = useState(null)
  const [busca, setBusca] = useState('')
  const [dia, setDia] = useState('')
  const [apenasDisponiveis, setApenasDisponiveis] = useState(false)

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

  // Situação do aluno em relação a cada turma: matriculado, bloqueado (com motivo) ou livre.
  function situacaoDaTurma(turma) {
    if (minhasTurmas.some((t) => t.id === turma.id)) {
      return { tipo: 'matriculado' }
    }

    const motivo = verificarMatricula(alunoLogado.id, turma.id)
    return motivo ? { tipo: 'bloqueada', motivo } : { tipo: 'livre' }
  }

  const linhas = turmas
    .map((turma) => ({
      turma,
      disciplina: buscarDisciplina(turma.disciplinaId),
      professor: buscarProfessor(turma.professorId),
      situacao: situacaoDaTurma(turma),
    }))
    .filter(({ turma, disciplina, professor, situacao }) => {
      const textoBusca = normalizar(busca.trim())
      const combinaBusca =
        textoBusca === '' ||
        normalizar(disciplina.nome).includes(textoBusca) ||
        normalizar(professor.nome).includes(textoBusca)
      const combinaDia = dia === '' || turma.horario[0] === dia
      const combinaDisponibilidade = !apenasDisponiveis || situacao.tipo === 'livre'

      return combinaBusca && combinaDia && combinaDisponibilidade
    })

  const temFiltro = busca !== '' || dia !== '' || apenasDisponiveis

  function limparFiltros() {
    setBusca('')
    setDia('')
    setApenasDisponiveis(false)
  }

  return (
    <>
      <h1 className="h4 mb-4">Matrícula</h1>

      <Alerta mensagem={mensagem} onFechar={() => setMensagem(null)} />

      {turmas.length === 0 ? (
        <p className="text-secondary">Nenhuma turma ofertada no momento.</p>
      ) : (
        <>
          <div className="row g-3 align-items-end mb-4">
            <div className="col-md-5">
              <label className="form-label" htmlFor="busca">Buscar</label>
              <input
                id="busca"
                className="form-control"
                placeholder="Disciplina ou professor"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label" htmlFor="filtroDia">Dia</label>
              <select
                id="filtroDia"
                className="form-select"
                value={dia}
                onChange={(e) => setDia(e.target.value)}
              >
                <option value="">Todos</option>
                {DIAS.map((d) => (
                  <option key={d.codigo} value={d.codigo}>{d.nome}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4 d-flex align-items-center gap-3">
              <div className="form-check mb-0">
                <input
                  id="apenasDisponiveis"
                  type="checkbox"
                  className="form-check-input"
                  checked={apenasDisponiveis}
                  onChange={(e) => setApenasDisponiveis(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="apenasDisponiveis">
                  Só as que posso cursar
                </label>
              </div>

              {temFiltro && (
                <button className="btn btn-link btn-sm p-0" onClick={limparFiltros}>
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {linhas.length === 0 ? (
            <p className="text-secondary">Nenhuma turma encontrada com esses filtros.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Disciplina</th>
                    <th>Pré-requisito</th>
                    <th>Professor</th>
                    <th>Horário</th>
                    <th>Vagas livres</th>
                    <th>Situação</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {linhas.map(({ turma, disciplina, professor, situacao }) => (
                    <tr key={turma.id}>
                      <td>{disciplina.nome}</td>
                      <td>{nomePreRequisito(disciplina)}</td>
                      <td>{professor.nome}</td>
                      <td>{textoHorario(turma.horario)}</td>
                      <td>{contarVagasLivres(turma)}</td>
                      <td>
                        {situacao.tipo === 'matriculado' && (
                          <span className="badge text-bg-success">Matriculado</span>
                        )}
                        {situacao.tipo === 'livre' && (
                          <span className="small text-success">Disponível</span>
                        )}
                        {situacao.tipo === 'bloqueada' && (
                          <span className="small text-danger">{situacao.motivo}</span>
                        )}
                      </td>
                      <td className="text-end">
                        {situacao.tipo !== 'matriculado' && (
                          <button
                            className="btn btn-sm btn-primary"
                            disabled={situacao.tipo === 'bloqueada'}
                            onClick={() => fazerMatricula(turma.id)}
                          >
                            Matricular
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default Matricula