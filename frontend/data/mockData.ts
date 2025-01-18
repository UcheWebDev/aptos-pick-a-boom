import { Clock, MessageSquare, Bell } from 'lucide-react';
import type { ActivityItem, EventItem } from '../types/layout';

export const mockActivities: ActivityItem[] = [
  {
    id: '1',
    icon: MessageSquare,
    title: 'New message from Sarah',
    description: 'Hey, can we discuss the project?',
    timestamp: '5 minutes ago',
    type: 'message',
  },
  {
    id: '2',
    icon: Bell,
    title: 'Meeting reminder',
    description: 'Team standup in 15 minutes',
    timestamp: '15 minutes ago',
    type: 'notification',
  },
  {
    id: '3',
    icon: Clock,
    title: 'New update available',
    description: 'Version 2.0 is now live',
    timestamp: '2 hours ago',
    type: 'update',
  },
];

export const mockEvents: EventItem[] = [
  {
    id: '1',
    title: 'Team Weekly Sync',
    datetime: 'Today, 2:00 PM',
    type: 'meeting',
  },
  {
    id: '2',
    title: 'Project Deadline',
    datetime: 'Tomorrow, 5:00 PM',
    type: 'deadline',
  },
  {
    id: '3',
    title: 'Client Presentation',
    datetime: 'Thursday, 10:00 AM',
    type: 'meeting',
  },
];