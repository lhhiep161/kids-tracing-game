import { useState, useEffect } from 'react';
import UserHeader from '../components/UserHeader';
import Navigation from '../components/Navigation';
import LevelSelector from '../components/LevelSelector';
import TracingBoard from '../components/TracingBoard';
import type { TracingLevel } from '../levels';
import { allLevels, getNextLevel, getLevelsByCategory } from '../levels';
import { setSoundEnabled } from '../utils/audioManager';
import './TracingGame.css';

const currentUser = {
  name: 'Hoàng Minh',
  avatarUrl: '/images/anh_dai_dien.jpg',
};

export default function TracingGame() {
  const [currentLevel, setCurrentLevel] = useState<TracingLevel>(allLevels[0]);
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
  const [showStickerCollection, setShowStickerCollection] = useState(false);
  const [collectedStickers, setCollectedStickers] = useState<string[]>(() => {
    const saved = localStorage.getItem('collectedStickers');
    return saved ? JSON.parse(saved) : [];
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

  const stickerOptions = ['⭐', '🌈', '🐝', '🐣', '🚗', '🎈', '🏆'];

  const getRandomMessage = (messages: string[]) => {
    return messages[Math.floor(Math.random() * messages.length)];
  };

  useEffect(() => {
    setSoundEnabled(soundEnabled);
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('collectedStickers', JSON.stringify(collectedStickers));
  }, [collectedStickers]);

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
    const newSticker = stickerOptions[Math.floor(Math.random() * stickerOptions.length)];
    setCurrentSticker(newSticker);
    setShowStickerReward(true);
    // Add to collection (avoid duplicates)
    setCollectedStickers(prev => {
      const uniqueStickers = new Set(prev);
      uniqueStickers.add(newSticker);
      return Array.from(uniqueStickers);
    });
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

  const handleCategorySelect = (category: string) => {
    const levels = getLevelsByCategory(category);
    if (levels.length > 0) {
      setSelectedCategory(category);
      setCurrentLevel(levels[0]);
      setCurrentStrokeNumber(1);
    }
  };

  const handleBackToWorldMap = () => {
    setSelectedCategory(null);
  };

  const zones = [
    { id: 'basic', icon: '✏️', label: 'Vườn nét' },
    { id: 'numbers', icon: '🔢', label: 'Thành phố số' },
    { id: 'letters', icon: '🔤', label: 'Rừng chữ' },
    { id: 'shapes', icon: '🎨', label: 'Xưởng hình' },
    { id: 'objects', icon: '🏠', label: 'Thế giới vật' }
  ];

  const toggleStickerCollection = () => {
    setShowStickerCollection(prev => !prev);
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

        .sticker-collection-button {
          position: absolute;
          top: 8px;
          right: 56px;
          height: 40px;
          padding: 0 10px;
          border: none;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          font-size: 0.9rem;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          z-index: 99;
          white-space: nowrap;
        }

        .sticker-collection-button:hover {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: scale(1.05);
        }

        .sticker-collection-button:active {
          transform: scale(0.95);
        }

        @media (max-width: 600px) {
          .sticker-collection-button {
            right: 52px;
            padding: 0 8px;
            font-size: 0.85rem;
          }
        }

        .sticker-collection-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          pointer-events: auto;
          animation: fadeIn 0.2s ease-out;
        }

        .sticker-collection-panel {
          position: relative;
          background: white;
          border-radius: 20px;
          padding: 20px;
          max-width: min(90vw, 400px);
          max-height: 80svh;
          overflow-y: auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          animation: panelSlideUp 0.3s ease-out;
        }

        .sticker-panel-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border: none;
          background: rgba(0, 0, 0, 0.1);
          color: #333;
          font-size: 1.2rem;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sticker-panel-close:hover {
          background: rgba(0, 0, 0, 0.2);
          transform: scale(1.1);
        }

        .sticker-panel-title {
          margin: 0 0 16px 0;
          font-size: 1.5rem;
          color: #333;
          text-align: center;
          font-weight: bold;
        }

        .sticker-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
          gap: 8px;
          padding: 8px 0;
        }

        .sticker-grid-item {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          padding: 8px;
          background: rgba(255, 215, 0, 0.1);
          border-radius: 12px;
          border: 2px solid rgba(255, 215, 0, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sticker-grid-item:hover {
          transform: scale(1.15);
          background: rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.6);
        }

        .sticker-empty {
          text-align: center;
          color: #999;
          font-size: 1rem;
          padding: 32px 16px;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes panelSlideUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .world-map-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 20px;
          width: 100%;
          flex: 1;
          overflow-y: auto;
        }

        .world-map-title {
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          color: #333;
          margin: 0;
          text-align: center;
        }

        .zones-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          padding: 0 8px;
          max-width: 600px;
          width: 100%;
        }

        .zone-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 20px;
          border: none;
          border-radius: 16px;
          background: linear-gradient(135deg, #ffd4e5 0%, #ffb7d9 100%);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          font-family: Arial, sans-serif;
          min-height: 140px;
        }

        .zone-card:nth-child(2) {
          background: linear-gradient(135deg, #ffe5b4 0%, #ffd999 100%);
        }

        .zone-card:nth-child(3) {
          background: linear-gradient(135deg, #d4f1ff 0%, #b7e1ff 100%);
        }

        .zone-card:nth-child(4) {
          background: linear-gradient(135deg, #e5d4ff 0%, #d9b7ff 100%);
        }

        .zone-card:nth-child(5) {
          background: linear-gradient(135deg, #d4ffe5 0%, #b7ffc9 100%);
        }

        .zone-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .zone-card:active {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .zone-icon {
          font-size: 3.5rem;
          animation: zoneIconFloat 2s ease-in-out infinite;
        }

        .zone-card:nth-child(2) .zone-icon {
          animation-delay: 0.2s;
        }

        .zone-card:nth-child(3) .zone-icon {
          animation-delay: 0.4s;
        }

        .zone-card:nth-child(4) .zone-icon {
          animation-delay: 0.6s;
        }

        .zone-card:nth-child(5) .zone-icon {
          animation-delay: 0.8s;
        }

        .zone-label {
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          font-weight: bold;
          color: #333;
          text-align: center;
          word-break: break-word;
        }

        @keyframes zoneIconFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .back-to-map-button {
          font-size: 0.95rem;
          font-weight: bold;
          padding: 8px 16px;
          border: none;
          border-radius: 20px;
          background: rgba(0, 0, 0, 0.1);
          color: #333;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-to-map-button:hover {
          background: rgba(0, 0, 0, 0.15);
          transform: scale(1.05);
        }

        @media (max-width: 600px) {
          .zones-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            padding: 0 4px;
          }

          .zone-card {
            padding: 16px;
            min-height: 120px;
            gap: 8px;
          }

          .zone-icon {
            font-size: 2.8rem;
          }

          .zone-label {
            font-size: 0.9rem;
          }

          .world-map-title {
            font-size: 1.6rem;
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

      <button
        className="sticker-collection-button"
        onClick={toggleStickerCollection}
        title="Xem bộ sưu tập sticker"
        aria-label="Xem bộ sưu tập sticker"
      >
        🎒 {collectedStickers.length}
      </button>

      <UserHeader user={currentUser} />

      {showStickerCollection && (
        <div className="sticker-collection-overlay" aria-hidden="true">
          <div className="sticker-collection-panel">
            <button
              className="sticker-panel-close"
              onClick={toggleStickerCollection}
              aria-label="Đóng"
            >
              ✕
            </button>
            <h2 className="sticker-panel-title">Bộ Sưu Tập Sticker</h2>
            {collectedStickers.length > 0 ? (
              <div className="sticker-grid">
                {collectedStickers.map((sticker, index) => (
                  <div key={index} className="sticker-grid-item">
                    {sticker}
                  </div>
                ))}
              </div>
            ) : (
              <div className="sticker-empty">Chưa có sticker nào</div>
            )}
          </div>
        </div>
      )}

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

      {selectedCategory === null && (
        <div className="world-map-container">
          <h1 className="world-map-title">🌍 Bản đồ Thế giới</h1>
          <div className="zones-grid">
            {zones.map(zone => (
              <button
                key={zone.id}
                className="zone-card"
                onClick={() => handleCategorySelect(zone.id)}
                aria-label={zone.label}
              >
                <div className="zone-icon">{zone.icon}</div>
                <div className="zone-label">{zone.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedCategory !== null && <>
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
        {selectedCategory !== null && (
          <button onClick={handleBackToWorldMap} className="back-to-map-button">
            🌍 Quay lại
          </button>
        )}
      </div>
      </>}
    </div>
  );
}