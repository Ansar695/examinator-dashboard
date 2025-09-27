import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";

interface SubjectDropdownMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const SubjectDropdownMenu = (props: SubjectDropdownMenuProps) => {
  const { onEdit, onDelete } = props;
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
            onClick={onEdit}
            className="cursor-pointer"
          >
            <Edit className="mr-1 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={onDelete}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DropdownMenu>
  );
};

export default SubjectDropdownMenu;
