
import './HeartIcon.css';

interface HeartIconProps {
  isFavorited: boolean;
  onToggle: () => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  disabled?: boolean;
}

export default function HeartIcon({ 
  isFavorited, 
  onToggle, 
  size = 'medium', 
  className = '',
  disabled = false 
}: HeartIconProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      onToggle();
    }
  };

  return (
    <button
      className={`heart-icon heart-icon--${size} ${className} ${disabled ? 'heart-icon--disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      type="button"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="heart-icon__svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          className={`heart-icon__path ${isFavorited ? 'heart-icon__path--filled' : 'heart-icon__path--empty'}`}
        />
      </svg>
    </button>
  );
}
