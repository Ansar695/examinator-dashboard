"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export interface PaperTemplate {
  id: string
  name: string
  styles: {
    headerStyle: string
    questionStyle: string
    spacingStyle: string
    fontFamily: string
    backgroundColor: string
    textColor: string
  }
  preview?: {
    accent: string
    surface: string
  }
}

export const paperTemplates: PaperTemplate[] = [
  {
    id: 'punjab-board-standard',
    name: 'Punjab Board Standard',
    styles: {
      headerStyle: 'text-center border-b pb-4 mb-6',
      questionStyle: 'numbered-questions',
      spacingStyle: 'standard-spacing',
      fontFamily: 'Georgia, serif',
      backgroundColor: 'white',
      textColor: 'black'
    },
    preview: { accent: '#0f172a', surface: '#f8fafc' }
  },
  {
    id: 'punjab-board-modern',
    name: 'Punjab Board Modern',
    styles: {
      headerStyle: 'text-center border-b-2 pb-6 mb-8',
      questionStyle: 'boxed-questions',
      spacingStyle: 'increased-spacing',
      fontFamily: 'Trebuchet MS, sans-serif',
      backgroundColor: '#f8f8f8',
      textColor: '#333333'
    },
    preview: { accent: '#2563eb', surface: '#eef2ff' }
  },
  {
    id: 'punjab-board-compact',
    name: 'Punjab Board Compact',
    styles: {
      headerStyle: 'text-center border-b pb-2 mb-4',
      questionStyle: 'compact-questions',
      spacingStyle: 'reduced-spacing',
      fontFamily: 'Verdana, sans-serif',
      backgroundColor: 'white',
      textColor: '#1a1a1a'
    },
    preview: { accent: '#0f766e', surface: '#ecfeff' }
  },
  {
    id: 'federal-board-classic',
    name: 'Federal Board Classic',
    styles: {
      headerStyle: 'text-center border-b pb-5 mb-6',
      questionStyle: 'numbered-questions',
      spacingStyle: 'standard-spacing',
      fontFamily: 'Palatino, serif',
      backgroundColor: '#ffffff',
      textColor: '#111827'
    },
    preview: { accent: '#7c3aed', surface: '#f5f3ff' }
  },
  {
    id: 'academy-clean',
    name: 'Academy Clean',
    styles: {
      headerStyle: 'text-left border-b pb-4 mb-6',
      questionStyle: 'boxed-questions',
      spacingStyle: 'standard-spacing',
      fontFamily: 'Garamond, serif',
      backgroundColor: '#ffffff',
      textColor: '#0f172a'
    },
    preview: { accent: '#f97316', surface: '#fff7ed' }
  },
  {
    id: 'college-elegant',
    name: 'College Elegant',
    styles: {
      headerStyle: 'text-center border-b-2 pb-5 mb-7',
      questionStyle: 'numbered-questions',
      spacingStyle: 'increased-spacing',
      fontFamily: 'Times New Roman, serif',
      backgroundColor: '#f9fafb',
      textColor: '#111827'
    },
    preview: { accent: '#16a34a', surface: '#f0fdf4' }
  }
]

interface PaperTemplateSelectorProps {
  onSelect: (template: PaperTemplate) => void
  selectedTemplateId: string
}

export function PaperTemplateSelector({ onSelect, selectedTemplateId }: PaperTemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <Label>Paper Format:</Label>
      <RadioGroup
        value={selectedTemplateId}
        onValueChange={(value) => onSelect(paperTemplates.find(t => t.id === value)!)}
        className="flex flex-col space-y-2"
      >
        {paperTemplates.map((template) => (
          <div key={template.id} className="flex items-center space-x-2">
            <RadioGroupItem value={template.id} id={template.id} />
            <Label htmlFor={template.id}>{template.name}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
