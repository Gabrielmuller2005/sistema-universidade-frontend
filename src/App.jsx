import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import { useSessao } from './context/SessaoContext.jsx'
import Home from './pages/Home.jsx'
import Matricula from './pages/Matricula.jsx'
import MinhaGrade from './pages/MinhaGrade.jsx'
import Turmas from './pages/Turmas.jsx'

function App() {
  const { perfil } = useSessao()
  const voltarInicio = <Navigate to="/" />

  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/turmas" element={perfil === 'instituicao' ? <Turmas /> : voltarInicio} />
          <Route path="/matricula" element={perfil === 'aluno' ? <Matricula /> : voltarInicio} />
          <Route path="/minha-grade" element={perfil === 'aluno' ? <MinhaGrade /> : voltarInicio} />
          <Route path="*" element={voltarInicio} />
        </Routes>
      </main>
    </>
  )
}

export default App
