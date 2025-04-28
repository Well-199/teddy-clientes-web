import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from '../pages/Login'
import Home from '../pages/Home'

interface PrivateRouteProps { children: React.JSX.Element }

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('@token')

  if (!token) return <Navigate to="/" replace />

  return children
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<PrivateRoute><Home /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
