import { useEffect } from 'react'

// Janela de confirmação feita só com classes do Bootstrap (sem o JS dele).
function ConfirmModal({ titulo, texto, textoConfirmar = 'Confirmar', onConfirmar, onCancelar }) {
  useEffect(() => {
    function aoPressionarTecla(evento) {
      if (evento.key === 'Escape') {
        onCancelar()
      }
    }
    document.addEventListener('keydown', aoPressionarTecla)
    return () => document.removeEventListener('keydown', aoPressionarTecla)
  }, [onCancelar])

  function aoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget) {
      onCancelar()
    }
  }

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" onClick={aoClicarNoFundo}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5">{titulo}</h2>
            </div>
            <div className="modal-body">
              <p className="mb-0">{texto}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirmar}>
                {textoConfirmar}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  )
}

export default ConfirmModal