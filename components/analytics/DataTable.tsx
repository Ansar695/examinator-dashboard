export const DataTable = ({ headers, data }: any) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b">
          {headers.map((header: any, idx: number) => (
            <th key={idx} className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, idx: number) => (
          <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
            {row.map((cell: any, cellIdx: number) => (
              <td key={cellIdx} className="py-3 px-4 text-sm text-gray-600">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);