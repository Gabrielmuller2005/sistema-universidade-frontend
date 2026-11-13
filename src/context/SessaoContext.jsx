// Guarda quem está logado: o perfil ('instituicao' ou 'aluno') e o usuário.
// A sessão fica salva na aba do navegador: recarregar a página não desloga,
// mas fechar a aba sim.

import { createContext, useContext } from 'react'
import { useArmazenamento } from '../hooks/useArmazenamento.js'
import { login } from '../services/api.js'

const SessaoContext = createContext(null)

export function SessaoProvider({ children }) {
  const [sessao, setSessao] = useArmazenamento('su:sessao', null, window.sessionStorage)

  const usuario = sessao
  const perfil = sessao?.perfil ?? null
  const alunoLogado = perfil === 'aluno' ? usuario : null

  // Devolve a mensagem de erro ou null se o login deu certo.
  async function entrar(perfilEscolhido, loginUsuario, senha) {
    try {
      const encontrado = await login(perfilEscolhido, loginUsuario, senha)
      setSessao(encontrado)
      return null
    } catch (erro) {
      return erro.message
    }
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
