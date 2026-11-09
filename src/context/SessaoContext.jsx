// Guarda quem está logado: o perfil ('instituicao' ou 'aluno') e o usuário.

import { createContext, useContext, useState } from 'react'
import { useDados } from './DadosContext.jsx'

const SessaoContext = createContext(null)

export function SessaoProvider({ children }) {
  const { autenticar } = useDados()
  const [perfil, setPerfil] = useState(null)
  const [usuario, setUsuario] = useState(null)

  const alunoLogado = perfil === 'aluno' ? usuario : null

  // Devolve a mensagem de erro ou null se o login deu certo.
  function entrar(perfilEscolhido, login, senha) {
    const encontrado = autenticar(perfilEscolhido, login, senha)

    if (!encontrado) {
      return 'Login ou senha inválidos.'
    }

    setPerfil(perfilEscolhido)
    setUsuario(encontrado)
    return null
  }

  function sair() {
    setPerfil(null)
    setUsuario(null)
  }

  const valor = { perfil, usuario, alunoLogado, entrar, sair }

  return <SessaoContext.Provider value={valor}>{children}</SessaoContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSessao() {
  return useContext(SessaoContext)
}
