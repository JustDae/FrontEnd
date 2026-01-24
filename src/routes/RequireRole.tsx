import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react/jsx-runtime";

type Props = {
  allow: string[];
  children: JSX.Element;
};

export default function RequireRole({ allow, children }: Props): JSX.Element {
  const { user } = useAuth();
  const role = (user?.role || "USER").toUpperCase();

  const ok = allow.map((x) => x.toUpperCase()).includes(role);
  if (!ok) return <Navigate to="/dashboard/forbidden" replace />;

  return children;
}