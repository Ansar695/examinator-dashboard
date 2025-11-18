"use client";
import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";

// Import shadcn Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

const templates = [
  {
    id: 1,
    image: '/images/template1.png',
    name: "Classic Professional",
    description: "Clean and timeless design"
  },
  {
    id: 2,
    image: '/images/template1.png',
    name: "Modern Minimalist",
    description: "Simple and elegant layout"
  },
  {
    id: 3,
    image: '/images/template1.png',
    name: "Creative Style",
    description: "Express your creativity"
  },
  {
    id: 4,
    image: '/images/template1.png',
    name: "Business Formal",
    description: "Professional and polished"
  }
];

export function TemplatesModal({ isOpen, onOpenChange }: any) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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
            {templates.map((template) => {
              const isSelected = selectedTemplate === template.id;
              
              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id as any)}
                  className={`group relative cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden bg-white ${
                    isSelected 
                      ? 'border-blue-500 shadow-lg shadow-blue-100' 
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-gray-50">
                    <Image
                      src={template?.image}
                      alt={template.name}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
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
                      {template.description}
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

          {/* Footer Action */}
          {selectedTemplate && (
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selected Template</p>
                  <p className="text-xl font-bold text-gray-900">
                    {templates.find(t => t.id === selectedTemplate)?.name}
                  </p>
                </div>
                <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-md flex items-center gap-2">
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}