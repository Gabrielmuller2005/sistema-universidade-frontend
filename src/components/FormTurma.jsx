import { useState } from 'react'
import { DIAS, TURNOS } from '../utils/horario.js'

const formularioVazio = {
  disciplinaId: '',
  professorId: '',
  dia: '',
  turno: '',
  vagas: '',
}

function formularioDaTurma(turma) {
  if (!turma) {
    return formularioVazio
  }

  return {
    disciplinaId: String(turma.disciplinaId),
    professorId: String(turma.professorId),
    dia: turma.horario[0],
    turno: turma.horario[1],
    vagas: String(turma.vagas),
  }
}

// Sem "turma": cadastra uma nova. Com "turma": edita a turma recebida.
// Quem usa o componente deve passar uma "key" diferente para cada turma editada.
function FormTurma({ disciplinas, professores, turma = null, onSalvar, onCancelar }) {
  const [formulario, setFormulario] = useState(() => formularioDaTurma(turma))
  const [salvando, setSalvando] = useState(false)
  const editando = turma !== null

  function alterarCampo(evento) {
    const { name, value } = evento.target
    setFormulario({ ...formulario, [name]: value })
  }

  async function enviar(evento) {
    evento.preventDefault()
    setSalvando(true)

    const erro = await onSalvar({
      disciplinaId: Number(formulario.disciplinaId),
      professorId: Number(formulario.professorId),
      horario: formulario.dia + formulario.turno,
      vagas: Number(formulario.vagas),
    })

    setSalvando(false)

    if (!erro && !editando) {
      setFormulario(formularioVazio)
    }
  }

  return (
    <form onSubmit={enviar}>
      <div className="mb-3">
        <label className="form-label" htmlFor="disciplinaId">Disciplina</label>
        <select
          id="disciplinaId"
          name="disciplinaId"
          className="form-select"
          value={formulario.disciplinaId}
          onChange={alterarCampo}
          required
        >
          <option value="">Selecione</option>
          {disciplinas.map((disciplina) => (
            <option key={disciplina.id} value={disciplina.id}>{disciplina.nome}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="professorId">Professor</label>
        <select
          id="professorId"
          name="professorId"
          className="form-select"
          value={formulario.professorId}
          onChange={alterarCampo}
          required
        >
          <option value="">Selecione</option>
          {professores.map((professor) => (
            <option key={professor.id} value={professor.id}>{professor.nome}</option>
          ))}
        </select>
      </div>

      <div className="row">
        <div className="col mb-3">
          <label className="form-label" htmlFor="dia">Dia</label>
          <select
            id="dia"
            name="dia"
            className="form-select"
            value={formulario.dia}
            onChange={alterarCampo}
            required
          >
            <option value="">Selecione</option>
            {DIAS.map((dia) => (
              <option key={dia.codigo} value={dia.codigo}>{dia.nome}</option>
            ))}
          </select>
        </div>

        <div className="col mb-3">
          <label className="form-label" htmlFor="turno">Turno</label>
          <select
            id="turno"
            name="turno"
            className="form-select"
            value={formulario.turno}
            onChange={alterarCampo}
            required
          >
            <option value="">Selecione</option>
            {TURNOS.map((turno) => (
              <option key={turno.codigo} value={turno.codigo}>{turno.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="vagas">Vagas</label>
        <input
          id="vagas"
          name="vagas"
          type="number"
          min="1"
          className="form-control"
          value={formulario.vagas}
          onChange={alterarCampo}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={salvando}>
        {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar turma'}
      </button>
      {editando && (
        <button type="button" className="btn btn-outline-secondary ms-2" onClick={onCancelar}>
          Cancelar
        </button>
      )}
    </form>
  )
}

export default FormTurma