import type { TracingLevel } from '../../types/TracingTypes';

// Basic strokes - nét cơ bản cho trẻ em luyện tập
export const basicLevels: TracingLevel[] = [
  {
    id: 'basic-horizontal',
    title: 'Nét ngang',
    category: 'basic',
    difficulty: 'easy',
    strokes: [
      {
        order: 1,
        path: 'M100,200 L400,200',
        startPoint: { x: 100, y: 200 },
        endPoint: { x: 400, y: 200 },
        tolerance: 50
      }
    ]
  },
  {
    id: 'basic-vertical',
    title: 'Nét dọc',
    category: 'basic',
    difficulty: 'easy',
    strokes: [
      {
        order: 1,
        path: 'M250,100 L250,300',
        startPoint: { x: 250, y: 100 },
        endPoint: { x: 250, y: 300 },
        tolerance: 50
      }
    ]
  },
  {
    id: 'basic-diagonal-right',
    title: 'Nét chéo phải',
    category: 'basic',
    difficulty: 'easy',
    strokes: [
      {
        order: 1,
        path: 'M100,300 L400,100',
        startPoint: { x: 100, y: 300 },
        endPoint: { x: 400, y: 100 },
        tolerance: 50
      }
    ]
  },
  {
    id: 'basic-diagonal-left',
    title: 'Nét chéo trái',
    category: 'basic',
    difficulty: 'easy',
    strokes: [
      {
        order: 1,
        path: 'M100,100 L400,300',
        startPoint: { x: 100, y: 100 },
        endPoint: { x: 400, y: 300 },
        tolerance: 50
      }
    ]
  },
  {
    id: 'basic-curve-up',
    title: 'Nét cong lên',
    category: 'basic',
    difficulty: 'medium',
    strokes: [
      {
        order: 1,
        path: 'M100,250 Q250,150 400,250',
        startPoint: { x: 100, y: 250 },
        endPoint: { x: 400, y: 250 },
        tolerance: 60
      }
    ]
  },
  {
    id: 'basic-curve-down',
    title: 'Nét cong xuống',
    category: 'basic',
    difficulty: 'medium',
    strokes: [
      {
        order: 1,
        path: 'M100,150 Q250,250 400,150',
        startPoint: { x: 100, y: 150 },
        endPoint: { x: 400, y: 150 },
        tolerance: 60
      }
    ]
  },
  {
    id: 'basic-zigzag',
    title: 'Nét zigzag',
    category: 'basic',
    difficulty: 'medium',
    strokes: [
      {
        order: 1,
        path: 'M100,200 L150,150 L200,250 L250,150 L300,250 L350,150 L400,200',
        startPoint: { x: 100, y: 200 },
        endPoint: { x: 400, y: 200 },
        tolerance: 70
      }
    ]
  },
  {
    id: 'basic-wave',
    title: 'Nét sóng',
    category: 'basic',
    difficulty: 'hard',
    strokes: [
      {
        order: 1,
        path: 'M100,200 Q150,150 200,200 Q250,250 300,200 Q350,150 400,200',
        startPoint: { x: 100, y: 200 },
        endPoint: { x: 400, y: 200 },
        tolerance: 70
      }
    ]
  }
];