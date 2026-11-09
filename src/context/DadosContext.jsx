// Todo acesso aos dados passa por aqui. As páginas não sabem de onde
// os dados vêm: hoje é estado local, depois será a API.

import { createContext, useContext, useState } from 'react'
import {
  alunosIniciais,
  disciplinasIniciais,
  matriculasIniciais,
  professoresIniciais,
  turmasIniciais,
  usuariosInstituicaoIniciais,
} from '../services/dadosIniciais.js'
import { validarCargaProfessor, validarMatricula, vagasLivres } from '../services/regras.js'

const DadosContext = createContext(null)

export function DadosProvider({ children }) {
  const [disciplinas] = useState(disciplinasIniciais)
  const [professores] = useState(professoresIniciais)
  const [alunos] = useState(alunosIniciais)
  const [usuariosInstituicao] = useState(usuariosInstituicaoIniciais)
  const [turmas, setTurmas] = useState(turmasIniciais)
  const [matriculas, setMatriculas] = useState(matriculasIniciais)

  // Devolve o usuário encontrado ou null se o login ou a senha estiverem errados.
  function autenticar(perfil, login, senha) {
    if (perfil === 'aluno') {
      return alunos.find((a) => a.matricula === login && a.senha === senha) || null
    }
    return usuariosInstituicao.find((u) => u.usuario === login && u.senha === senha) || null
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

  function turmasDoAluno(alunoId) {
    return matriculas
      .filter((m) => m.alunoId === alunoId)
      .map((m) => turmas.find((t) => t.id === m.turmaId))
  }

  function adicionarTurma(novaTurma) {
    const erro = validarCargaProfessor(novaTurma, turmas)
    if (erro) {
      return erro
    }

    setTurmas([...turmas, { ...novaTurma, id: Date.now() }])
    return null
  }

  function removerTurma(turmaId) {
    setTurmas(turmas.filter((t) => t.id !== turmaId))
    setMatriculas(matriculas.filter((m) => m.turmaId !== turmaId))
  }

  function matricular(alunoId, turmaId) {
    const aluno = alunos.find((a) => a.id === alunoId)
    const turma = turmas.find((t) => t.id === turmaId)

    const erro = validarMatricula(aluno, turma, turmasDoAluno(alunoId), disciplinas, matriculas)
    if (erro) {
      return erro
    }

    setMatriculas([...matriculas, { id: Date.now(), alunoId, turmaId }])
    return null
  }

  function cancelarMatricula(alunoId, turmaId) {
    setMatriculas(matriculas.filter((m) => !(m.alunoId === alunoId && m.turmaId === turmaId)))
  }

  const valor = {
    disciplinas,
    professores,
    turmas,
    autenticar,
    buscarDisciplina,
    buscarProfessor,
    contarVagasLivres,
    turmasDoAluno,
    adicionarTurma,
    removerTurma,
    matricular,
    cancelarMatricula,
  }

  return <DadosContext.Provider value={valor}>{children}</DadosContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDados() {
  return useContext(DadosContext)
}
