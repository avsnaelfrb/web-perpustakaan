import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardUser from './pages/DashboardUser'

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
      <Route path="/dashboardUser" element={<DashboardUser />}  />
      {/* Add other routes here */}
    </Routes>
  </Router>
  )
}

export default App
