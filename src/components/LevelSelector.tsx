import { useState } from 'react';
import type { TracingLevel } from '../levels';
import { levelsByCategory } from '../levels';
import './LevelSelector.css';

interface LevelSelectorProps {
  currentLevel: TracingLevel;
  onLevelSelect: (level: TracingLevel) => void;
}

type Category = 'basic' | 'numbers' | 'letters' | 'shapes' | 'objects';

const categoryInfo = {
  basic: { name: 'Nét', icon: '✏️' },
  numbers: { name: 'Số', icon: '🔢' },
  letters: { name: 'Chữ', icon: '🔤' },
  shapes: { name: 'Hình', icon: '🎨' },
  objects: { name: 'Vật', icon: '🏠' },
};

export default function LevelSelector({ currentLevel, onLevelSelect }: LevelSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<Category>(
    currentLevel.category as Category
  );

  const currentLevels = levelsByCategory[activeCategory];

  return (
    <div className="level-selector">
      <div className="category-tabs">
        {(Object.keys(categoryInfo) as Category[]).map((category) => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            <span className="category-icon">{categoryInfo[category].icon}</span>
            <span className="category-name">{categoryInfo[category].name}</span>
          </button>
        ))}
      </div>

      <div className="levels-grid">
        {currentLevels.map((level) => (
          <button
            key={level.id}
            className={`level-button ${currentLevel.id === level.id ? 'current' : ''}`}
            onClick={() => onLevelSelect(level)}
          >
            <div className="level-preview">
              <svg
                viewBox="0 0 500 400"
                className="level-svg"
              >
                {level.strokes.map((stroke, index) => (
                  <path
                    key={index}
                    d={stroke.path}
                    className="level-path"
                    stroke="#667eea"
                    strokeWidth="3"
                    fill="none"
                    opacity={index === 0 ? 1 : 0.3}
                  />
                ))}
                {level.strokes.length > 0 && (
                  <>
                    <circle
                      cx={level.strokes[0].startPoint.x}
                      cy={level.strokes[0].startPoint.y}
                      r="8"
                      className="level-start"
                    />
                    <circle
                      cx={level.strokes[level.strokes.length - 1].endPoint.x}
                      cy={level.strokes[level.strokes.length - 1].endPoint.y}
                      r="8"
                      className="level-end"
                    />
                  </>
                )}
              </svg>
            </div>
            <div className="level-name">{level.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
