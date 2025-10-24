import { ScheduledRoutine, Conflict } from '../types/schedule';
import { isTimeSlotOverlapping } from './timeUtils';

export const findConflicts = (
  scheduledRoutines: ScheduledRoutine[],
  newRoutine: ScheduledRoutine
): Conflict[] => {
  const conflicts: Conflict[] = [];
  
  // Get all dancers in the new routine
  const newRoutineDancers = newRoutine.routine.dancers;
  
  // Check against all existing scheduled routines
  for (const existingRoutine of scheduledRoutines) {
    // Skip if it's the same routine
    if (existingRoutine.id === newRoutine.id) continue;
    
    // Check if time slots overlap
    if (isTimeSlotOverlapping(
      newRoutine.startTime,
      newRoutine.endTime,
      existingRoutine.startTime,
      existingRoutine.endTime
    )) {
      // Check for dancer conflicts
      const conflictingDancers = newRoutineDancers.filter(newDancer =>
        existingRoutine.routine.dancers.some(existingDancer =>
          existingDancer.id === newDancer.id
        )
      );
      
      if (conflictingDancers.length > 0) {
        conflicts.push({
          dancerId: conflictingDancers[0].id,
          dancerName: conflictingDancers[0].name,
          conflictingRoutines: [existingRoutine.routine.songTitle],
          timeSlot: newRoutine.startTime
        });
      }
    }
  }
  
  return conflicts;
};

export const hasConflicts = (
  scheduledRoutines: ScheduledRoutine[],
  newRoutine: ScheduledRoutine
): boolean => {
  return findConflicts(scheduledRoutines, newRoutine).length > 0;
};

export const getConflictingDancers = (
  scheduledRoutines: ScheduledRoutine[],
  newRoutine: ScheduledRoutine
): string[] => {
  const conflicts = findConflicts(scheduledRoutines, newRoutine);
  return conflicts.map(conflict => conflict.dancerName);
};
