import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserProvider";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useUser();
    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
