import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default AuthRoute;