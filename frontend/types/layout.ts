export interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

export interface ActivityItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  timestamp: string;
  type: 'notification' | 'update' | 'message';
}

export interface EventItem {
  id: string;
  title: string;
  datetime: string;
  type: 'meeting' | 'deadline' | 'reminder';
}