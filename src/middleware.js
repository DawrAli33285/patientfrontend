import { Navigate } from 'react-router-dom';

const Middleware = ({ children }) => {
  const isLoggedIn = localStorage.getItem('user');
  return isLoggedIn ? children : <Navigate to="/" />;
};

export default Middleware;
