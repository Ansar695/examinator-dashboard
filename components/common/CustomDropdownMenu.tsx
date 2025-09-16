import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, Edit, Eye, MoreVertical } from "lucide-react";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";

interface CustomDropdownMenuProps {
  chapterData: {
    pdfUrl: string;
    name: string;
  };
  handleDownload: (pdfUrl: string, chapterName: string) => void;
  setShowEditForm: (value: boolean) => void;
}

const CustomDropdownMenu = (props: CustomDropdownMenuProps) => {
  const { chapterData, handleDownload, setShowEditForm } = props;
  return (
    <DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => window.open(chapterData.pdfUrl, "_blank")}
            className="cursor-pointer"
          >
            <Eye className="mr-1 h-4 w-4" />
            View PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDownload(chapterData.pdfUrl, chapterData.name)}
            className="cursor-pointer"
          >
            <Download className="mr-1 h-4 w-4" />
            Download PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowEditForm(true)}
            className="cursor-pointer"
          >
            <Edit className="mr-1 h-4 w-4" />
            Edit Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DropdownMenu>
  );
};

export default CustomDropdownMenu;
