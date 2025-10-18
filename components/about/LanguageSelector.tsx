import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Languages } from "lucide-react";

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
  selectedLanguage: string;
}

export function LanguageSelector({ onLanguageChange, selectedLanguage }: LanguageSelectorProps) {
  const languages = [
    { id: 'english', name: 'English', flag: '🇬🇧' },
    { id: 'urdu', name: 'Urdu', flag: '🇵🇰' },
    { id: 'both', name: 'Bilingual', flag: '🌐' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Languages className="h-4 w-4 text-muted-foreground" />
        <Label className="text-sm font-semibold">Language</Label>
      </div>
      
      <RadioGroup
        value={selectedLanguage}
        onValueChange={onLanguageChange}
        className="flex space-x-2"
      >
        {languages.map((lang) => (
          <Card
            key={lang.id}
            className={`flex-1 cursor-pointer transition-all hover:shadow-md ${
              selectedLanguage === lang.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            }`}
          >
            <label htmlFor={lang.id} className="cursor-pointer block p-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={lang.id} id={lang.id} />
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
              </div>
            </label>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
}
