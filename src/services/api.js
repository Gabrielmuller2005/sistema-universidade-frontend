// Cliente HTTP do backend Spring Boot.
// Em desenvolvimento o Vite faz proxy de /api para http://localhost:8080.
// Em produção, defina VITE_API_URL com o endereço da API.

const URL_BASE = import.meta.env.VITE_API_URL ?? ''

async function requisicao(caminho, opcoes = {}) {
  let resposta

  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, opcoes)
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está em execução.')
  }

  if (resposta.status === 204) {
    return null
  }

  const corpo = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    throw new Error(corpo?.mensagem ?? 'Não foi possível concluir a operação.')
  }

  return corpo
}

function enviarJson(caminho, metodo, dados) {
  return requisicao(caminho, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
}

export function login(perfil, loginUsuario, senha) {
  return enviarJson('/api/auth/login', 'POST', { perfil, login: loginUsuario, senha })
}

export function listarDisciplinas() {
  return requisicao('/api/disciplinas')
}

export function listarProfessores() {
  return requisicao('/api/professores')
}

export function listarTurmas() {
  return requisicao('/api/turmas')
}

export function criarTurma(dados) {
  return enviarJson('/api/turmas', 'POST', dados)
}

export function atualizarTurma(id, dados) {
  return enviarJson(`/api/turmas/${id}`, 'PUT', dados)
}

export function removerTurma(id) {
  return requisicao(`/api/turmas/${id}`, { method: 'DELETE' })
}

export function listarTurmasDoAluno(alunoId) {
  return requisicao(`/api/alunos/${alunoId}/turmas`)
}

export function verificarMatricula(alunoId, turmaId) {
  return requisicao(`/api/matriculas/verificar?alunoId=${alunoId}&turmaId=${turmaId}`)
}

export function matricular(alunoId, turmaId) {
  return enviarJson('/api/matriculas', 'POST', { alunoId, turmaId })
}

export function cancelarMatricula(alunoId, turmaId) {
  return requisicao(`/api/matriculas?alunoId=${alunoId}&turmaId=${turmaId}`, { method: 'DELETE' })
}

export function restaurarDadosIniciais() {
  return requisicao('/api/dados-iniciais/restaurar', { method: 'POST' })
}
