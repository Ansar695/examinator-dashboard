import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatDate } from "@/utils/transformers/dateYearFormatter";
import { AlertCircle, Badge } from "lucide-react";

const CurrentSubsCard = ({ subscriptionData }: any) => {
  const usagePercentage = subscriptionData
    ? (subscriptionData.papersGenerated / subscriptionData.monthlyLimit) * 100
    : 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Subscription</CardTitle>
        <CardDescription>Active plan details and usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscriptionData ? (
          <>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <div>
                <h3 className="text-2xl font-bold">
                  {subscriptionData.planType}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  PKR {subscriptionData.pricePerMonth.toLocaleString()}
                  /month
                </p>
              </div>
              <Badge
                className={
                  subscriptionData.isActive ? "bg-green-500" : "bg-red-500"
                }
              >
                {subscriptionData.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Papers Generated</span>
                <span className="text-sm font-semibold">
                  {subscriptionData.papersGenerated} /{" "}
                  {subscriptionData.monthlyLimit}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    usagePercentage >= 90
                      ? "bg-red-500"
                      : usagePercentage >= 70
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(usagePercentage, 100)}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-600">Renewal Date</span>
                <span className="text-sm font-semibold">
                  {formatDate(subscriptionData.renewalDate)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-semibold">
                  {formatDate(subscriptionData.createdAt)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Papers Remaining</span>
                <span className="text-sm font-semibold text-green-600">
                  {subscriptionData.monthlyLimit -
                    subscriptionData.papersGenerated}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No active subscription</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentSubsCard;
