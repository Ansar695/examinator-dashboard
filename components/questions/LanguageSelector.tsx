import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void
  selectedLanguage: string
}

export function LanguageSelector({ onLanguageChange, selectedLanguage }: LanguageSelectorProps) {
  return (
    <div className="flex items-center space-x-4">
      <Label htmlFor="language-select">Paper Language:</Label>
      <Select value={selectedLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger id="language-select" className="w-[180px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="urdu">Urdu</SelectItem>
          <SelectItem value="both">Both (English & Urdu)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
