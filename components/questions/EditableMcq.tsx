'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Pencil } from 'lucide-react'

interface EditableMCQOptionProps {
  initialText: string
  onSave: (newText: string) => void
}

export function EditableMcq({ initialText, onSave }: EditableMCQOptionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(initialText)

  const handleSave = () => {
    onSave(text)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSave}
        onKeyPress={(e) => e.key === 'Enter' && handleSave()}
        autoFocus
        className="w-full"
      />
    )
  }

  return (
    <div className="flex items-center space-x-2 group">
      <span className="flex-grow">{text}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Pencil className="h-4 w-4 text-gray-400 hover:text-gray-600" />
      </button>
    </div>
  )
}

