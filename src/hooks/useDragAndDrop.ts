import { useDrag, useDrop } from 'react-dnd';
import { Routine, ScheduledRoutine } from '../types/routine';

export const useRoutineDrag = (routine: Routine) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'routine',
    item: { 
      type: 'routine',
      routine 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return { drag, isDragging };
};

export const useTimeSlotDrop = (
  onDrop: (routine: Routine, timeSlot: { hour: number; minute: number; day: number; roomId: string }) => void
) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'routine',
    drop: (item: { routine: Routine }, monitor) => {
      if (monitor.didDrop()) return;
      
      const timeSlot = {
        hour: 9, // Default time, should be calculated from drop position
        minute: 0,
        day: 1, // Default to Monday, should be calculated from drop position
        roomId: 'room-1' // Default room, should be calculated from drop position
      };
      
      onDrop(item.routine, timeSlot);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return { drop, isOver, canDrop };
};

export const useScheduledRoutineDrag = (routine: any) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'scheduled-routine',
    item: { 
      type: 'scheduled-routine',
      routine: routine,
      originalTimeSlot: {
        hour: routine.startTime.hour,
        minute: routine.startTime.minute,
        day: routine.startTime.day,
        roomId: routine.roomId
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return { drag, isDragging };
};
