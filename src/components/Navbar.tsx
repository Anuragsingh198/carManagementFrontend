import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  
  useEffect(()=>{
      console.log("uere is logged out");
  },[logout])

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              MERN App
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;