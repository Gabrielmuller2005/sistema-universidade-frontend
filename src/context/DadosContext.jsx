// Todo acesso aos dados passa por aqui. As páginas não sabem de onde
// os dados vêm: agora eles vêm da API do backend Spring Boot.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  atualizarTurma,
  cancelarMatricula as cancelarMatriculaApi,
  criarTurma,
  listarDisciplinas,
  listarProfessores,
  listarTurmas,
  listarTurmasDoAluno,
  matricular as matricularApi,
  removerTurma as removerTurmaApi,
  restaurarDadosIniciais as restaurarDadosIniciaisApi,
  verificarMatricula as verificarMatriculaApi,
} from '../services/api.js'

const DadosContext = createContext(null)

export function DadosProvider({ children }) {
  const [disciplinas, setDisciplinas] = useState([])
  const [professores, setProfessores] = useState([])
  const [turmas, setTurmas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const recarregarBase = useCallback(async () => {
    const [listaDisciplinas, listaProfessores, listaTurmas] = await Promise.all([
      listarDisciplinas(),
      listarProfessores(),
      listarTurmas(),
    ])
    setDisciplinas(listaDisciplinas)
    setProfessores(listaProfessores)
    setTurmas(listaTurmas)
  }, [])

  const recarregarTurmas = useCallback(async () => {
    setTurmas(await listarTurmas())
  }, [])

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        await recarregarBase()
        if (ativo) {
          setErro(null)
        }
      } catch (excecao) {
        if (ativo) {
          setErro(excecao.message)
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    carregar()

    return () => {
      ativo = false
    }
  }, [recarregarBase])

  const buscarDisciplina = useCallback(
    (id) => disciplinas.find((disciplina) => disciplina.id === id),
    [disciplinas],
  )

  const contarVagasLivres = useCallback((turma) => turma.vagasLivres, [])

  const contarMatriculas = useCallback((turma) => turma.numeroMatriculados, [])

  const turmasDoAluno = useCallback((alunoId) => listarTurmasDoAluno(alunoId), [])

  const verificarMatricula = useCallback(
    (alunoId, turmaId) => verificarMatriculaApi(alunoId, turmaId),
    [],
  )

  const adicionarTurma = useCallback(
    async (dados) => {
      try {
        await criarTurma(dados)
        await recarregarTurmas()
        return null
      } catch (excecao) {
        return excecao.message
      }
    },
    [recarregarTurmas],
  )

  const editarTurma = useCallback(
    async (turmaId, dados) => {
      try {
        await atualizarTurma(turmaId, dados)
        await recarregarTurmas()
        return null
      } catch (excecao) {
        return excecao.message
      }
    },
    [recarregarTurmas],
  )

  const removerTurma = useCallback(
    async (turmaId) => {
      try {
        await removerTurmaApi(turmaId)
        await recarregarTurmas()
        return null
      } catch (excecao) {
        return excecao.message
      }
    },
    [recarregarTurmas],
  )

  const matricular = useCallback(
    async (alunoId, turmaId) => {
      try {
        await matricularApi(alunoId, turmaId)
        await recarregarTurmas()
        return null
      } catch (excecao) {
        return excecao.message
      }
    },
    [recarregarTurmas],
  )

  const cancelarMatricula = useCallback(
    async (alunoId, turmaId) => {
      try {
        await cancelarMatriculaApi(alunoId, turmaId)
        await recarregarTurmas()
        return null
      } catch (excecao) {
        return excecao.message
      }
    },
    [recarregarTurmas],
  )

  const restaurarDadosIniciais = useCallback(async () => {
    try {
      await restaurarDadosIniciaisApi()
      await recarregarBase()
      return null
    } catch (excecao) {
      return excecao.message
    }
  }, [recarregarBase])

  const valor = useMemo(
    () => ({
      disciplinas,
      professores,
      turmas,
      carregando,
      erro,
      buscarDisciplina,
      contarVagasLivres,
      contarMatriculas,
      turmasDoAluno,
      verificarMatricula,
      adicionarTurma,
      editarTurma,
      removerTurma,
      matricular,
      cancelarMatricula,
      restaurarDadosIniciais,
    }),
    [
      disciplinas,
      professores,
      turmas,
      carregando,
      erro,
      buscarDisciplina,
      contarVagasLivres,
      contarMatriculas,
      turmasDoAluno,
      verificarMatricula,
      adicionarTurma,
      editarTurma,
      removerTurma,
      matricular,
      cancelarMatricula,
      restaurarDadosIniciais,
    ],
  )

  return <DadosContext.Provider value={valor}>{children}</DadosContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDados() {
  return useContext(DadosContext)
}
