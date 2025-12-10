import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Clock, CreditCard, FileText } from "lucide-react";
import { formatDate } from "@/utils/transformers/dateYearFormatter";
import { getPlanColor } from "@/utils/transformers/getConditionalColor";

const UserDetailStatCard = ({ subscriptionData, generatedPapers }: any) => {
  const usagePercentage = subscriptionData
    ? (subscriptionData.papersGenerated / subscriptionData.monthlyLimit) * 100
    : 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {subscriptionData?.planType || "FREE"}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                PKR {subscriptionData?.pricePerMonth || 0}/month
              </p>
            </div>
            <div
              className={`h-12 w-12 rounded-full ${getPlanColor(
                subscriptionData?.planType || "FREE"
              )} flex items-center justify-center`}
            >
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Papers Generated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {subscriptionData?.papersGenerated || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                of {subscriptionData?.monthlyLimit || 0} this month
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {usagePercentage.toFixed(0)}% used
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Papers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{generatedPapers.length}</div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Next Renewal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">
                {subscriptionData
                  ? formatDate(subscriptionData.renewalDate)
                  : "N/A"}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {subscriptionData?.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailStatCard;
