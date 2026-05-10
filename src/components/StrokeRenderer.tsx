import type { Stroke } from '../types/TracingTypes';

interface StrokeRendererProps {
  strokes: Stroke[];
  currentStrokeIndex: number;
  completedStrokes: number[];
  userPaths: { [strokeOrder: number]: string };
}

export default function StrokeRenderer({
  strokes,
  currentStrokeIndex,
  completedStrokes,
  userPaths,
}: StrokeRendererProps) {
  return (
    <g>
      {strokes.map((stroke, index) => {
        const isCurrent = index === currentStrokeIndex;
        const isCompleted = completedStrokes.includes(stroke.order);
        const isUpcoming = index > currentStrokeIndex;

        const opacity = isUpcoming ? 0.3 : 1;

        return (
          <g key={`guide-${stroke.order}`} opacity={opacity}>
            <path
              d={stroke.path}
              fill="none"
              stroke={isCompleted ? '#b7e4c7' : '#b8b8b8'}
              strokeWidth={34}
              strokeLinecap="round"
              strokeLinejoin="round"
              pointerEvents="none"
            />

            {!isCompleted && (
              <path
                d={stroke.path}
                fill="none"
                stroke={isCurrent ? '#333333' : '#777777'}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1 11"
                pointerEvents="none"
              />
            )}
          </g>
        );
      })}

      {Object.entries(userPaths).map(([strokeOrder, path]) => (
        <g key={`user-${strokeOrder}`} pointerEvents="none">
          <path
            d={path}
            fill="none"
            className="completed-path-glow"
          />
          <path
            d={path}
            fill="none"
            className="completed-path-main"
          />
        </g>
      ))}

      {strokes.map((stroke, index) => {
        const isCurrent = index === currentStrokeIndex;
        const isCompleted = completedStrokes.includes(stroke.order);

        if (!isCurrent && !isCompleted) return null;

        return (
          <g key={`points-${stroke.order}`} pointerEvents="none">
            <circle
              cx={stroke.startPoint.x}
              cy={stroke.startPoint.y}
              r={11}
              fill={isCompleted ? '#4CAF50' : '#d9272e'}
              stroke="#ffffff"
              strokeWidth={3}
              className={isCurrent && !isCompleted ? 'current-start-point' : undefined}
            />
            <circle
              cx={stroke.endPoint.x}
              cy={stroke.endPoint.y}
              r={11}
              fill={isCompleted ? '#4CAF50' : '#d9272e'}
              stroke="#ffffff"
              strokeWidth={3}
            />
          </g>
        );
      })}
    </g>
  );
}