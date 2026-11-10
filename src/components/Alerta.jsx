import { useEffect, useRef } from 'react'

// Mensagem { tipo, texto } que some sozinha depois de alguns segundos.
function Alerta({ mensagem, onFechar, duracao = 5000 }) {
  const fecharRef = useRef(onFechar)

  useEffect(() => {
    fecharRef.current = onFechar
  })

  useEffect(() => {
    if (!mensagem) {
      return undefined
    }
    const temporizador = setTimeout(() => fecharRef.current(), duracao)
    return () => clearTimeout(temporizador)
  }, [mensagem, duracao])

  if (!mensagem) {
    return null
  }

  return (
    <div className={`alert alert-${mensagem.tipo} alert-dismissible`} role="alert">
      {mensagem.texto}
      <button type="button" className="btn-close" aria-label="Fechar" onClick={onFechar}></button>
    </div>
  )
}

export default Alerta