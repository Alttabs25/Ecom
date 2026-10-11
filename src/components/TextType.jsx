import { useEffect, useMemo, useState } from 'react';

export default function TextType({
  text,
  as: Component = 'span',
  typingSpeed = 75,
  initialDelay = 0,
  pauseDuration = 1500,
  deletingSpeed = 50,
  loop = true,
  className = '',
  showCursor = true,
  cursorCharacter = '_',
  cursorBlinkDuration = 0.5,
  ...props
}) {
  const textArray = useMemo(
    () => (Array.isArray(text) ? text : [text]).filter(Boolean),
    [text],
  );
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!textArray.length) return undefined;

    const currentText = textArray[textIndex] ?? '';
    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && displayedText === currentText) {
      if (!loop && textIndex === textArray.length - 1) return undefined;
      delay = pauseDuration;
    } else if (isDeleting && displayedText === '') {
      delay = 180;
    } else if (!displayedText && textIndex === 0) {
      delay += initialDelay;
    }

    const timeout = window.setTimeout(() => {
      if (!isDeleting && displayedText === currentText) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setTextIndex((index) => (index + 1) % textArray.length);
        return;
      }

      setDisplayedText(
        isDeleting
          ? currentText.slice(0, Math.max(0, displayedText.length - 1))
          : currentText.slice(0, displayedText.length + 1),
      );
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [
    displayedText,
    textIndex,
    isDeleting,
    textArray,
    typingSpeed,
    initialDelay,
    pauseDuration,
    deletingSpeed,
    loop,
  ]);

  return (
    <Component className={`text-type ${className}`.trim()} {...props}>
      <span className="text-type__content">{displayedText}</span>
      {showCursor && (
        <span
          className="text-type__cursor"
          style={{ '--cursor-blink-duration': `${cursorBlinkDuration}s` }}
          aria-hidden="true"
        >
          {cursorCharacter}
        </span>
      )}
    </Component>
  );
}
