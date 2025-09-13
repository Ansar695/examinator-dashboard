import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectBoardProps {
  allBoards: any[];
  watch: (field: string) => any;
  setValue: any;
  errors: any;
}

const SelectBoard = (props: SelectBoardProps) => {
  const { allBoards, watch, setValue, errors } = props;
  return (
    <div className="space-y-2">
      <Label htmlFor="boardId">Board *</Label>
      <Select
        value={watch("boardId")}
        onValueChange={(value) => setValue("boardId", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a board" />
        </SelectTrigger>
        <SelectContent>
          {allBoards.length > 0 &&
            allBoards?.map((board: any) => (
              <SelectItem key={board?.id} value={board?.id}>
                {board?.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {errors.boardId && (
        <p className="text-sm text-red-600">{errors.boardId.message}</p>
      )}
    </div>
  );
};

export default SelectBoard;
