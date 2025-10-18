"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PaperTemplate {
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
}

const paperTemplates: PaperTemplate[] = [
  {
    id: 'punjab-board-standard',
    name: 'Punjab Board Standard',
    styles: {
      headerStyle: 'text-center border-b pb-4 mb-6',
      questionStyle: 'numbered-questions',
      spacingStyle: 'standard-spacing',
      fontFamily: 'serif',
      backgroundColor: 'white',
      textColor: 'black'
    }
  },
  {
    id: 'punjab-board-modern',
    name: 'Punjab Board Modern',
    styles: {
      headerStyle: 'text-center border-b-2 pb-6 mb-8',
      questionStyle: 'boxed-questions',
      spacingStyle: 'increased-spacing',
      fontFamily: 'sans-serif',
      backgroundColor: '#f8f8f8',
      textColor: '#333333'
    }
  },
  {
    id: 'punjab-board-compact',
    name: 'Punjab Board Compact',
    styles: {
      headerStyle: 'text-center border-b pb-2 mb-4',
      questionStyle: 'compact-questions',
      spacingStyle: 'reduced-spacing',
      fontFamily: 'system-ui',
      backgroundColor: 'white',
      textColor: '#1a1a1a'
    }
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
