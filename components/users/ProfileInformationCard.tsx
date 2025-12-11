import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { getStatusColor } from "@/utils/transformers/getConditionalColor";
import { formatDate } from "@/utils/transformers/dateYearFormatter";
import { Badge } from "lucide-react";

const ProfileInformationCard = ({ userData }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Personal details and account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p className="text-sm font-semibold mt-1">{userData?.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Username</p>
            <p className="text-sm font-semibold mt-1">@{userData?.username}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-sm font-semibold mt-1">{userData?.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-sm font-semibold mt-1">
              {userData?.phone || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Role</p>
            <p className="text-sm font-semibold mt-1 capitalize">
              {userData?.role?.toLowerCase()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Age</p>
            <p className="text-sm font-semibold mt-1">
              {userData?.age || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <Badge className={`${getStatusColor(userData?.status)} mt-1`}>
              {userData?.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Institution</p>
            <p className="text-sm font-semibold mt-1">
              {userData?.institutionName || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Approved At</p>
            <p className="text-sm font-semibold mt-1">
              {userData?.approvedAt ? formatDate(userData?.approvedAt) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Last Updated</p>
            <p className="text-sm font-semibold mt-1">
              {formatDate(userData?.updatedAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInformationCard;
