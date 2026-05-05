import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Navbar from './components/Navbar'

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<PrivateRoute><Navbar /><Dashboard /></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><Navbar /><Projects /></PrivateRoute>} />
        <Route path="/projects/:id/tasks" element={<PrivateRoute><Navbar /><Tasks /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}