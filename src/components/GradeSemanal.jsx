import { DIAS, TURNOS } from '../utils/horario.js'

// turmas: lista com { id, horario, disciplina, professor }
function GradeSemanal({ turmas, onCancelar }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered grade">
        <thead>
          <tr>
            <th>Turno</th>
            {DIAS.map((dia) => (
              <th key={dia.codigo}>{dia.nome}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TURNOS.map((turno) => (
            <tr key={turno.codigo}>
              <th>{turno.nome}</th>
              {DIAS.map((dia) => {
                const turma = turmas.find((t) => t.horario === dia.codigo + turno.codigo)

                return (
                  <td key={dia.codigo} className={turma ? 'ocupado' : ''}>
                    {turma && (
                      <>
                        <div className="fw-semibold">{turma.disciplina}</div>
                        <div className="small text-secondary">{turma.professor}</div>
                        <button
                          className="btn btn-link btn-sm p-0 text-danger"
                          onClick={() => onCancelar(turma.id)}
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GradeSemanal
