import { Routine } from './routine';

export interface TimeSlot {
  hour: number;
  minute: number;
  day: number; // 0 = Sunday, 1 = Monday, etc.
}

export interface ScheduledRoutine {
  id: string;
  routineId: string;
  routine: Routine;
  roomId: string;
  startTime: TimeSlot;
  endTime: TimeSlot;
  duration: number; // in minutes
}

export interface Room {
  id: string;
  name: string;
  isActive: boolean;
}

export interface Conflict {
  dancerId: string;
  dancerName: string;
  conflictingRoutines: string[];
  timeSlot: TimeSlot;
}

export interface CalendarView {
  type: 'day' | 'week' | 'month';
  startDate: Date;
  endDate: Date;
  visibleRooms: number; // 1-8
}
