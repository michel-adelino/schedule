import React from 'react';
import { ScheduledRoutine } from '../../types/schedule';
import { formatTime } from '../../utils/timeUtils';
import { useDrag } from 'react-dnd';

interface ScheduledBlockProps {
  routine: ScheduledRoutine;
  onClick: () => void;
  onMove?: (routine: ScheduledRoutine, newTimeSlot: { hour: number; minute: number; day: number; roomId: string }) => void;
}

export const ScheduledBlock: React.FC<ScheduledBlockProps> = ({ routine, onClick, onMove }) => {
  const duration = routine.duration;
  const height = Math.max(64, (duration / 60) * 64); // Scale by 1-hour intervals

  // Check if this routine has conflicts
  const hasConflicts = routine.routine.dancers.some(dancer => 
    routine.routine.dancers.filter(d => d.id === dancer.id).length > 1
  );

  // Make the block draggable
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

  return (
    <div
      ref={drag}
      className={`
        absolute left-0 right-0 z-10 cursor-move rounded-lg border-2 p-2
        hover:shadow-lg transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
        ${hasConflicts ? 'border-red-500 bg-red-100 shadow-lg' : 
          routine.routine.dancers.length > 0 ? 'border-blue-300' : 'border-gray-300'}
      `}
      style={{
        height: `${height}px`,
        backgroundColor: hasConflicts ? '#fef2f2' : routine.routine.color + '20', // 20% opacity
        borderColor: hasConflicts ? '#ef4444' : routine.routine.color,
        top: '2px',
        left: '2px',
        right: '2px'
      }}
      onClick={onClick}
    >
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className={`font-semibold text-sm truncate ${hasConflicts ? 'text-red-900' : 'text-gray-900'}`}>
            {routine.routine.songTitle}
            {hasConflicts && <span className="text-red-600 ml-1">⚠️</span>}
          </div>
          <div className={`text-xs truncate ${hasConflicts ? 'text-red-700' : 'text-gray-600'}`}>
            {routine.routine.teacher.name}
          </div>
          {isDragging && (
            <div className="text-xs text-blue-600 font-bold mt-1">
              Moving...
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className={hasConflicts ? 'text-red-600 font-bold' : 'text-gray-500'}>
            {formatTime(routine.startTime.hour, routine.startTime.minute)}
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${hasConflicts ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            <span className={hasConflicts ? 'text-red-600 font-bold' : 'text-gray-600'}>
              {routine.routine.dancers.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
