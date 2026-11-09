import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSessao } from '../context/SessaoContext.jsx'

function Navbar() {
  const { perfil, usuario, sair } = useSessao()
  const navigate = useNavigate()

  function sairDoSistema() {
    sair()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand navbar-dark navbar-sistema">
      <div className="container flex-wrap">
        <Link className="navbar-brand" to="/">
          Matrículas
        </Link>

        <ul className="navbar-nav me-auto">
          {perfil === 'instituicao' && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/turmas">Turmas</NavLink>
            </li>
          )}
          {perfil === 'aluno' && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/matricula">Matrícula</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/minha-grade">Minha grade</NavLink>
              </li>
            </>
          )}
        </ul>

        {perfil && (
          <div className="d-flex align-items-center gap-3 text-white">
            <span className="small">{usuario.nome}</span>
            <button className="btn btn-sm btn-outline-light" onClick={sairDoSistema}>
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
