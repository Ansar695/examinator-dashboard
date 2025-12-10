import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import FilterButtons from "./FilterButton";
import { createLabelFormatter } from "./createLabelFormFilter";

const ChartsData = ({
  dataFilter,
  setDataFilter,
  chartsData,
  serviceData,
}: any) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Hospital Registration Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            Users Registrations
          </h2>
          <FilterButtons
            selected={dataFilter}
            onChange={setDataFilter}
          />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={
              Array.isArray(chartsData)
                ? chartsData
                : chartsData?.[dataFilter] || []
            }
            margin={{ right: 24 }}
          >
            <defs>
              <linearGradient id="colorHospitals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--sidebar-primary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--sidebar-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              interval={0}
              tick={{ fontSize: 12 }}
              padding={{ right: 16 }}
              tickFormatter={createLabelFormatter(dataFilter)}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="userRegistered"
              stroke="var(--sidebar-primary)"
              fillOpacity={1}
              fill="url(#colorHospitals)"
            />
          </AreaChart>
        </ResponsiveContainer>

      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="w-full lg:w-1/2">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Users Distribution
          </h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={false}
                >
                  {serviceData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${entry.name}-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="space-y-3">
              {serviceData.map((service: any, index: number) => {
                // const total = serviceData.reduce((sum, item) => sum + item.value, 0);
                // const percentage = ((service.value / total) * 100).toFixed(1);
                return (
                  <div
                    key={`legend-${index}`}
                    className="flex items-center justify-between rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: service.color }}
                      />
                      <span
                        className="text-sm font-medium text-gray-700 truncate"
                        style={{ maxWidth: "150px" }}
                        title={service.name}
                      >
                        {service.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {service.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsData;
