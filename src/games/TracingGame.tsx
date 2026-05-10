import { useState, useEffect } from 'react';
import UserHeader from '../components/UserHeader';
import Navigation from '../components/Navigation';
import LevelSelector from '../components/LevelSelector';
import TracingBoard from '../components/TracingBoard';
import type { TracingLevel } from '../levels';
import { allLevels, getNextLevel } from '../levels';
import { setSoundEnabled } from '../utils/audioManager';
import './TracingGame.css';

const currentUser = {
  name: 'Hoàng Minh',
  avatarUrl: '/images/anh_dai_dien.jpg',
};

export default function TracingGame() {
  const [currentLevel, setCurrentLevel] = useState<TracingLevel>(allLevels[0]);
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [currentStrokeNumber, setCurrentStrokeNumber] = useState(1);
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    setSoundEnabled(soundEnabled);
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const handleLevelChange = (level: TracingLevel) => {
    setCurrentLevel(level);
    setCurrentStrokeNumber(1);
    setShowLevelSelector(false);
  };

  const handleStrokeComplete = () => {
    // Feedback hiện trong board hint, không làm layout bên ngoài nhảy.
  };

  const handleStrokeProgress = (strokeNumber: number) => {
    setCurrentStrokeNumber(strokeNumber);
  };

  const handleLevelComplete = () => {
    setTimeout(() => {
      const nextLevel = getNextLevel(currentLevel.id);
      if (nextLevel) {
        handleLevelChange(nextLevel);
      }
    }, 3000);
  };

  const toggleLevelSelector = () => {
    setShowLevelSelector(prev => !prev);
  };

  const toggleSound = () => {
    setSoundEnabledState((prev: boolean) => !prev);
  };

  return (
    <div className="tracing-game-container">
      <button
        className="sound-toggle-button"
        onClick={toggleSound}
        title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>

      <UserHeader user={currentUser} />

      <Navigation
        currentLevel={currentLevel}
        currentStrokeNumber={currentStrokeNumber}
        onLevelChange={handleLevelChange}
      />

      <h1 className="game-title">🎨 Trò chơi vẽ nét</h1>

      {showLevelSelector && (
        <LevelSelector
          currentLevel={currentLevel}
          onLevelSelect={handleLevelChange}
        />
      )}

      <TracingBoard
        key={currentLevel.id}
        level={currentLevel}
        onStrokeComplete={handleStrokeComplete}
        onLevelComplete={handleLevelComplete}
        onStrokeProgress={handleStrokeProgress}
      />

      <div className="action-buttons">
        <button onClick={toggleLevelSelector} className="level-select-button">
          {showLevelSelector ? '🔽 Ẩn danh sách' : '🔼 Chọn bài'}
        </button>
      </div>
    </div>
  );
}