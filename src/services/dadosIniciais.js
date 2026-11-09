// Dados de exemplo. Futuramente serão substituídos pela API.

export const disciplinasIniciais = [
  { id: 1, nome: 'Algoritmos', preRequisitoId: null },
  { id: 2, nome: 'Estruturas de Dados', preRequisitoId: 1 },
  { id: 3, nome: 'Programação Front-end', preRequisitoId: null },
  { id: 4, nome: 'Banco de Dados', preRequisitoId: 2 },
]

export const professoresIniciais = [
  { id: 1, nome: 'Ana Ribeiro' },
  { id: 2, nome: 'Bruno Carvalho' },
  { id: 3, nome: 'Carla Mendes' },
]

// Senhas em texto apenas nos dados de exemplo. Na API elas serão criptografadas.
export const alunosIniciais = [
  { id: 1, nome: 'Maria Souza', matricula: '2026001', senha: '1234', disciplinasAprovadas: [1] },
  { id: 2, nome: 'João Lima', matricula: '2026002', senha: '1234', disciplinasAprovadas: [] },
]

export const usuariosInstituicaoIniciais = [
  { id: 1, nome: 'Secretaria', usuario: 'secretaria', senha: 'admin' },
]

export const turmasIniciais = [
  { id: 1, disciplinaId: 1, professorId: 1, horario: '21', vagas: 1 },
  { id: 2, disciplinaId: 2, professorId: 2, horario: '33', vagas: 25 },
  { id: 3, disciplinaId: 3, professorId: 3, horario: '33', vagas: 20 },
  { id: 4, disciplinaId: 4, professorId: 1, horario: '52', vagas: 30 },
]

export const matriculasIniciais = [
  { id: 1, alunoId: 2, turmaId: 1 },
]
