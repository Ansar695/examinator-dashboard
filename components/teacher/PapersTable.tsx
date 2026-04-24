"use client"

import { Download, Eye, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"

const mockPapers = [
  {
    id: 1,
    name: "Mathematics Final Exam",
    subject: "Mathematics",
    date: "2024-10-20",
    questions: 50,
    status: "Published",
  },
  {
    id: 2,
    name: "Physics Midterm",
    subject: "Physics",
    date: "2024-10-18",
    questions: 35,
    status: "Draft",
  },
  {
    id: 3,
    name: "English Literature",
    subject: "English",
    date: "2024-10-15",
    questions: 40,
    status: "Published",
  },
  {
    id: 4,
    name: "Chemistry Quiz",
    subject: "Chemistry",
    date: "2024-10-12",
    questions: 25,
    status: "Published",
  },
  {
    id: 5,
    name: "History Assessment",
    subject: "History",
    date: "2024-10-10",
    questions: 30,
    status: "Archived",
  },
]

export default function PapersTable() {
  return (
    <Card className="overflow-hidden border-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Paper Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Subject</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Questions</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockPapers.map((paper, index) => (
              <tr
                key={paper.id}
                className="border-b border-border hover:bg-muted/50 transition-colors animate-slide-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">{paper.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{paper.subject}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{paper.date}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{paper.questions}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      paper.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : paper.status === "Draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {paper.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="View">
                      <Eye size={16} className="text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Download">
                      <Download size={16} className="text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={16} className="text-destructive" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
