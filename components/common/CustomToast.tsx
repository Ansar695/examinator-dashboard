import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`
        flex items-center p-4 rounded-lg shadow-lg max-w-sm
        ${type === 'success' 
          ? 'bg-green-50 border border-green-200 text-green-800' 
          : 'bg-red-50 border border-red-200 text-red-800'
        }
        animate-slide-in
      `}>
        <div className="flex-shrink-0 mr-3">
          {type === 'success' 
            ? <CheckCircle className="w-5 h-5 text-green-500" />
            : <XCircle className="w-5 h-5 text-red-500" />
          }
        </div>
        
        <p className="text-sm font-medium flex-1">{message}</p>
        
        <button
          onClick={onClose}
          className="ml-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Usage Hook
export const useToast = () => {
  const [toast, setToast] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showSuccess = (message: string) => {
    setToast({ type: 'success', message });
  };

  const showError = (message: string) => {
    setToast({ type: 'error', message });
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
    ToastComponent
  };
};
