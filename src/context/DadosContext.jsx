// Todo acesso aos dados passa por aqui. As páginas não sabem de onde
// os dados vêm: hoje é estado local (salvo no navegador), depois será a API.

import { createContext, useContext, useState } from 'react'
import { useArmazenamento } from '../hooks/useArmazenamento.js'
import {
  alunosIniciais,
  disciplinasIniciais,
  matriculasIniciais,
  professoresIniciais,
  turmasIniciais,
  usuariosInstituicaoIniciais,
} from '../services/dadosIniciais.js'
import {
  validarCargaProfessor,
  validarEdicaoTurma,
  validarMatricula,
  vagasLivres,
} from '../services/regras.js'

const DadosContext = createContext(null)

function proximoId(lista) {
  return lista.reduce((maior, item) => Math.max(maior, item.id), 0) + 1
}

export function DadosProvider({ children }) {
  const [disciplinas] = useState(disciplinasIniciais)
  const [professores] = useState(professoresIniciais)
  const [alunos] = useState(alunosIniciais)
  const [usuariosInstituicao] = useState(usuariosInstituicaoIniciais)
  const [turmas, setTurmas] = useArmazenamento('su:turmas', turmasIniciais)
  const [matriculas, setMatriculas] = useArmazenamento('su:matriculas', matriculasIniciais)

  // Devolve o usuário encontrado ou null se o login ou a senha estiverem errados.
  function autenticar(perfil, login, senha) {
    if (perfil === 'aluno') {
      return alunos.find((a) => a.matricula === login && a.senha === senha) || null
    }
    return usuariosInstituicao.find((u) => u.usuario === login && u.senha === senha) || null
  }

  // Usado para recuperar a sessão depois de recarregar a página.
  function buscarUsuario(perfil, id) {
    const lista = perfil === 'aluno' ? alunos : usuariosInstituicao
    return lista.find((u) => u.id === id) || null
  }

  function buscarDisciplina(id) {
    return disciplinas.find((d) => d.id === id)
  }

  function buscarProfessor(id) {
    return professores.find((p) => p.id === id)
  }

  function contarVagasLivres(turma) {
    return vagasLivres(turma, matriculas)
  }

  function contarMatriculas(turma) {
    return matriculas.filter((m) => m.turmaId === turma.id).length
  }

  function turmasDoAluno(alunoId) {
    return matriculas
      .filter((m) => m.alunoId === alunoId)
      .map((m) => turmas.find((t) => t.id === m.turmaId))
      .filter(Boolean)
  }

  function adicionarTurma(novaTurma) {
    const erro = validarCargaProfessor(novaTurma, turmas)
    if (erro) {
      return erro
    }

    setTurmas([...turmas, { ...novaTurma, id: proximoId(turmas) }])
    return null
  }

  function editarTurma(turmaId, dados) {
    const turmaEditada = { ...dados, id: turmaId }
    const erro = validarEdicaoTurma(turmaEditada, turmas, matriculas)
    if (erro) {
      return erro
    }

    setTurmas(turmas.map((t) => (t.id === turmaId ? turmaEditada : t)))
    return null
  }

  function removerTurma(turmaId) {
    setTurmas(turmas.filter((t) => t.id !== turmaId))
    setMatriculas(matriculas.filter((m) => m.turmaId !== turmaId))
  }

  // Devolve o motivo pelo qual o aluno não pode se matricular, ou null se pode.
  function verificarMatricula(alunoId, turmaId) {
    const aluno = alunos.find((a) => a.id === alunoId)
    const turma = turmas.find((t) => t.id === turmaId)
    return validarMatricula(aluno, turma, turmasDoAluno(alunoId), disciplinas, matriculas)
  }

  function matricular(alunoId, turmaId) {
    const erro = verificarMatricula(alunoId, turmaId)
    if (erro) {
      return erro
    }

    setMatriculas([...matriculas, { id: proximoId(matriculas), alunoId, turmaId }])
    return null
  }

  function cancelarMatricula(alunoId, turmaId) {
    setMatriculas(matriculas.filter((m) => !(m.alunoId === alunoId && m.turmaId === turmaId)))
  }

  function restaurarDadosIniciais() {
    setTurmas(turmasIniciais)
    setMatriculas(matriculasIniciais)
  }

  const valor = {
    disciplinas,
    professores,
    turmas,
    autenticar,
    buscarUsuario,
    buscarDisciplina,
    buscarProfessor,
    contarVagasLivres,
    contarMatriculas,
    turmasDoAluno,
    adicionarTurma,
    editarTurma,
    removerTurma,
    verificarMatricula,
    matricular,
    cancelarMatricula,
    restaurarDadosIniciais,
  }

  return <DadosContext.Provider value={valor}>{children}</DadosContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDados() {
  return useContext(DadosContext)
}