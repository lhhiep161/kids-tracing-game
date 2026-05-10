import { useRef, useState, useCallback, useEffect } from 'react';
import type { TracingLevel } from '../types/TracingTypes';
import StrokeRenderer from './StrokeRenderer';
import './TracingBoard.css';
import { AUDIO_PATHS, playSfx, startBackgroundMusic } from '../utils/audioManager';

interface TracingBoardProps {
  level: TracingLevel;
  onStrokeComplete: (strokeOrder: number) => void;
  onLevelComplete: () => void;
  onStrokeRetry?: () => void;
  onStrokeProgress?: (strokeNumber: number) => void;
}

interface Point {
  x: number;
  y: number;
}

const startEndTolerance = 60;
const pathTolerance = 50;
const pathSampleCount = 200;
const finishRatio = 0.65;

export default function TracingBoard({
  level,
  onStrokeComplete,
  onLevelComplete,
  onStrokeProgress,
  onStrokeRetry,
}: TracingBoardProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [completedStrokes, setCompletedStrokes] = useState<number[]>([]);
  const [userPaths, setUserPaths] = useState<{ [strokeOrder: number]: string }>({});
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [hint, setHint] = useState('Hãy bắt đầu từ chấm đỏ nhé!');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const currentStroke = level.strokes[currentStrokeIndex];

  const distance = (p1: Point, p2: Point) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  };

  const getSVGPoint = useCallback((clientX: number, clientY: number): Point => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };

    const pt = svg.createSVGPoint();

    // QUAN TRỌNG:
    // Không trừ rect.left/top ở đây.
    // getScreenCTM().inverse() cần tọa độ client thật.
    pt.x = clientX;
    pt.y = clientY;

    const matrix = svg.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };

    const svgPoint = pt.matrixTransform(matrix.inverse());

    return {
      x: svgPoint.x,
      y: svgPoint.y,
    };
  }, []);

  const getGuideSamples = (pathData: string): Point[] => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);

    const samples: Point[] = [];
    const totalLength = path.getTotalLength();

    for (let i = 0; i <= pathSampleCount; i++) {
      const length = (totalLength * i) / pathSampleCount;
      const point = path.getPointAtLength(length);
      samples.push({ x: point.x, y: point.y });
    }

    return samples;
  };

  const isPointNearGuide = (point: Point, guideSamples: Point[]) => {
    return guideSamples.some((guidePoint) => {
      return distance(point, guidePoint) <= pathTolerance;
    });
  };

  const checkPathCompletion = (userPoints: Point[], guideSamples: Point[]) => {
    if (userPoints.length < 5) return false;

    let validPoints = 0;

    userPoints.forEach((userPoint) => {
      if (isPointNearGuide(userPoint, guideSamples)) {
        validPoints++;
      }
    });

    const validRatio = validPoints / userPoints.length;
    return validRatio >= finishRatio;
  };

  const pointsToPath = (points: Point[]) => {
    return points.reduce((d, point, index) => {
      return d + (index === 0 ? `M${point.x},${point.y}` : ` L${point.x},${point.y}`);
    }, '');
  };

  const releasePointer = (e: React.PointerEvent<SVGSVGElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore safe release error
    }
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.preventDefault();

    if (!currentStroke) {
      setHint('Không tìm thấy nét vẽ hiện tại.');
      return;
    }

    const point = getSVGPoint(e.clientX, e.clientY);
    const startDistance = distance(point, currentStroke.startPoint);

    if (startDistance > startEndTolerance) {
      setHint('Hãy bắt đầu từ chấm đỏ nhé!');
      return;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore capture error
    }

    setIsDrawing(true);
    setCurrentPath([point]);
    setHint('Kéo theo đường chấm nhé!');
    startBackgroundMusic();
    playSfx(AUDIO_PATHS.sfx.tracingStart, 0.45);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    e.preventDefault();

    if (!isDrawing || !currentStroke) return;

    const point = getSVGPoint(e.clientX, e.clientY);
    setCurrentPath((prev) => {
      const lastPoint = prev[prev.length - 1];
      if (!lastPoint) {
        return [point];
      }

      const moveDistance = distance(point, lastPoint);
      if (moveDistance < 3) {
        return prev;
      }

      return [...prev, point];
    });
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    e.preventDefault();

    if (!isDrawing || !currentStroke) {
      releasePointer(e);
      return;
    }

    const endPoint = getSVGPoint(e.clientX, e.clientY);
    const finalPath = [...currentPath, endPoint];

    setIsDrawing(false);
    releasePointer(e);

    const endDistance = distance(endPoint, currentStroke.endPoint);

    if (finalPath.length < 5) {
      playSfx(AUDIO_PATHS.sfx.wrong, 0.45);
      setHint('Bé hãy kéo theo đường chấm nhé!');
      onStrokeRetry?.();
      setCurrentPath([]);
      return;
    }

    if (endDistance > startEndTolerance) {
      playSfx(AUDIO_PATHS.sfx.wrong, 0.45);
      setHint('Chưa tới được chấm đỏ cuối cùng. Cố gắng lại nhé!');
      onStrokeRetry?.();
      setCurrentPath([]);
      return;
    }

    const guideSamples = getGuideSamples(currentStroke.path);
    const isComplete = checkPathCompletion(finalPath, guideSamples);

    if (!isComplete) {
      playSfx(AUDIO_PATHS.sfx.wrong, 0.45);
      setHint('Bé hãy đi sát theo đường chấm nhé!');
      onStrokeRetry?.();
      setCurrentPath([]);
      return;
    }

    const pathD = pointsToPath(finalPath);

    setUserPaths((prev) => ({
      ...prev,
      [currentStroke.order]: pathD,
    }));

    setCompletedStrokes((prev) => [...prev, currentStroke.order]);
    playSfx(AUDIO_PATHS.sfx.strokeSuccess, 0.6);
    onStrokeComplete(currentStroke.order);

    if (currentStrokeIndex < level.strokes.length - 1) {
      setCurrentStrokeIndex((prev) => prev + 1);
      setHint('Tốt lắm! Sang nét tiếp theo nhé!');
    } else {
      setHint('Hoàn thành rồi!');
      playSfx(AUDIO_PATHS.sfx.levelComplete, 0.75);
      onLevelComplete();
    }

    setCurrentPath([]);
  };

  const handlePointerCancel = (e: React.PointerEvent<SVGSVGElement>) => {
    e.preventDefault();
    setIsDrawing(false);
    setCurrentPath([]);
    releasePointer(e);
  };

  useEffect(() => {
    if (onStrokeProgress) {
      onStrokeProgress(currentStrokeIndex + 1);
    }
  }, [currentStrokeIndex, onStrokeProgress]);

  useEffect(() => {
    if (completedStrokes.length === level.strokes.length && completedStrokes.length > 0) {
      setShowSuccessOverlay(true);
      const timer = setTimeout(() => {
        setShowSuccessOverlay(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [completedStrokes, level.strokes.length]);

  const handleReset = () => {
    setCurrentStrokeIndex(0);
    setCompletedStrokes([]);
    setUserPaths({});
    setCurrentPath([]);
    setIsDrawing(false);
    setHint('Hãy bắt đầu từ chấm đỏ nhé!');
  };

  return (
    <div className="tracing-board">
      <svg
        ref={svgRef}
        viewBox="0 0 500 400"
        className="canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handlePointerCancel}
        onContextMenu={(e) => e.preventDefault()}
      >
        <defs>
          <filter id="drawingGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="completedGlow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <StrokeRenderer
          strokes={level.strokes}
          currentStrokeIndex={currentStrokeIndex}
          completedStrokes={completedStrokes}
          userPaths={userPaths}
        />

        {isDrawing && currentPath.length > 1 && (
          <>
            <path
              d={pointsToPath(currentPath)}
              fill="none"
              className="current-drawing-glow"
              pointerEvents="none"
            />
            <path
              d={pointsToPath(currentPath)}
              fill="none"
              className="current-drawing-main"
              pointerEvents="none"
            />
          </>
        )}
      </svg>

      <div className="board-hint">{hint}</div>

      <div className="board-controls">
        <button onClick={handleReset} className="reset-button">
          🔄 Làm lại
        </button>
      </div>

      {showSuccessOverlay && (
        <div className="success-overlay">
          <div className="success-message">Hoàn thành!</div>
        </div>
      )}
    </div>
  );
}