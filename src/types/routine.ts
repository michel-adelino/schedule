export interface Dancer {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email?: string;
}

export interface Genre {
  id: string;
  name: string;
  color: string;
}

export interface Routine {
  id: string;
  songTitle: string;
  dancers: Dancer[];
  teacher: Teacher;
  genre: Genre;
  duration: number; // in minutes
  notes?: string;
  scheduledHours: number; // total hours scheduled
  color: string; // for calendar display
}

export interface RoutineDetails {
  id: string;
  songTitle: string;
  dancers: Dancer[];
  teacher: Teacher;
  genre: Genre;
  duration: number;
  notes: string;
}
