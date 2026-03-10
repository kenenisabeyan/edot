// frontend/src/components/common/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              EDOT
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/courses" className="text-textSecondary hover:text-primary">
                Courses
              </Link>
              <Link to="/pricing" className="text-textSecondary hover:text-primary">
                Pricing
              </Link>
              <Link to="/about" className="text-textSecondary hover:text-primary">
                About
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={`/${user.role}`}
                  className="text-textSecondary hover:text-primary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-textSecondary hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                >
                  Sign Up
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