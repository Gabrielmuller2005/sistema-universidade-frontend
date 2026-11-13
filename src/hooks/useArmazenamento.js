// Funciona como useState, mas guarda o valor no navegador (localStorage por padrão).
// Assim os dados continuam existindo depois de recarregar a página.
// Quando o back-end existir, este hook deixa de ser usado nos dados.

import { useEffect, useState } from 'react'

export function useArmazenamento(chave, valorInicial, armazenamento = window.localStorage) {
  const [valor, setValor] = useState(() => {
    try {
      const salvo = armazenamento.getItem(chave)
      return salvo !== null ? JSON.parse(salvo) : valorInicial
    } catch {
      return valorInicial
    }
  })

  useEffect(() => {
    try {
      armazenamento.setItem(chave, JSON.stringify(valor))
    } catch {
      // Sem espaço ou armazenamento bloqueado: o sistema segue funcionando sem salvar.
    }
  }, [chave, valor, armazenamento])

  return [valor, setValor]
}