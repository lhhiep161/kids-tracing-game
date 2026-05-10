import type { TracingLevel } from '../levels';
import { allLevels } from '../levels';
import './Navigation.css';

interface NavigationProps {
  currentLevel: TracingLevel;
  currentStrokeNumber: number;
  onLevelChange: (level: TracingLevel) => void;
}

export default function Navigation({ currentLevel, currentStrokeNumber, onLevelChange }: NavigationProps) {
  const currentIndex = allLevels.findIndex(level => level.id === currentLevel.id);
  const totalLevels = allLevels.length;

  const goToPrev = () => {
    if (currentIndex > 0) {
      onLevelChange(allLevels[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < totalLevels - 1) {
      onLevelChange(allLevels[currentIndex + 1]);
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'numbers': return 'Số';
      case 'letters': return 'Chữ';
      case 'shapes': return 'Hình';
      default: return category;
    }
  };

  return (
    <div className="navigation">
      <button
        className="nav-button"
        onClick={goToPrev}
        disabled={currentIndex === 0}
      >
        <span className="nav-icon">⬅️</span>
        <span className="nav-text">Trước</span>
      </button>

      <div className="nav-center">
        <div className="nav-title">{currentLevel.title}</div>
        <div className="nav-progress">Nét {currentStrokeNumber} / {currentLevel.strokes.length}</div>
      </div>

      <button
        className="nav-button"
        onClick={goToNext}
        disabled={currentIndex === totalLevels - 1}
      >
        <span className="nav-text">Sau</span>
        <span className="nav-icon">➡️</span>
      </button>
    </div>
  );
}
