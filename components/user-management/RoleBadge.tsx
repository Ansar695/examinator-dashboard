import { Badge } from "../ui/badge";
import { UserRole } from "./StatusBadge";

export const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const variants: Record<UserRole, string> = {
    ADMIN: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    TEACHER: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    STUDENT: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
  };

  return <Badge className={variants[role]}>{role}</Badge>;
};