// Guarda quem está logado: o perfil ('instituicao' ou 'aluno') e o usuário.
// A sessão fica salva na aba do navegador: recarregar a página não desloga,
// mas fechar a aba sim.

import { createContext, useContext } from 'react'
import { useArmazenamento } from '../hooks/useArmazenamento.js'
import { useDados } from './DadosContext.jsx'

const SessaoContext = createContext(null)

export function SessaoProvider({ children }) {
  const { autenticar, buscarUsuario } = useDados()
  const [sessao, setSessao] = useArmazenamento('su:sessao', null, window.sessionStorage)

  const usuario = sessao ? buscarUsuario(sessao.perfil, sessao.usuarioId) : null
  const perfil = usuario ? sessao.perfil : null
  const alunoLogado = perfil === 'aluno' ? usuario : null

  // Devolve a mensagem de erro ou null se o login deu certo.
  function entrar(perfilEscolhido, login, senha) {
    const encontrado = autenticar(perfilEscolhido, login, senha)

    if (!encontrado) {
      return 'Login ou senha inválidos.'
    }

    setSessao({ perfil: perfilEscolhido, usuarioId: encontrado.id })
    return null
  }

  function sair() {
    setSessao(null)
  }

  const valor = { perfil, usuario, alunoLogado, entrar, sair }

  return <SessaoContext.Provider value={valor}>{children}</SessaoContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSessao() {
  return useContext(SessaoContext)
}