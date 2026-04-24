import React, { useEffect } from "react";
import { CheckCircle, XCircle, X, AlertTriangle, Info } from "lucide-react";

interface ToastProps {
  type: "success" | "error" | "info" | "warning";
  title?: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  onClose,
  duration = 3200,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const toneStyles = {
    success: {
      container:
        "border-emerald-200/70 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 text-emerald-900",
      icon: "text-emerald-600",
      bar: "bg-emerald-500",
      glow: "shadow-emerald-200/70",
    },
    error: {
      container:
        "border-rose-200/70 bg-gradient-to-r from-rose-50 via-white to-rose-50 text-rose-900",
      icon: "text-rose-600",
      bar: "bg-rose-500",
      glow: "shadow-rose-200/70",
    },
    info: {
      container:
        "border-sky-200/70 bg-gradient-to-r from-sky-50 via-white to-sky-50 text-sky-900",
      icon: "text-sky-600",
      bar: "bg-sky-500",
      glow: "shadow-sky-200/70",
    },
    warning: {
      container:
        "border-amber-200/70 bg-gradient-to-r from-amber-50 via-white to-amber-50 text-amber-900",
      icon: "text-amber-600",
      bar: "bg-amber-500",
      glow: "shadow-amber-200/70",
    },
  } as const;

  const tone = toneStyles[type];

  return (
    <div className="fixed right-4 top-4 z-[9999]">
      <div
        className={`
          relative flex w-[360px] max-w-[90vw] items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur
          ${tone.container} ${tone.glow} animate-toast-in
        `}
      >
        <div className="mt-0.5 flex-shrink-0">
          {type === "success" ? (
            <CheckCircle className={`h-5 w-5 ${tone.icon}`} />
          ) : type === "error" ? (
            <XCircle className={`h-5 w-5 ${tone.icon}`} />
          ) : type === "warning" ? (
            <AlertTriangle className={`h-5 w-5 ${tone.icon}`} />
          ) : (
            <Info className={`h-5 w-5 ${tone.icon}`} />
          )}
        </div>

        <div className="flex-1">
          {title ? <p className="text-sm font-semibold">{title}</p> : null}
          <p className="text-sm leading-5 text-slate-700">{message}</p>
        </div>

        <button
          onClick={onClose}
          className="rounded-md p-1 text-slate-500 transition hover:bg-white/70 hover:text-slate-700"
          aria-label="Close toast"
        >
          <X className="h-4 w-4" />
        </button>

        <div
          className={`absolute bottom-0 left-0 h-[3px] w-full ${tone.bar} animate-toast-progress`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>

      <style jsx>{`
        @keyframes toast-in {
          from {
            transform: translateY(-8px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes toast-progress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
        .animate-toast-in {
          animation: toast-in 0.18s ease-out;
        }
        .animate-toast-progress {
          transform-origin: left;
          animation-name: toast-progress;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  );
};

// Usage Hook
export const useToast = () => {
  const [toast, setToast] = React.useState<
    { type: "success" | "error" | "info" | "warning"; message: string; title?: string } | null
  >(null);

  const showSuccess = (message: string, title = "Success") => {
    setToast({ type: "success", message, title });
  };

  const showError = (message: string, title = "Something went wrong") => {
    setToast({ type: "error", message, title });
  };

  const showInfo = (message: string, title = "Info") => {
    setToast({ type: "info", message, title });
  };

  const showWarning = (message: string, title = "Heads up") => {
    setToast({ type: "warning", message, title });
  };

  const hideToast = () => {
    setToast(null);
  };

  const ToastComponent = toast ? (
    <Toast 
      type={toast.type} 
      message={toast.message} 
      onClose={hideToast} 
    />
  ) : null;

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    ToastComponent,
  };
};
