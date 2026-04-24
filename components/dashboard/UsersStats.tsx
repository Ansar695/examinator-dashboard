import { Icon } from "lucide-react";
import React from "react";

const UsersStats = ({ stats }: any) => {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Total Users
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stats?.users}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Total Students
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stats?.students}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Total Teachers
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stats?.teachers}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Total Revenue
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stats?.totalRevenue}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Total MCQs
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stats?.mcqs}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Total Shorts Questions
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stats?.shorts}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Total Long Questions
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stats?.longs}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Total Generated Papers
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stats?.totalGeneratedPapers}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersStats;
