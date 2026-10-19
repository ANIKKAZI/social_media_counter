import React, { useEffect, useState } from 'react';

/* In the "split" layout only the outer 34% of the panorama is shown on each side, because the
   reference artwork has a follower panel baked into the middle (see .tp-stage--split in puzzle.css). */
function Img({ src, className, onLoad, onError }) {
  return <img className={`tp-img ${className}`} src={src} alt="" draggable={false} onLoad={onLoad} onError={onError} />;
}

/**
 * Background artwork only. Counts, QR code and text are rendered by the caller,
 * so the follower count can change without regenerating the image.
 */
export default function PuzzleCityscape({
  incompleteImage,
  completedImage,
  isComplete,
  variant = 'band',
  alt,
  children,
}) {
  const [baseLoaded, setBaseLoaded] = useState(false);
  const [baseFailed, setBaseFailed] = useState(false);
  const [completeReady, setCompleteReady] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    setBaseLoaded(false);
    setBaseFailed(false);
  }, [incompleteImage]);

  // The completed artwork is only fetched once it is needed, to keep small screens light.
  useEffect(() => {
    if (!isComplete) {
      setCompleteReady(false);
      return undefined;
    }
    let cancelled = false;
    const img = new Image();
    img.onload = () => { if (!cancelled) setCompleteReady(true); };
    img.onerror = () => { if (!cancelled) setCompleteReady(false); };
    img.src = completedImage;
    return () => { cancelled = true; };
  }, [isComplete, completedImage]);

  useEffect(() => {
    if (!completeReady) return undefined;
    setCelebrating(true);
    const id = setTimeout(() => setCelebrating(false), 2600);
    return () => clearTimeout(id);
  }, [completeReady]);

  const rootClass = [
    'tp-stage',
    `tp-stage--${variant}`,
    celebrating ? 'tp-stage--celebrate' : '',
    !baseLoaded && !baseFailed ? 'tp-stage--loading' : '',
  ].filter(Boolean).join(' ');

  const layers = (
    <>
      {!baseFailed && (
        <Img
          src={incompleteImage}
          className="tp-img--incomplete"
          onLoad={() => setBaseLoaded(true)}
          onError={() => setBaseFailed(true)}
        />
      )}
      {completeReady && <Img src={completedImage} className="tp-img--complete" />}
    </>
  );

  return (
    <div className={rootClass}>
      {variant === 'band' && (
        <>
          <div className="tp-ext tp-ext--top" aria-hidden="true">
            <div className="tp-ext__img" style={{ backgroundImage: `url(${completedImage})` }} />
          </div>
          <div className="tp-ext tp-ext--bottom" aria-hidden="true">
            <div className="tp-ext__img" style={{ backgroundImage: `url(${completedImage})` }} />
          </div>
        </>
      )}
      <div className="tp-art" role="img" aria-label={alt} aria-busy={!baseLoaded && !baseFailed}>
        {variant === 'split' ? (
          <>
            <div className="tp-slice tp-slice--left">{layers}</div>
            <div className="tp-slice tp-slice--right">{layers}</div>
          </>
        ) : layers}
        {baseFailed && <div className="tp-art-error">Artwork unavailable</div>}
      </div>
      {children}
    </div>
  );
}
