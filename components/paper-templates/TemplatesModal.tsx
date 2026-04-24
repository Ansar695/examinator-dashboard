"use client";
import { Check, ChevronRight, GraduationCap } from "lucide-react";

// Import shadcn Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { paperTemplates } from "@/components/questions/PaperTemplates";

export function TemplatesModal({
  isOpen,
  onOpenChange,
  currentTemplate,
  onTemplateChange,
  institutionLogo,
  institutionName,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTemplate: string;
  onTemplateChange: (templateId: string) => void;
  institutionLogo?: string | null;
  institutionName?: string | null;
}) {
  const logoSrc = institutionLogo || "";
  const orgName = institutionName || "Your Institution";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-5xl max-h-[90vh] p-0 bg-white overflow-hidden">
        
        {/* Header */}
        <DialogHeader className="px-8 pt-8 pb-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <DialogTitle className="text-3xl font-bold text-gray-900">
            Choose a Template
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base mt-2">
            Select the template that best fits your needs
          </DialogDescription>
        </DialogHeader>

        {/* Templates Grid */}
        <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-2 gap-6">
            {paperTemplates.map((template) => {
              const isSelected = currentTemplate === template.id;
              const previewAccent = template.preview?.accent || "#2563eb";
              const previewSurface = template.preview?.surface || "#f8fafc";
              
              return (
                <div
                  key={template.id}
                  onClick={() => onTemplateChange(template.id)}
                  className={`group relative cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden bg-white ${
                    isSelected 
                      ? 'border-blue-500 shadow-lg shadow-blue-100' 
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  {/* Image Container */}
                  <div
                    className="relative h-56 overflow-hidden"
                    style={{ backgroundColor: previewSurface }}
                  >
                    <div className="absolute inset-0 p-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow"
                          style={{ border: `2px solid ${previewAccent}` }}
                        >
                          {logoSrc ? (
                            <Image
                              src={logoSrc}
                              alt={orgName}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <GraduationCap className="h-6 w-6" color={previewAccent} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {orgName}
                          </p>
                          <p className="text-xs text-slate-500">Paper Header</p>
                        </div>
                      </div>
                      <div className="mt-6 space-y-2">
                        <div
                          className="h-2 w-2/3 rounded-full"
                          style={{ backgroundColor: previewAccent }}
                        />
                        <div className="h-2 w-1/2 rounded-full bg-slate-200" />
                        <div className="h-2 w-4/5 rounded-full bg-slate-200" />
                      </div>
                      <div className="mt-8 space-y-2">
                        <div className="h-2 w-full rounded-full bg-slate-200" />
                        <div className="h-2 w-11/12 rounded-full bg-slate-200" />
                        <div className="h-2 w-10/12 rounded-full bg-slate-200" />
                      </div>
                    </div>
                    
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-2 shadow-lg">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Header + spacing + typography for {template.name}
                    </p>

                    {/* Button */}
                    <button
                      className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4" />
                          Selected
                        </>
                      ) : (
                        <>
                          Select Template
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
