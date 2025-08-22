import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { Toast, type ToastType } from './Toast';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

type ToastAction = 
  | { type: 'ADD_TOAST'; payload: ToastItem }
  | { type: 'REMOVE_TOAST'; payload: { id: string } };

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

function toastReducer(state: ToastItem[], action: ToastAction): ToastItem[] {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, action.payload];
    case 'REMOVE_TOAST':
      return state.filter(toast => toast.id !== action.payload.id);
    default:
      return state;
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const showToast = (type: ToastType, message: string, duration = 3000) => {
    const id = crypto.randomUUID();
    dispatch({
      type: 'ADD_TOAST',
      payload: { id, type, message, duration }
    });
  };

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: { id } });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onDismiss={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
