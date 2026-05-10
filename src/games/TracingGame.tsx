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
  const [showStickerReward, setShowStickerReward] = useState(false);
  const [currentSticker, setCurrentSticker] = useState('⭐');

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

  const stickerOptions = ['⭐', '🌈', '🐝', '🐣', '🚗', '🎈', '🏆'];

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
    // Show sticker reward
    setCurrentSticker(stickerOptions[Math.floor(Math.random() * stickerOptions.length)]);
    setShowStickerReward(true);
    setTimeout(() => setShowStickerReward(false), 2000);
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

  const mascotImageSrc =
    mascotState === 'happy'
      ? '/mascot/pencil-happy.svg'
      : mascotState === 'retry'
      ? '/mascot/pencil-retry.svg'
      : mascotState === 'cheering'
      ? '/mascot/pencil-cheering.svg'
      : '/mascot/pencil-idle.svg';

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
          width: 96px;
          min-width: 96px;
          height: 96px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 28px;
          background: linear-gradient(180deg, #fff7e6 0%, #fde1a3 100%);
          border: 1px solid rgba(243, 156, 18, 0.2);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .mascot-card.idle,
        .mascot-card.thinking {
          animation: mascotFloat 4s ease-in-out infinite;
        }

        .mascot-card.happy {
          animation: mascotHappy 0.8s ease;
        }

        .mascot-card.retry {
          animation: mascotShake 0.45s ease;
        }

        .mascot-card.cheering {
          animation: mascotSparkle 1.6s ease-in-out infinite;
        }

        .mascot-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
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

        @keyframes mascotFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
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
            height: 72px;
          }

          .encouragement-panel {
            width: min(100%, 260px);
          }
        }

        .sticker-reward {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          animation: stickerPop 2s ease-out forwards;
          z-index: 110;
          max-width: min(90vw, 360px);
        }

        .sticker-emoji {
          font-size: 2.5rem;
          animation: stickerBounce 0.6s ease-out;
        }

        .sticker-text {
          font-size: 0.75rem;
          color: #2d5a3d;
          background: rgba(255, 255, 255, 0.95);
          padding: 4px 8px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          white-space: nowrap;
          font-weight: bold;
        }

        @keyframes stickerPop {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(20px);
          }
          20% {
            opacity: 1;
            transform: scale(1.1) translateY(-5px);
          }
          80% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translateY(-10px);
          }
        }

        @keyframes stickerBounce {
          0% {
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
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

      {showStickerReward && (
        <div className="sticker-reward" aria-hidden="true">
          <div className="sticker-emoji">{currentSticker}</div>
          <div className="sticker-text">Bé nhận được sticker!</div>
        </div>
      )}

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
          <div className="mascot-speech">
            {mascotState === 'retry'
              ? 'Thử lại nhé!'
              : mascotState === 'happy'
              ? 'Giỏi lắm!'
              : mascotState === 'cheering'
              ? 'Hoàn thành rồi!'
              : 'Bắt đầu nào!'}
          </div>
          <img className="mascot-image" src={mascotImageSrc} alt="" />
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