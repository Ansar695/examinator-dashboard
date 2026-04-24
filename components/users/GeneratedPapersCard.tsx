import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, Download, Eye, FileText } from "lucide-react";
import { formatDateTime } from "@/utils/transformers/dateYearFormatter";
import { Button } from "../ui/button";
import CustomPagination from "../common/Pagination";

const GeneratedPapersCard = ({
  generatedPapers,
  meta,
  page,
  setPage,
  loading,
}: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Papers</CardTitle>
        <CardDescription>
          All papers created by this user ({generatedPapers.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {generatedPapers?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-sm text-gray-500">
                  <th className="text-left py-3 px-4 font-medium">Title</th>
                  <th className="text-left py-3 px-4 font-medium">Subject</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Board & Class
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    Total Marks
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    Exam Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    Created At
                  </th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {generatedPapers?.map((paper: any, index: number) => (
                  <tr
                    key={paper?.id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-4 font-medium capitalize">
                      {paper?.title}
                    </td>
                    <td className="py-3 px-4">{paper?.subject?.name}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="font-medium capitalize">
                          {paper?.board?.name}
                        </div>
                        <div className="text-gray-500 capitalize">
                          {paper?.subject?.class?.name ?? ""}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="outline">{paper?.totalMarks}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">{paper?.examTime}h</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDateTime(paper?.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No papers generated yet</p>
            <p className="text-sm mt-1">Papers will appear here once created</p>
          </div>
        )}

        {/* Pagination */}
        {meta?.totalPages > 1 && (
          <CustomPagination
            totalPages={meta?.totalPages}
            currentUsers={generatedPapers?.length}
            currentPage={page}
            limit={meta?.limit}
            total={meta?.total}
            onPageChange={(p: number) => setPage(p)}
            isLoading={loading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default GeneratedPapersCard;
