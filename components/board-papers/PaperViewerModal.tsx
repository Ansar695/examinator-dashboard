"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";

interface PaperViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperUrl?: string;
  paperName?: string;
}

export default function PaperViewerModal({
  isOpen,
  onClose,
  paperUrl,
  paperName = "Board Paper",
}: PaperViewerModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!paperUrl) return null;

  const extension = paperUrl.split(".").pop()?.toLowerCase() || "";
  const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(extension);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!max-w-[80vw] !w-[80vw] !h-[90vh] flex flex-col p-0 overflow-hidden bg-card/95 backdrop-blur-xl border border-border/60 shadow-2xl rounded-2xl gap-0">
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border/50 bg-background/50 backdrop-blur-md z-10 shrink-0">
          <DialogTitle className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {paperName} Preview
          </DialogTitle>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild className="h-9 font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
              <a href={paperUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </a>
            </Button>
            <Button variant="default" size="sm" asChild className="h-9 shadow-md transition-all">
              <a href={paperUrl} download>
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            </Button>
          </div>
        </DialogHeader>

        <div className="relative flex-1 w-full bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-auto p-4 md:p-8">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading preview...</p>
            </div>
          )}

          {isImage ? (
            <div className="relative w-full h-full max-h-full flex items-center justify-center">
              {/* Using standard img for external blob support if next/image unconfigured domains pose issues */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={paperUrl}
                alt={paperName}
                className={`max-w-full max-h-full object-contain rounded-xl shadow-lg ring-1 ring-black/5 transition-opacity duration-300 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsLoading(false)}
              />
            </div>
          ) : (
            <iframe
              src={`${paperUrl}#toolbar=0`}
              title={paperName}
              className={`w-full h-full rounded-xl shadow-lg bg-white ring-1 ring-black/5 transition-opacity duration-300 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setIsLoading(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
