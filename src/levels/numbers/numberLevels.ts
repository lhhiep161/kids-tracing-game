import type { TracingLevel } from '../../types/TracingTypes';

// Bộ chữ số 0-9 dạng worksheet đơn giản, cân đối, phù hợp trẻ em tập nét.
// ViewBox hiện tại của TracingBoard: 0 0 500 400
// Vùng vẽ chính đặt quanh x: 140-340, y: 90-330

export const numberLevels: TracingLevel[] = [
  {
    id: 'number-0',
    title: 'Số 0',
    category: 'numbers',
    difficulty: 'easy',
    strokes: [
      {
        order: 1,
        path: 'M240,90 C170,90 130,145 130,210 C130,285 175,330 240,330 C305,330 350,285 350,210 C350,145 310,90 240,90',
        startPoint: { x: 240, y: 90 },
        endPoint: { x: 240, y: 90 },
        tolerance: 55,
      },
    ],
  },
  {
    id: 'number-1',
    title: 'Số 1',
    category: 'numbers',
    difficulty: 'easy',
    strokes: [
      {
        order: 1,
        path: 'M210,130 L250,90 L250,330',
        startPoint: { x: 210, y: 130 },
        endPoint: { x: 250, y: 330 },
        tolerance: 45,
      },
      {
        order: 2,
        path: 'M200,330 L300,330',
        startPoint: { x: 200, y: 330 },
        endPoint: { x: 300, y: 330 },
        tolerance: 45,
      },
    ],
  },
  {
    id: 'number-2',
    title: 'Số 2',
    category: 'numbers',
    difficulty: 'medium',
    strokes: [
      {
        order: 1,
        path: 'M150,145 C175,105 245,85 300,115 C355,145 350,205 300,235 C255,260 190,285 155,330 L345,330',
        startPoint: { x: 150, y: 145 },
        endPoint: { x: 345, y: 330 },
        tolerance: 55,
      },
    ],
  },
  {
    id: 'number-3',
    title: 'Số 3',
    category: 'numbers',
    difficulty: 'medium',
    strokes: [
      {
        order: 1,
        path: 'M155,120 C200,90 320,90 330,165 C335,210 285,225 240,225 C290,225 345,245 335,295 C325,355 205,350 155,315',
        startPoint: { x: 155, y: 120 },
        endPoint: { x: 155, y: 315 },
        tolerance: 55,
      },
    ],
  },
  {
    id: 'number-4',
    title: 'Số 4',
    category: 'numbers',
    difficulty: 'medium',
    strokes: [
      {
        order: 1,
        path: 'M300,90 L160,250',
        startPoint: { x: 300, y: 90 },
        endPoint: { x: 160, y: 250 },
        tolerance: 45,
      },
      {
        order: 2,
        path: 'M160,250 L345,250',
        startPoint: { x: 160, y: 250 },
        endPoint: { x: 345, y: 250 },
        tolerance: 45,
      },
      {
        order: 3,
        path: 'M300,90 L300,330',
        startPoint: { x: 300, y: 90 },
        endPoint: { x: 300, y: 330 },
        tolerance: 45,
      },
    ],
  },
  {
  id: 'number-5',
  title: 'Số 5',
  category: 'numbers',
  difficulty: 'medium',
  strokes: [
    {
      order: 1,
      path: 'M170,100 L170,205',
      startPoint: { x: 170, y: 100 },
      endPoint: { x: 170, y: 205 },
      tolerance: 45,
    },
    {
      order: 2,
      path: 'M170,205 C215,180 310,190 330,260 C350,330 245,360 165,305',
      startPoint: { x: 170, y: 205 },
      endPoint: { x: 165, y: 305 },
      tolerance: 60,
    },
    {
      order: 3,
      path: 'M170,100 L330,100',
      startPoint: { x: 170, y: 100 },
      endPoint: { x: 330, y: 100 },
      tolerance: 45,
    },
  ],
  },
  {
    id: 'number-6',
    title: 'Số 6',
    category: 'numbers',
    difficulty: 'medium',
    strokes: [
      {
        order: 1,
        path: 'M320,120 C260,80 160,115 145,215 C130,315 210,350 275,320 C335,292 330,220 265,205 C210,192 160,220 150,270',
        startPoint: { x: 320, y: 120 },
        endPoint: { x: 150, y: 270 },
        tolerance: 60,
      },
    ],
  },
  {
    id: 'number-7',
    title: 'Số 7',
    category: 'numbers',
    difficulty: 'easy',
    strokes: [
      {
        order: 1,
        path: 'M150,100 L345,100 L235,330',
        startPoint: { x: 150, y: 100 },
        endPoint: { x: 235, y: 330 },
        tolerance: 45,
      },
      {
        order: 2,
        path: 'M210,210 L295,210',
        startPoint: { x: 210, y: 210 },
        endPoint: { x: 295, y: 210 },
        tolerance: 45,
      },
    ],
  },
  {
    id: 'number-8',
    title: 'Số 8',
    category: 'numbers',
    difficulty: 'hard',
    strokes: [
        {
        order: 1,
        path: 'M240,90 C175,90 155,145 190,190 C215,220 265,220 290,250 C330,300 295,350 240,350 C185,350 150,300 190,250 C215,220 265,220 290,190 C325,145 305,90 240,90',
        startPoint: { x: 240, y: 90 },
        endPoint: { x: 240, y: 90 },
        tolerance: 65,
        },
    ],
  },
  {
    id: 'number-9',
    title: 'Số 9',
    category: 'numbers',
    difficulty: 'medium',
    strokes: [
        {
        order: 1,
        path: 'M300,170 C300,110 245,85 195,110 C145,135 145,215 195,240 C245,265 310,235 300,170 C315,225 300,290 230,330',
        startPoint: { x: 300, y: 170 },
        endPoint: { x: 230, y: 330 },
        tolerance: 60,
        },
    ],
},
    ];
