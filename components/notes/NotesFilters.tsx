"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { userTypeOptions } from "@/utils/static/userTypes"

interface NotesFilterProps {
  classes: Array<{ id: string; name: string }>
  onFilterChange: (filters: {
    search: string
    classId: string
    userType: string
  }) => void
  isLoading?: boolean
}

export function NotesFilter({ classes, onFilterChange, isLoading = false }: NotesFilterProps) {
  const [search, setSearch] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedUserType, setSelectedUserType] = useState("all")

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFilterChange({ search: value, classId: selectedClass, userType: selectedUserType })
  }

  const handleClassChange = (value: string) => {
    setSelectedClass(value)
    onFilterChange({ search, classId: value, userType: 'all' })
  }

  const handleUserTypeChange = (value: string) => {
    setSelectedUserType(value)
    onFilterChange({ search, classId: 'all', userType: value })
  }

  const handleReset = () => {
    setSearch("")
    setSelectedClass("all")
    setSelectedUserType("all")
    onFilterChange({ search: "", classId: "all", userType: 'all' })
  }

  const hasActiveFilters = search || selectedClass !== "all"

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10 backdrop-blur-sm">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          disabled={isLoading}
          className="pl-10 bg-background/60 border-primary/20 focus:border-primary/50"
        />
      </div>

      {/* Class Filter */}
      <Select value={selectedClass} onValueChange={handleClassChange} disabled={isLoading}>
        <SelectTrigger className="w-full sm:w-56 bg-background/60 border-primary/20 focus:border-primary/50">
          <SelectValue placeholder="Filter by class..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Classes</SelectItem>
          {classes.map((cls) => (
            <SelectItem key={cls.id} value={cls.id}>
              Class {cls.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* User Type Filter */}
      <Select value={selectedUserType} onValueChange={handleUserTypeChange} disabled={isLoading}>
        <SelectTrigger className="w-full sm:w-56 bg-background/60 border-primary/20 focus:border-primary/50">
          <SelectValue placeholder="Filter by class..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All User Types</SelectItem>
          {userTypeOptions?.map((ut) => (
            <SelectItem key={ut.value} value={ut.value}>
              {ut.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={isLoading}
          className="gap-2 border-primary/30 hover:bg-destructive/10 hover:text-destructive bg-transparent"
        >
          <X className="w-4 h-4" />
          Reset
        </Button>
      )}
    </div>
  )
}
