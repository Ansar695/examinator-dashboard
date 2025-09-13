import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectClassProps {
  classes: any[];
  watch: (field: string) => any;
  setValue: any;
  errors: any;
}

const SelectClass = (props: SelectClassProps) => {
  const { classes, watch, setValue, errors } = props;
  return (
    <div className="space-y-2">
      <Label htmlFor="classId">Class *</Label>
      <Select
        value={watch("classId")}
        onValueChange={(value) => setValue("classId", value)}
      >
        <SelectTrigger className="w-full border border-gray-300">
          <SelectValue placeholder="Select a class" />
        </SelectTrigger>
        <SelectContent>
          {classes?.map((classItem) => (
              <SelectItem key={classItem?.id} value={classItem?.id}>
                {classItem?.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {errors.classId && (
        <p className="text-sm text-red-600">{errors.classId.message}</p>
      )}
    </div>
  );
};

export default SelectClass;
