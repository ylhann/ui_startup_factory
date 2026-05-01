export type Expertise = 'Frontend' | 'Backend' | 'Design' | 'Product' | 'Marketing' | 'AI' | 'DevOps';

export interface Task {
  id: string;
  label: string;
  status: 'todo' | 'doing' | 'done';
  progress?: number; // 0-100
  dependencies?: string[]; // Array of task IDs that must be completed first
}

export interface Skill {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
}

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  expertise: Expertise;
  model: string;
  skills: Skill[];
  experience: number; // level/years
  tasks: Task[];
  currentRoom: RoomId;
  startupId: string;
  mood: 'happy' | 'focused' | 'tired' | 'social';
  energy: number; // 0-100
  stress: number; // 0-100
}

export interface Startup {
  id: string;
  name: string;
  logo: string;
  objective: string;
  githubRepo?: string;
  productionUrl?: string;
  parameters: Record<string, any>;
  position: { x: number, y: number };
}

export type RoomId = 'work_area' | 'daily_room' | 'pitch_arena' | 'training_room' | 'break_room' | 'director_office';

export interface Room {
  id: RoomId;
  name: string;
  description: string;
  icon: string;
}

export const ROOMS: Room[] = [
  { id: 'work_area', name: 'Work Zone', description: 'Where the focus happens', icon: 'Laptop' },
  { id: 'daily_room', name: 'Daily Standup', description: 'Morning syncing', icon: 'Users' },
  { id: 'pitch_arena', name: 'Pitch Arena', description: 'Weekly demos and feedback', icon: 'Presentation' },
  { id: 'training_room', name: 'Training Room', description: 'Skill acquisition', icon: 'Brain' },
  { id: 'break_room', name: 'Coffee / Break Room', description: 'Socializing and resting', icon: 'Coffee' },
  { id: 'director_office', name: 'Director Office', description: 'Incubator management', icon: 'Briefcase' }
];
