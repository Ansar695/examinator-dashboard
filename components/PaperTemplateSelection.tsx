import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FileText, Sparkles, Minimize2, Award, BookOpen, Layout } from "lucide-react";

export interface PaperTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  styles: {
    headerStyle: string;
    questionStyle: string;
    spacingStyle: string;
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    backgroundColor: string;
    textColor: string;
    borderStyle: string;
    headerBg?: string;
  };
  preview: {
    headerAlign: string;
    questionSpacing: string;
    borderWidth: string;
  };
}

export const paperTemplates: PaperTemplate[] = [
  {
    id: 'punjab-board-standard',
    name: 'Standard',
    description: 'Classic board examination format',
    icon: <FileText className="h-5 w-5" />,
    styles: {
      headerStyle: 'text-center border-b-2 border-primary pb-6 mb-8',
      questionStyle: 'space-y-4',
      spacingStyle: 'leading-relaxed',
      fontFamily: 'serif',
      fontSize: '16px',
      lineHeight: '1.8',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderStyle: 'border-2 border-gray-300',
    },
    preview: {
      headerAlign: 'text-center',
      questionSpacing: 'space-y-4',
      borderWidth: 'border-2',
    }
  },
  {
    id: 'punjab-board-modern',
    name: 'Modern',
    description: 'Contemporary design with clean lines',
    icon: <Sparkles className="h-5 w-5" />,
    styles: {
      headerStyle: 'text-center bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary p-6 mb-8 rounded-r-lg',
      questionStyle: 'space-y-6',
      spacingStyle: 'leading-loose',
      fontFamily: 'sans-serif',
      fontSize: '16px',
      lineHeight: '1.9',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      borderStyle: 'border border-gray-200 shadow-lg',
      headerBg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    },
    preview: {
      headerAlign: 'text-left',
      questionSpacing: 'space-y-6',
      borderWidth: 'border-l-4',
    }
  },
  {
    id: 'punjab-board-compact',
    name: 'Compact',
    description: 'Space-efficient layout',
    icon: <Minimize2 className="h-5 w-5" />,
    styles: {
      headerStyle: 'text-center border-b pb-4 mb-6',
      questionStyle: 'space-y-3',
      spacingStyle: 'leading-normal',
      fontFamily: 'system-ui',
      fontSize: '14px',
      lineHeight: '1.6',
      backgroundColor: '#ffffff',
      textColor: '#1a1a1a',
      borderStyle: 'border border-gray-300',
    },
    preview: {
      headerAlign: 'text-center',
      questionSpacing: 'space-y-3',
      borderWidth: 'border',
    }
  },
  {
    id: 'punjab-board-elegant',
    name: 'Elegant',
    description: 'Refined professional appearance',
    icon: <Award className="h-5 w-5" />,
    styles: {
      headerStyle: 'text-center border-t-4 border-b-4 border-double border-primary py-6 mb-8',
      questionStyle: 'space-y-5',
      spacingStyle: 'leading-relaxed',
      fontFamily: 'Georgia, serif',
      fontSize: '16px',
      lineHeight: '1.85',
      backgroundColor: '#fffef9',
      textColor: '#2d2d2d',
      borderStyle: 'border-4 border-double border-gray-400 shadow-xl',
    },
    preview: {
      headerAlign: 'text-center',
      questionSpacing: 'space-y-5',
      borderWidth: 'border-double border-4',
    }
  },
  {
    id: 'punjab-board-classic',
    name: 'Classic',
    description: 'Traditional examination style',
    icon: <BookOpen className="h-5 w-5" />,
    styles: {
      headerStyle: 'text-center underline decoration-2 underline-offset-8 pb-6 mb-8',
      questionStyle: 'space-y-4',
      spacingStyle: 'leading-relaxed',
      fontFamily: 'Times New Roman, serif',
      fontSize: '16px',
      lineHeight: '1.8',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderStyle: 'border-2 border-black',
    },
    preview: {
      headerAlign: 'text-center',
      questionSpacing: 'space-y-4',
      borderWidth: 'border-2',
    }
  },
  {
    id: 'punjab-board-minimalist',
    name: 'Minimalist',
    description: 'Clean and distraction-free',
    icon: <Layout className="h-5 w-5" />,
    styles: {
      headerStyle: 'text-left border-l-8 border-primary pl-6 py-4 mb-8',
      questionStyle: 'space-y-6',
      spacingStyle: 'leading-loose',
      fontFamily: 'Inter, sans-serif',
      fontSize: '15px',
      lineHeight: '1.9',
      backgroundColor: '#fafafa',
      textColor: '#171717',
      borderStyle: 'border-l-8 border-primary',
    },
    preview: {
      headerAlign: 'text-left',
      questionSpacing: 'space-y-6',
      borderWidth: 'border-l-8',
    }
  }
];

interface PaperTemplateSelectorProps {
  onSelect: (template: PaperTemplate) => void;
  selectedTemplateId: string;
}

export function PaperTemplateSelector({ onSelect, selectedTemplateId }: PaperTemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">Paper Format</Label>
        <p className="text-sm text-muted-foreground mt-1">Choose a template for your exam paper</p>
      </div>
      
      <RadioGroup
        value={selectedTemplateId}
        onValueChange={(value) => {
          const template = paperTemplates.find(t => t.id === value);
          if (template) onSelect(template);
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {paperTemplates.map((template) => (
          <Card
            key={template.id}
            className={`relative cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplateId === template.id
                ? 'ring-2 ring-primary shadow-lg scale-105'
                : 'hover:scale-102'
            }`}
          >
            <label htmlFor={template.id} className="cursor-pointer block p-4">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value={template.id} id={template.id} className="mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${
                      selectedTemplateId === template.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {template.icon}
                    </div>
                    <div>
                      <div className="font-semibold">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </div>
                  </div>
                  
                  {/* Mini Preview */}
                  <div className="mt-3 p-3 bg-muted/50 rounded border border-border text-xs">
                    <div className={`${template.preview.headerAlign} font-bold mb-2 text-[10px]`}>
                      EXAMINATION BOARD
                    </div>
                    <div className={template.preview.questionSpacing}>
                      <div className="flex items-start space-x-1">
                        <span>1.</span>
                        <div className="flex-1 h-1.5 bg-foreground/20 rounded"></div>
                      </div>
                      <div className="flex items-start space-x-1">
                        <span>2.</span>
                        <div className="flex-1 h-1.5 bg-foreground/20 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </label>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
}
