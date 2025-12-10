import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { getStatusColor } from "@/utils/transformers/getConditionalColor";
import { Award, Calendar, Mail, Phone, User } from "lucide-react";
import { formatDate } from "@/utils/transformers/dateYearFormatter";

const UserDetailHeader = ({ userData }: any) => {

    const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={userData.profilePicture || undefined} />
          <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            {getInitials(userData.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {userData.name}
            </h1>
            <Badge className={getStatusColor(userData.status)}>
              {userData.status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {userData.role.toLowerCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{userData.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span className="text-sm">@{userData.username}</span>
            </div>
            {userData.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{userData.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                Joined {formatDate(userData.createdAt)}
              </span>
            </div>
            {userData.institutionName && (
              <div className="flex items-center gap-2 text-gray-600">
                <Award className="h-4 w-4" />
                <span className="text-sm">{userData.institutionName}</span>
              </div>
            )}
            {userData.age && (
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" />
                <span className="text-sm">Age: {userData.age}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailHeader;
