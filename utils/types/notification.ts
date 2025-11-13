import { LucideIcon } from 'lucide-react'

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon: LucideIcon;
  color: string;
}