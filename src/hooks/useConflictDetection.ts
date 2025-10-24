import { useState, useCallback } from 'react';
import { ScheduledRoutine, Conflict } from '../types/schedule';
import { findConflicts } from '../utils/conflictUtils';

export const useConflictDetection = () => {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [showConflictModal, setShowConflictModal] = useState(false);

  const checkConflicts = useCallback((
    scheduledRoutines: ScheduledRoutine[],
    newRoutine: ScheduledRoutine
  ): boolean => {
    const detectedConflicts = findConflicts(scheduledRoutines, newRoutine);
    setConflicts(detectedConflicts);
    
    if (detectedConflicts.length > 0) {
      setShowConflictModal(true);
      return true;
    }
    
    return false;
  }, []);

  const resolveConflicts = useCallback(() => {
    setConflicts([]);
    setShowConflictModal(false);
  }, []);

  const dismissConflicts = useCallback(() => {
    setConflicts([]);
    setShowConflictModal(false);
  }, []);

  return {
    conflicts,
    showConflictModal,
    checkConflicts,
    resolveConflicts,
    dismissConflicts
  };
};
