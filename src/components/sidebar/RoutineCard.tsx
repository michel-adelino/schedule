import React from 'react';
import { Routine } from '../../types/routine';
import { useRoutineDrag } from '../../hooks/useDragAndDrop';
import { GripVertical, Clock, Users } from 'lucide-react';

interface RoutineCardProps {
  routine: Routine;
  onClick: (routine: Routine) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({ routine, onClick }) => {
  const { drag, isDragging } = useRoutineDrag(routine);
  
  console.log('RoutineCard drag state:', { isDragging, routine: routine.songTitle });

  return (
    <div
      ref={drag}
      className={`
        bg-white rounded-lg border-2 border-gray-200 p-4 mb-3 cursor-move
        hover:border-blue-300 hover:shadow-md transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
      `}
      onClick={() => onClick(routine)}
      onMouseDown={() => console.log('RoutineCard mouse down:', routine.songTitle)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: routine.color }}
            />
            <h3 className="font-semibold text-gray-900 text-sm">
              {routine.songTitle}
            </h3>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{routine.dancers.length} dancers</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{routine.duration}min</span>
            </div>
          </div>
          
          <div className="mt-2">
            <span className="text-xs text-gray-500">
              {routine.teacher.name} • {routine.genre.name}
            </span>
          </div>
          
          {routine.scheduledHours > 0 && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {routine.scheduledHours}h scheduled
              </span>
            </div>
          )}
        </div>
        
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
};
