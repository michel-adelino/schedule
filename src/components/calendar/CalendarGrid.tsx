import React, { useState } from 'react';
import { Room } from '../../types/room';
import { ScheduledRoutine } from '../../types/schedule';
import { Routine } from '../../types/routine';
import { TimeSlot } from './TimeSlot';
import { ScheduledBlock } from './ScheduledBlock';
import { formatTime, getDayName, getShortDayName } from '../../utils/timeUtils';
import { findConflicts } from '../../utils/conflictUtils';
import { ChevronLeft, ChevronRight, Calendar, AlertTriangle } from 'lucide-react';

interface CalendarGridProps {
  rooms: Room[];
  scheduledRoutines: ScheduledRoutine[];
  onDrop: (routine: Routine, timeSlot: { hour: number; minute: number; day: number; roomId: string }) => void;
  onRoutineClick: (routine: ScheduledRoutine) => void;
  onMoveRoutine: (routine: ScheduledRoutine, newTimeSlot: { hour: number; minute: number; day: number; roomId: string }) => void;
  visibleRooms: number;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  rooms,
  scheduledRoutines,
  onDrop,
  onRoutineClick,
  onMoveRoutine,
  visibleRooms
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(21);
  const [timeInterval, setTimeInterval] = useState(60);

  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    start.setDate(diff);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);
  const activeRooms = rooms.filter(room => room.isActive).slice(0, visibleRooms);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const formatWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  // Get conflicts for display
  const getAllConflicts = () => {
    const conflicts: Array<{dancer: string, routines: string[], time: string}> = [];
    
    scheduledRoutines.forEach(routine => {
      const routineConflicts = findConflicts(scheduledRoutines, routine);
      if (routineConflicts.length > 0) {
        routineConflicts.forEach(conflict => {
          conflicts.push({
            dancer: conflict.dancerName,
            routines: conflict.conflictingRoutines,
            time: formatTime(conflict.timeSlot.hour, conflict.timeSlot.minute)
          });
        });
      }
    });
    
    return conflicts;
  };

  const conflicts = getAllConflicts();

  // Get routine for specific time slot and room
  const getRoutineForSlot = (hour: number, minute: number, day: number, roomId: string): ScheduledRoutine | null => {
    return scheduledRoutines.find(routine => 
      routine.roomId === roomId &&
      routine.startTime.day === day &&
      routine.startTime.hour === hour &&
      routine.startTime.minute === minute
    ) || null;
  };

  // Check if time slot has conflicts
  const hasConflicts = (hour: number, minute: number, day: number, roomId: string): boolean => {
    const routine = getRoutineForSlot(hour, minute, day, roomId);
    if (!routine) return false;
    
    const routineConflicts = findConflicts(scheduledRoutines, routine);
    return routineConflicts.length > 0;
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += timeInterval) {
      timeSlots.push({ hour, minute });
    }
  }
  
  // Add some extra content to ensure scrolling
  const totalTimeSlots = timeSlots.length;
  console.log(`Generated ${totalTimeSlots} time slots from ${startHour}:00 to ${endHour}:00`);
  console.log(`Calendar dimensions: ${activeRooms.length} rooms × 7 days = ${activeRooms.length * 7} columns`);

  return (
    <div className="flex-1 bg-white flex flex-col" style={{ height: '100%' }}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Schedule</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Today
              </button>
              
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {formatWeekRange()}
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={`${startHour}-${endHour}`}
                onChange={(e) => {
                  const [start, end] = e.target.value.split('-').map(Number);
                  setStartHour(start);
                  setEndHour(end);
                }}
                className="px-2 py-1 border border-gray-300 rounded text-xs"
              >
                <option value="6-24">6 AM - 12 AM</option>
                <option value="8-22">8 AM - 10 PM</option>
                <option value="9-21">9 AM - 9 PM</option>
                <option value="10-20">10 AM - 8 PM</option>
              </select>
              
              <select
                value={timeInterval}
                onChange={(e) => setTimeInterval(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-xs"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Conflicts Display */}
      {conflicts.length > 0 && (
        <div className="bg-red-100 border-b-2 border-red-400 p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-700" />
            <span className="font-bold text-red-900 text-lg">⚠️ SCHEDULING CONFLICTS DETECTED</span>
          </div>
          <div className="space-y-2">
            {conflicts.map((conflict, index) => (
              <div key={index} className="bg-red-200 border border-red-400 rounded-lg p-3">
                <div className="text-sm font-bold text-red-900">
                  <strong>{conflict.dancer}</strong> is double-booked at {conflict.time}
                </div>
                <div className="text-sm text-red-800 mt-1">
                  Conflicting routines: {conflict.routines.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto bg-white border-2 border-blue-200" style={{ 
        overflow: 'auto', 
        minHeight: '400px',
        height: 'calc(100vh - 300px)',
        overflowX: 'auto',
        overflowY: 'scroll'
      }}>
        <div className="min-w-max bg-gray-50" style={{ minWidth: 'max-content' }}>
          {/* Days Header */}
          <div className="flex border-b border-gray-200 sticky top-0 bg-white z-20" style={{ minWidth: 'max-content' }}>
            {/* Time column header */}
            <div className="w-24 bg-gray-50 border-r border-gray-200 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">TIME</span>
            </div>
            
            {/* Days */}
            {weekDates.map((date, dayIndex) => (
              <div key={dayIndex} className="border-r border-gray-200 last:border-r-0" style={{ minWidth: `${activeRooms.length * 120}px` }}>
                <div className="bg-gray-50 border-b border-gray-200 p-4 text-center">
                  <div className="font-semibold text-gray-900 text-base">
                    {getShortDayName(date.getDay())}
                  </div>
                  <div className="text-sm text-gray-600">
                    {date.getDate()}
                  </div>
                </div>
                
                {/* Room headers for this day */}
                <div className="flex">
                  {activeRooms.map(room => (
                    <div key={room.id} className="border-r border-gray-200 last:border-r-0 p-3 text-center" style={{ width: '120px' }}>
                      <div className="text-sm font-medium text-gray-700">{room.name}</div>
                      {room.capacity && (
                        <div className="text-xs text-gray-500">({room.capacity})</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots and grid */}
          <div className="flex" style={{ minWidth: 'max-content' }}>
            {/* Time column */}
            <div className="w-24 bg-gray-50 border-r border-gray-200 sticky left-0 z-10 flex-shrink-0">
              {timeSlots.map(({ hour, minute }, index) => (
                <div key={index} className="h-16 border-b border-gray-200 flex items-center justify-center bg-white">
                  <span className="text-sm text-gray-600 font-medium">
                    {formatTime(hour, minute)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            {weekDates.map((date, dayIndex) => (
              <div key={dayIndex} className="border-r border-gray-200 last:border-r-0 flex-shrink-0" style={{ minWidth: `${activeRooms.length * 120}px` }}>
                <div className="flex">
                  {activeRooms.map(room => (
                    <div key={room.id} className="border-r border-gray-200 last:border-r-0 flex-shrink-0 bg-white" style={{ width: '120px' }}>
                      {timeSlots.map(({ hour, minute }, timeIndex) => {
                        const routine = getRoutineForSlot(hour, minute, date.getDay(), room.id);
                        const hasConflict = hasConflicts(hour, minute, date.getDay(), room.id);
                        
                        return (
                          <TimeSlot
                            key={timeIndex}
                            hour={hour}
                            minute={minute}
                            day={date.getDay()}
                            roomId={room.id}
                            onDrop={onDrop}
                            onMoveRoutine={onMoveRoutine}
                            hasConflict={hasConflict}
                          >
                            {routine && (
                              <ScheduledBlock
                                routine={routine}
                                onClick={() => onRoutineClick(routine)}
                                onMove={onMoveRoutine}
                              />
                            )}
                          </TimeSlot>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
