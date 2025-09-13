import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectSubjectProps {
  subjects: any[];
  watch: (field: string) => any;
  setValue: any;
  errors: any;
  selectedClassId: string | null;
}

const SelectSubject = (props: SelectSubjectProps) => {
  const { subjects, watch, setValue, errors, selectedClassId } = props;
  return (
    <div className="space-y-2 ">
      <Label htmlFor="subjectId">Subject *</Label>
      <Select
        value={watch("subjectId")}
        onValueChange={(value) => setValue("subjectId", value)}
        disabled={!selectedClassId}
      >
        <SelectTrigger className="w-full border border-gray-300">
          <SelectValue
            placeholder={
              selectedClassId ? "Select a subject" : "Select a class first"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((subject) => (
            <SelectItem key={subject.id} value={subject.id}>
              {subject.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.subjectId && (
        <p className="text-sm text-red-600">{errors.subjectId.message}</p>
      )}
    </div>
  );
};

export default SelectSubject;
