
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CarForm from './pages/CarForm';
import CarDetail from './pages/CarDetail';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cars/new" element={<CarForm />} />
            <Route path="/cars/edit/:id" element={<CarForm />} />
            <Route path="/cars/:id" element={<CarDetail />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;