import { useUser } from "@/recoil/useUser";
import { Navigate } from "react-router-dom";

export const AdminProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const {getUserAtom} = useUser();
    const user = getUserAtom();
    if (!user?.isAdmin) {
        return <Navigate to="/" />;
    }
    return (
        <div>
            {children}
        </div>
    )
}
