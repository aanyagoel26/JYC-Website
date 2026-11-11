import React, { Children, useId, useRef, useState } from 'react';
import './FlipCard.css';

/**
 * Accessible two-face profile card.
 * The photo face is a real button; the details face contains its own links and close button.
 * This avoids nesting interactive links inside a button-like card container.
 */
export default function FlipCard({ front, back, children, className = '', label = 'Open profile' }) {
  const [flipped, setFlipped] = useState(false);
  const backRef = useRef(null);
  const frontTriggerRef = useRef(null);
  const backId = useId();
  const faces = Children.toArray(children);
  const frontContent = front ?? faces[0] ?? null;
  const backContent = back ?? faces[1] ?? null;

  const openProfile = () => {
    setFlipped(true);
    requestAnimationFrame(() => backRef.current?.focus({ preventScroll: true }));
  };

  const closeProfile = event => {
    event.stopPropagation();
    setFlipped(false);
    requestAnimationFrame(() => frontTriggerRef.current?.focus({ preventScroll: true }));
  };

  const handlePointerEnter = event => {
    // Hover is a progressive enhancement for mouse/pen; touch continues to use tap.
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      setFlipped(true);
    }
  };

  const handlePointerLeave = event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      setFlipped(false);
    }
  };

  const handleKeyDown = event => {
    if (event.key === 'Escape' && flipped) {
      event.preventDefault();
      closeProfile(event);
    }
  };

  return (
    <div
      className={`flip-card ${flipped ? 'is-flipped' : ''} ${className}`.trim()}
      role="group"
      aria-label={label}
      data-flipped={flipped ? 'true' : 'false'}
      onKeyDown={handleKeyDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div className="flip-card__inner">
        <div
          className="flip-card__face flip-card__front"
          aria-hidden={flipped}
          inert={flipped}
        >
          <button
            ref={frontTriggerRef}
            type="button"
            className="flip-card__front-trigger"
            aria-expanded={flipped}
            aria-controls={backId}
            onClick={openProfile}
          >
            {frontContent}
          </button>
        </div>

        <div
          id={backId}
          ref={backRef}
          tabIndex={-1}
          role="group"
          aria-label="Profile details"
          className="flip-card__face flip-card__back"
          aria-hidden={!flipped}
          inert={!flipped}
        >
          {backContent}
          <button
            type="button"
            className="flip-card__back-trigger"
            onClick={closeProfile}
          >
            ← Back to photo
          </button>
        </div>
      </div>
      <span className="flip-card__sr-only" aria-live="polite">
        {flipped ? 'Profile details shown.' : 'Photo shown.'}
      </span>
    </div>
  );
}
