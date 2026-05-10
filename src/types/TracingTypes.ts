// Types cho hệ thống tracing game
export interface Stroke {
  order: number;
  path: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  tolerance: number;
}

export interface TracingLevel {
  id: string;
  title: string;
  category: 'basic' | 'shapes' | 'numbers' | 'letters' | 'objects';
  strokes: Stroke[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserProgress {
  levelId: string;
  completedStrokes: number[];
  isCompleted: boolean;
  bestTime?: number;
}