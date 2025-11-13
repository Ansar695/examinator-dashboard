'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, Sparkles, AlertCircle, UserPlus, Award, Info } from 'lucide-react'
import { Notification } from '@/utils/types/notification';

// Mock data - replace with actual API call
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Paper Generated Successfully',
    message: 'Your Chemistry-11 Annual Exam 2025 paper has been generated and is ready to download.',
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
    icon: CheckCircle,
    color: 'emerald'
  },
  {
    id: '2',
    type: 'info',
    title: 'New Feature Available',
    message: 'Try our new AI-powered question recommendation system for better paper generation.',
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: false,
    icon: Sparkles,
    color: 'blue'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Subscription Expiring Soon',
    message: 'Your premium subscription will expire in 7 days. Renew now to continue enjoying all features.',
    timestamp: new Date(Date.now() - 5 * 3600000),
    read: true,
    icon: AlertCircle,
    color: 'amber'
  },
  {
    id: '4',
    type: 'info',
    title: 'Paper Shared With You',
    message: 'John Doe shared "Mathematics-10 Mid Term" paper with you.',
    timestamp: new Date(Date.now() - 24 * 3600000),
    read: true,
    icon: UserPlus,
    color: 'purple'
  },
  {
    id: '5',
    type: 'success',
    title: 'Achievement Unlocked',
    message: 'Congratulations! You\'ve generated 50 papers. Keep up the great work!',
    timestamp: new Date(Date.now() - 2 * 24 * 3600000),
    read: true,
    icon: Award,
    color: 'yellow'
  },
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isLoading, setIsLoading] = useState(false);

  // Replace with actual API call
  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  // const fetchNotifications = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch('/api/notifications');
  //     const data = await response.json();
  //     setNotifications(data);
  //   } catch (error) {
  //     console.error('Error fetching notifications:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    // API call: await markNotificationAsRead(id);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    // API call: await markAllNotificationsAsRead();
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    // API call: await deleteNotification(id);
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};