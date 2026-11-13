import { useCallback, useEffect, useState } from 'react'
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
    carregando,
    erro,
    buscarDisciplina,
    contarVagasLivres,
    turmasDoAluno,
    verificarMatricula,
    matricular,
  } = useDados()
  const { alunoLogado } = useSessao()
  const alunoId = alunoLogado?.id
  const [mensagem, setMensagem] = useState(null)
  const [busca, setBusca] = useState('')
  const [dia, setDia] = useState('')
  const [apenasDisponiveis, setApenasDisponiveis] = useState(false)
  const [minhasTurmas, setMinhasTurmas] = useState(null)
  const [situacoes, setSituacoes] = useState(null)
  const [matriculandoId, setMatriculandoId] = useState(null)

  const carregarSituacoes = useCallback(async () => {
    if (!alunoId) {
      return
    }

    const minhas = await turmasDoAluno(alunoId)
    const idsMatriculados = new Set(minhas.map((turma) => turma.id))
    const pares = await Promise.all(
      turmas
        .filter((turma) => !idsMatriculados.has(turma.id))
        .map(async (turma) => [turma.id, await verificarMatricula(alunoId, turma.id)]),
    )

    setMinhasTurmas(minhas)
    setSituacoes(new Map(pares))
  }, [alunoId, turmas, turmasDoAluno, verificarMatricula])

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        await carregarSituacoes()
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
  }, [carregarSituacoes])

  async function fazerMatricula(turmaId) {
    setMatriculandoId(turmaId)
    const erroApi = await matricular(alunoId, turmaId)

    if (erroApi) {
      setMensagem({ tipo: 'danger', texto: erroApi })
    } else {
      setMensagem({ tipo: 'success', texto: 'Matrícula realizada.' })
      await carregarSituacoes()
    }

    setMatriculandoId(null)
  }

  // Situação do aluno em relação a cada turma: matriculado, bloqueado (com motivo) ou livre.
  function situacaoDaTurma(turma) {
    if (!situacoes || !minhasTurmas) {
      return { tipo: 'verificando' }
    }

    if (minhasTurmas.some((t) => t.id === turma.id)) {
      return { tipo: 'matriculado' }
    }

    const verificacao = situacoes.get(turma.id)
    return verificacao && !verificacao.podeMatricular
      ? { tipo: 'bloqueada', motivo: verificacao.motivo }
      : { tipo: 'livre' }
  }

  const linhas = turmas
    .map((turma) => ({ turma, situacao: situacaoDaTurma(turma) }))
    .filter(({ turma, situacao }) => {
      const textoBusca = normalizar(busca.trim())
      const combinaBusca =
        textoBusca === '' ||
        normalizar(turma.disciplinaNome).includes(textoBusca) ||
        normalizar(turma.professorNome).includes(textoBusca)
      const combinaDia = dia === '' || turma.horario[0] === dia
      const combinaDisponibilidade = !apenasDisponiveis || situacao.tipo === 'livre'

      return combinaBusca && combinaDia && combinaDisponibilidade
    })

  function nomePreRequisito(turma) {
    const disciplina = buscarDisciplina(turma.disciplinaId)
    return disciplina?.preRequisitoNome ?? '-'
  }

  const temFiltro = busca !== '' || dia !== '' || apenasDisponiveis

  function limparFiltros() {
    setBusca('')
    setDia('')
    setApenasDisponiveis(false)
  }

  if (carregando) {
    return <p className="text-secondary">Carregando dados...</p>
  }

  if (erro) {
    return <div className="alert alert-danger">{erro}</div>
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
                  {linhas.map(({ turma, situacao }) => (
                    <tr key={turma.id}>
                      <td>{turma.disciplinaNome}</td>
                      <td>{nomePreRequisito(turma)}</td>
                      <td>{turma.professorNome}</td>
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
                        {situacao.tipo === 'verificando' && (
                          <span className="small text-secondary">Verificando...</span>
                        )}
                      </td>
                      <td className="text-end">
                        {situacao.tipo === 'livre' && (
                          <button
                            className="btn btn-sm btn-primary"
                            disabled={matriculandoId === turma.id}
                            onClick={() => fazerMatricula(turma.id)}
                          >
                            {matriculandoId === turma.id ? 'Matriculando...' : 'Matricular'}
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
