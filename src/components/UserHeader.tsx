import { useState } from 'react';
import './UserHeader.css';

interface User {
  name: string;
  avatarUrl: string;
}

interface UserHeaderProps {
  user: User;
}

export default function UserHeader({ user }: UserHeaderProps) {
  const [imageError, setImageError] = useState(false);
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const handleImageError = () => {
    console.warn(`Không thể load ảnh: ${user.avatarUrl}. Dùng fallback avatar.`);
    setImageError(true);
  };

  return (
    <div className="user-header">
      <div className="avatar-shell">
        {!imageError ? (
          <img
            src={user.avatarUrl}
            alt={`Avatar ${user.name}`}
            className="avatar-image"
            onError={handleImageError}
          />
        ) : (
          <div className="avatar-fallback">{initials || '🙂'}</div>
        )}
      </div>

      <div className="user-text">
        <div className="user-hello">Xin chào</div>
        <div className="user-name">{user.name}</div>
      </div>
    </div>
  );
}
