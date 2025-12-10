import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatDate } from "@/utils/transformers/dateYearFormatter";
import { AlertCircle, Badge, CreditCard } from "lucide-react";
import {
  getPlanColor,
  getPlanStatusColor,
} from "@/utils/transformers/getConditionalColor";

const SubscriptionHistoryCard = ({ subscriptionHistory }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription History</CardTitle>
        <CardDescription>
          Complete billing and usage history ({subscriptionHistory.length}{" "}
          cycles)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscriptionHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-sm text-gray-500">
                  <th className="text-left py-3 px-4 font-medium">Period</th>
                  <th className="text-left py-3 px-4 font-medium">Plan</th>
                  <th className="text-center py-3 px-4 font-medium">Price</th>
                  <th className="text-center py-3 px-4 font-medium">
                    Papers Used
                  </th>
                  <th className="text-center py-3 px-4 font-medium">Limit</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Cycle Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptionHistory.map((history: any, index: number) => (
                  <tr
                    key={history.id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-4 font-medium">
                      {new Date(0, history.month - 1).toLocaleString(
                        "default",
                        { month: "long" }
                      )}{" "}
                      {history.year}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getPlanColor(history.planType)}>
                        {history.planType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      PKR {history.pricePerMonth.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold">
                        {history.papersGenerated}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {history.monthlyLimit}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getPlanStatusColor(history.planStatus)}>
                        {history.planStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <div>{formatDate(history.cycleStart)}</div>
                      <div className="text-xs text-gray-400">
                        to{" "}
                        {history.cycleEnd
                          ? formatDate(history.cycleEnd)
                          : "Present"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <CreditCard className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No subscription history</p>
            <p className="text-sm mt-1">
              History will appear once subscriptions are created
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionHistoryCard;
