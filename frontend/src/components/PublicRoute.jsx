import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Redirect authenticated users away from public routes (signin, signup)
const PublicRoute = ({ children }) => {
  const { userData } = useSelector((state) => state.user);

  // If user is already logged in, redirect to home
  if (userData) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;

