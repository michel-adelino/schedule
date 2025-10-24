export interface Dancer {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  phone?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  genres?: string[];
}

export interface DancerSchedule {
  dancerId: string;
  dancerName: string;
  routines: {
    routineId: string;
    songTitle: string;
    roomName: string;
    startTime: string;
    endTime: string;
    day: string;
  }[];
}
