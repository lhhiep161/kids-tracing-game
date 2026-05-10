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
  const [mascotState, setMascotState] = useState<'idle' | 'thinking' | 'happy' | 'cheering' | 'retry'>('idle');
  const [encouragementMessage, setEncouragementMessage] = useState('Thử lại nhé!');
  const [encouragementType, setEncouragementType] = useState<'hint' | 'success'>('hint');
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const strokeSuccessMessages = [
    'Giỏi lắm!',
    'Tuyệt vời!',
    'Con làm đúng rồi!',
  ];

  const levelCompleteMessages = [
    'Hoàn thành xuất sắc!',
    'Chúc mừng con!',
    'Bài mới đang chờ con!',
  ];

  const retryMessages = [
    'Thử lại nhé!',
    'Gần đúng rồi!',
    'Đi tiếp nào!',
  ];

  const getRandomMessage = (messages: string[]) => {
    return messages[Math.floor(Math.random() * messages.length)];
  };

  useEffect(() => {
    setSoundEnabled(soundEnabled);
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const handleLevelChange = (level: TracingLevel) => {
    setCurrentLevel(level);
    setCurrentStrokeNumber(1);
    setShowLevelSelector(false);
    setMascotState('thinking');
    setEncouragementMessage('Bắt đầu nào!');
    setEncouragementType('hint');
  };

  const handleStrokeComplete = () => {
    setMascotState('happy');
    setEncouragementMessage(getRandomMessage(strokeSuccessMessages));
    setEncouragementType('success');
  };

  const handleStrokeRetry = () => {
    setMascotState('retry');
    setEncouragementMessage(getRandomMessage(retryMessages));
    setEncouragementType('hint');
  };

  const handleStrokeProgress = (strokeNumber: number) => {
    setCurrentStrokeNumber(strokeNumber);
  };

  const handleLevelComplete = () => {
    setMascotState('cheering');
    setEncouragementMessage(getRandomMessage(levelCompleteMessages));
    setEncouragementType('success');
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
      <style>{`
        .title-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          width: 100%;
          margin-bottom: 8px;
        }

        .game-title-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          min-width: 180px;
        }

        .encouragement-panel {
          min-height: 48px;
          padding: 10px 16px;
          border-radius: 999px;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
          font-size: clamp(0.9rem, 2vw, 1rem);
          line-height: 1.2;
          text-align: center;
          width: min(100%, 320px);
          transition: background 0.25s ease, transform 0.2s ease;
        }

        .encouragement-panel.hint {
          background: #fff7e2;
          color: #8f5d1e;
          border: 1px solid rgba(243, 156, 18, 0.35);
        }

        .encouragement-panel.success {
          background: #e9fff0;
          color: #1b6a3f;
          border: 1px solid rgba(46, 204, 113, 0.4);
        }

        .mascot-card {
          position: relative;
          width: 84px;
          min-width: 84px;
          height: 92px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 28px;
          background: linear-gradient(180deg, #fff7e6 0%, #fde1a3 100%);
          border: 1px solid rgba(243, 156, 18, 0.2);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.08);
          animation: none;
        }

        .mascot-card.idle {
          animation: none;
        }

        .mascot-card.thinking {
          animation: mascotPulse 2s ease-in-out infinite;
        }

        .mascot-card.happy {
          animation: mascotHappy 0.8s ease;
        }

        .mascot-card.retry {
          animation: mascotShake 0.5s ease;
        }

        .mascot-card.cheering {
          animation: mascotSparkle 1.5s ease-in-out infinite;
        }

        .mascot-speech {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-10px);
          white-space: nowrap;
          background: rgba(255, 255, 255, 0.95);
          color: #444;
          font-size: 0.75rem;
          padding: 7px 10px;
          border-radius: 18px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
          z-index: 5;
          pointer-events: none;
        }

        .mascot-speech::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid rgba(255, 255, 255, 0.95);
        }

        .mascot-card.cheering .mascot-face::before,
        .mascot-card.cheering .mascot-face::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #fff 20%, #f1c40f 100%);
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(241, 196, 15, 0.6);
        }

        .mascot-card.cheering .mascot-face::before {
          top: -8px;
          left: 6px;
        }

        .mascot-card.cheering .mascot-face::after {
          top: 4px;
          right: -10px;
        }

        .mascot-card.happy .mascot-mouth {
          width: 22px;
          height: 10px;
          bottom: 12px;
          border-radius: 0 0 999px 999px;
          background: #e66f46;
        }

        .mascot-card.retry .mascot-mouth {
          width: 16px;
          height: 6px;
          bottom: 16px;
          background: #e66f46;
          transform: rotate(180deg);
        }

        .mascot-card.cheering .mascot-mouth {
          width: 18px;
          height: 10px;
          bottom: 10px;
          border-radius: 0 0 999px 999px;
          background: #e74c3c;
        }

        .mascot-card.thinking .mascot-mouth {
          width: 10px;
          height: 4px;
          bottom: 16px;
          border-radius: 999px;
          background: #7f5f2c;
        }

        .mascot-card.retry .mascot-eye,
        .mascot-card.cheering .mascot-eye {
          transform: scale(1.05);
        }

        .mascot-card.thinking .mascot-face {
          box-shadow: inset 0 0 0 1px rgba(242, 169, 0, 0.15);
        }

        .mascot-face {
          position: relative;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #ffe3b6;
          border: 2px solid #f1b86a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mascot-eye {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4d4d4d;
          position: absolute;
          top: 18px;
        }

        .mascot-eye.left {
          left: 13px;
        }

        .mascot-eye.right {
          right: 13px;
        }

        .mascot-mouth {
          position: absolute;
          bottom: 14px;
          width: 18px;
          height: 8px;
          border-radius: 999px;
          background: #e66f46;
        }

        .mascot-cheek {
          position: absolute;
          left: 12px;
          bottom: 18px;
          width: 10px;
          height: 6px;
          border-radius: 999px;
          background: rgba(230, 118, 82, 0.35);
        }

        .mascot-pencil {
          margin-top: 8px;
          width: 26px;
          height: 28px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pencil-body {
          width: 14px;
          height: 18px;
          background: #f39c12;
          border-radius: 6px;
          position: absolute;
          top: 0;
        }

        .pencil-tip {
          position: absolute;
          bottom: -6px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 10px solid #d35400;
        }

        .pencil-band {
          position: absolute;
          top: 6px;
          width: 16px;
          height: 4px;
          background: #f1c40f;
          border-radius: 2px;
        }

        @keyframes mascotHappy {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px) scale(1.02);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes mascotShake {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-2px);
          }
          40% {
            transform: translateX(2px);
          }
          60% {
            transform: translateX(-2px);
          }
          80% {
            transform: translateX(2px);
          }
        }

        @keyframes mascotSparkle {
          0%,
          100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-3px);
            opacity: 0.85;
          }
        }

        @keyframes mascotPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.04);
          }
        }

        @media (max-width: 600px) {
          .title-row {
            gap: 10px;
          }

          .mascot-card {
            width: 72px;
            height: 80px;
          }

          .encouragement-panel {
            width: min(100%, 260px);
          }
        }
      `}</style>

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

      <div className="title-row">
        <div className="game-title-wrapper">
          <h1 className="game-title">🎨 Trò chơi vẽ nét</h1>
          <div className={`encouragement-panel ${encouragementType}`}>
            {encouragementMessage}
          </div>
        </div>

        <div className={`mascot-card ${mascotState}`} aria-hidden="true">
          <div className="mascot-speech">{mascotState === 'retry' ? 'Thử lại nhé!' : mascotState === 'happy' ? 'Giỏi lắm!' : mascotState === 'cheering' ? 'Hoàn thành rồi!' : 'Bắt đầu nào!'}</div>
          <div className="mascot-face">
            <div className="mascot-eye left" />
            <div className="mascot-eye right" />
            <div className="mascot-mouth" />
            <div className="mascot-cheek" />
          </div>
          <div className="mascot-pencil">
            <div className="pencil-body" />
            <div className="pencil-tip" />
            <div className="pencil-band" />
          </div>
        </div>
      </div>

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
        onStrokeRetry={handleStrokeRetry}
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