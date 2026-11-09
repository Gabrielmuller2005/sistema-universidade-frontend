// Código de horário com 2 dígitos: 1º = dia da semana, 2º = turno.
// Exemplo: "21" = Segunda - Manhã, "33" = Terça - Noite.

export const DIAS = [
  { codigo: '2', nome: 'Segunda' },
  { codigo: '3', nome: 'Terça' },
  { codigo: '4', nome: 'Quarta' },
  { codigo: '5', nome: 'Quinta' },
  { codigo: '6', nome: 'Sexta' },
  { codigo: '7', nome: 'Sábado' },
]

export const TURNOS = [
  { codigo: '1', nome: 'Manhã' },
  { codigo: '2', nome: 'Tarde' },
  { codigo: '3', nome: 'Noite' },
]

export function textoHorario(codigo) {
  const dia = DIAS.find((d) => d.codigo === codigo[0])
  const turno = TURNOS.find((t) => t.codigo === codigo[1])

  if (!dia || !turno) {
    return 'Horário inválido'
  }

  return `${dia.nome} - ${turno.nome}`
}
