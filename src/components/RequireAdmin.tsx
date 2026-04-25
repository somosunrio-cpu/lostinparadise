import { Navigate } from "react-router-dom";
import { ADMIN_SESSION_KEY } from "@/lib/routes-data";

/**
 * Route guard for the admin panel.
 * Requires that the admin code was successfully entered on the home page
 * during the current browser tab session. Direct navigation to /admin
 * without a valid session redirects to home.
 */
const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const hasSession = sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
  if (!hasSession) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default RequireAdmin;
