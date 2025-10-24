
import { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'react-hot-toast';

// Components
import { RoutinesSidebar } from './components/sidebar/RoutinesSidebar';
import { CalendarGrid } from './components/calendar/CalendarGrid';
import { ToolsSidebar } from './components/sidebar/ToolsSidebar';
import { RoutineDetailsModal } from './components/modals/RoutineDetailsModal';
import { ConflictWarningModal } from './components/modals/ConflictWarningModal';
import { EmailScheduleModal } from './components/modals/EmailScheduleModal';

// Types
import { Routine } from './types/routine';
import { ScheduledRoutine, Room } from './types/schedule';

// Data
import { mockRoutines, mockTeachers, mockGenres } from './data/mockRoutines';
import { mockDancers } from './data/mockDancers';
import { mockRooms, mockScheduledRoutines } from './data/mockSchedules';

// Hooks
import { useConflictDetection } from './hooks/useConflictDetection';

// Utils
import { addMinutesToTime, formatTime } from './utils/timeUtils';
import { findConflicts } from './utils/conflictUtils';

function App() {
  // State
  const [routines, setRoutines] = useState<Routine[]>(mockRoutines);
  const [scheduledRoutines, setScheduledRoutines] = useState<ScheduledRoutine[]>(mockScheduledRoutines);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [visibleRooms, setVisibleRooms] = useState(4);
  
  // Modal states
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  
  // Conflict detection
  const { conflicts, showConflictModal, checkConflicts, resolveConflicts, dismissConflicts } = useConflictDetection();

  // Get conflicts for display in sidebar
  const getConflictsForDisplay = () => {
    const conflictList: Array<{dancer: string, routines: string[], time: string}> = [];
    
    scheduledRoutines.forEach(routine => {
      const routineConflicts = findConflicts(scheduledRoutines, routine);
      if (routineConflicts.length > 0) {
        routineConflicts.forEach(conflict => {
          conflictList.push({
            dancer: conflict.dancerName,
            routines: conflict.conflictingRoutines,
            time: formatTime(conflict.timeSlot.hour, conflict.timeSlot.minute)
          });
        });
      }
    });
    
    return conflictList;
  };

  // Handlers
  const handleRoutineClick = useCallback((routine: Routine) => {
    setSelectedRoutine(routine);
    setShowRoutineModal(true);
  }, []);

  const handleScheduledRoutineClick = useCallback((scheduledRoutine: ScheduledRoutine) => {
    setSelectedRoutine(scheduledRoutine.routine);
    setShowRoutineModal(true);
  }, []);

  const handleAddRoutine = useCallback(() => {
    const newRoutine: Routine = {
      id: `routine-${Date.now()}`,
      songTitle: 'New Routine',
      dancers: [],
      teacher: mockTeachers[0],
      genre: mockGenres[0],
      duration: 60,
      notes: '',
      scheduledHours: 0,
      color: mockGenres[0].color
    };
    setRoutines(prev => [...prev, newRoutine]);
    setSelectedRoutine(newRoutine);
    setShowRoutineModal(true);
  }, []);

  const handleSaveRoutine = useCallback((updatedRoutine: Routine) => {
    setRoutines(prev => prev.map(r => r.id === updatedRoutine.id ? updatedRoutine : r));
    setShowRoutineModal(false);
    setSelectedRoutine(null);
  }, []);

  const handleDeleteRoutine = useCallback((routineId: string) => {
    setRoutines(prev => prev.filter(r => r.id !== routineId));
    setScheduledRoutines(prev => prev.filter(sr => sr.routineId !== routineId));
    setShowRoutineModal(false);
    setSelectedRoutine(null);
  }, []);

  const handleDropRoutine = useCallback((routine: Routine, timeSlot: { hour: number; minute: number; day: number; roomId: string }) => {
    console.log('handleDropRoutine called:', { routine: routine.songTitle, timeSlot });
    
    const newScheduledRoutine: ScheduledRoutine = {
      id: `scheduled-${Date.now()}`,
      routineId: routine.id,
      routine: routine,
      roomId: timeSlot.roomId,
      startTime: { hour: timeSlot.hour, minute: timeSlot.minute, day: timeSlot.day },
      endTime: addMinutesToTime({ hour: timeSlot.hour, minute: timeSlot.minute, day: timeSlot.day }, routine.duration),
      duration: routine.duration
    };

    console.log('New scheduled routine created:', newScheduledRoutine);

    // Check for conflicts
    const hasConflicts = checkConflicts(scheduledRoutines, newScheduledRoutine);
    
    console.log('Conflict check result:', hasConflicts);
    console.log('Current scheduled routines:', scheduledRoutines.length);
    
    // Always add the routine to schedule, even with conflicts
    console.log('Adding routine to schedule (conflicts will be shown in sidebar)');
    setScheduledRoutines(prev => {
      const updated = [...prev, newScheduledRoutine];
      console.log('Updated scheduled routines:', updated.length);
      return updated;
    });
    
    // Update routine's scheduled hours
    setRoutines(prev => prev.map(r => 
      r.id === routine.id 
        ? { ...r, scheduledHours: r.scheduledHours + (routine.duration / 60) }
        : r
    ));
    
    console.log('Routine scheduled successfully');
    
    // Show conflict warning if there are conflicts
    if (hasConflicts) {
      console.log('Conflicts detected - routine scheduled but conflicts will be shown');
    }
  }, [scheduledRoutines, checkConflicts]);

  const handleMoveRoutine = useCallback((routine: ScheduledRoutine, newTimeSlot: { hour: number; minute: number; day: number; roomId: string }) => {
    const updatedRoutine: ScheduledRoutine = {
      ...routine,
      roomId: newTimeSlot.roomId,
      startTime: { hour: newTimeSlot.hour, minute: newTimeSlot.minute, day: newTimeSlot.day },
      endTime: addMinutesToTime({ hour: newTimeSlot.hour, minute: newTimeSlot.minute, day: newTimeSlot.day }, routine.duration)
    };

    // Check for conflicts
    const hasConflicts = checkConflicts(scheduledRoutines.filter(sr => sr.id !== routine.id), updatedRoutine);
    
    // Always move the routine, even with conflicts
    setScheduledRoutines(prev => prev.map(sr => 
      sr.id === routine.id ? updatedRoutine : sr
    ));
    
    if (hasConflicts) {
      console.log('Routine moved with conflicts - conflicts will be shown in sidebar');
    }
  }, [scheduledRoutines, checkConflicts]);

  const handleDeleteScheduledRoutine = useCallback((routine: ScheduledRoutine) => {
    console.log('Deleting scheduled routine:', routine.routine.songTitle);
    
    // Remove from scheduled routines
    setScheduledRoutines(prev => prev.filter(sr => sr.id !== routine.id));
    
    // Update routine's scheduled hours
    setRoutines(prev => prev.map(r => 
      r.id === routine.routineId 
        ? { ...r, scheduledHours: Math.max(0, r.scheduledHours - (routine.duration / 60)) }
        : r
    ));
    
    console.log('Scheduled routine deleted successfully');
  }, []);

  const handleResolveConflicts = useCallback(() => {
    // In a real app, you'd handle the conflict resolution logic here
    // For demo purposes, we'll just dismiss the modal
    resolveConflicts();
  }, [resolveConflicts]);

  const handleRoomConfigChange = useCallback((newVisibleRooms: number) => {
    setVisibleRooms(newVisibleRooms);
    setRooms(prev => prev.map((room, index) => ({
      ...room,
      isActive: index < newVisibleRooms
    })));
  }, []);

  const handleEmailSchedule = useCallback(() => {
    setShowEmailModal(true);
  }, []);

  const handleExportSchedule = useCallback(() => {
    // Generate week dates for the current week
    const currentWeek = new Date();
    const start = new Date(currentWeek);
    const day = start.getDay();
    const diff = start.getDate() - day;
    start.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      weekDates.push(day);
    }
    
    // Import and use the PDF generation utility
    import('./utils/pdfUtils').then(({ generateSchedulePDF }) => {
      generateSchedulePDF(scheduledRoutines, weekDates);
    });
  }, [scheduledRoutines]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen bg-gray-100 flex overflow-hidden">
        {/* Left Sidebar - Routines */}
        <div className="flex-shrink-0">
          <RoutinesSidebar
            routines={routines}
            onRoutineClick={handleRoutineClick}
            onAddRoutine={handleAddRoutine}
          />
        </div>

        {/* Main Calendar Area */}
        <div className="flex-1 flex flex-col min-w-0">
            <CalendarGrid
              rooms={rooms}
              scheduledRoutines={scheduledRoutines}
              onDrop={handleDropRoutine}
              onRoutineClick={handleScheduledRoutineClick}
              onMoveRoutine={handleMoveRoutine}
              onDeleteRoutine={handleDeleteScheduledRoutine}
              visibleRooms={visibleRooms}
            />
        </div>

        {/* Right Sidebar - Tools */}
        <div className="flex-shrink-0">
          <ToolsSidebar
            rooms={rooms}
            dancers={mockDancers}
            visibleRooms={visibleRooms}
            onRoomConfigChange={handleRoomConfigChange}
            onEmailSchedule={handleEmailSchedule}
            onExportSchedule={handleExportSchedule}
            conflicts={getConflictsForDisplay()}
          />
        </div>

        {/* Modals */}
        <RoutineDetailsModal
          routine={selectedRoutine}
          dancers={mockDancers}
          teachers={mockTeachers}
          genres={mockGenres}
          isOpen={showRoutineModal}
          onClose={() => {
            setShowRoutineModal(false);
            setSelectedRoutine(null);
          }}
          onSave={handleSaveRoutine}
          onDelete={handleDeleteRoutine}
        />

        <ConflictWarningModal
          conflicts={conflicts}
          isOpen={showConflictModal}
          onResolve={handleResolveConflicts}
          onDismiss={dismissConflicts}
        />

        <EmailScheduleModal
          dancers={mockDancers}
          scheduledRoutines={scheduledRoutines}
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
        />

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </DndProvider>
  );
}

export default App;
