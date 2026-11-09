import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSessao } from '../context/SessaoContext.jsx'

const paginaInicial = {
  instituicao: '/turmas',
  aluno: '/matricula',
}

function Home() {
  const sessao = useSessao()
  const [perfil, setPerfil] = useState('aluno')
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)

  if (sessao.perfil) {
    return <Navigate to={paginaInicial[sessao.perfil]} />
  }

  function escolherPerfil(novoPerfil) {
    setPerfil(novoPerfil)
    setLogin('')
    setSenha('')
    setErro(null)
  }

  function enviar(evento) {
    evento.preventDefault()
    setErro(sessao.entrar(perfil, login, senha))
  }

  return (
    <div className="mx-auto py-5" style={{ maxWidth: 400 }}>
      <h1 className="h3">Sistema de Matrículas</h1>
      <p className="text-secondary mb-4">Entre com seus dados de acesso.</p>

      <div className="btn-group w-100 mb-4">
        <button
          type="button"
          className={`btn ${perfil === 'aluno' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => escolherPerfil('aluno')}
        >
          Aluno
        </button>
        <button
          type="button"
          className={`btn ${perfil === 'instituicao' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => escolherPerfil('instituicao')}
        >
          Instituição
        </button>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <form onSubmit={enviar}>
        <div className="mb-3">
          <label className="form-label" htmlFor="login">
            {perfil === 'aluno' ? 'Matrícula' : 'Usuário'}
          </label>
          <input
            id="login"
            className="form-control"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label" htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            className="form-control"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Entrar</button>
      </form>
    </div>
  )
}

export default Home
