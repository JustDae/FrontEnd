import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react/jsx-runtime";

type Props = {
  allow: string[];
  children: JSX.Element;
};

export default function RequireRole({ allow, children }: Props): JSX.Element {
  const { user } = useAuth();

  const userRoleName = user?.rol?.nombre || "UNDEFINED";
  const role = userRoleName.toUpperCase();

  const isAllowed = allow.some((x) => x.toUpperCase() === role);

  if (!isAllowed) {
    return <Navigate to="/dashboard/forbidden" replace />;
  }

  return children;
}