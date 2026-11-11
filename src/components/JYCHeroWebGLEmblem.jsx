
import './JYCHeroWebGLEmblem.css';

const LOGO_SRC = '/assets/jyc-logo.avif';
const LOGO_FALLBACK = '/assets/jyc-logo.webp';
const LOGO_ORIGINAL = '/JYC%20Logo(4).png';

export function JYCHeroWebGLEmblem() {
  const containerRef = useRef(null);

  const handlePointerMove = event => {
    const stage = containerRef.current;
    if (!stage || !window.matchMedia?.('(hover:hover) and (pointer:fine)').matches
      || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      || document.documentElement.dataset.jycMotion === 'paused') return;
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

        <div className="jyc-emblem-glow-backing" aria-hidden="true" />
        <div className="jyc-emblem-seal-container">
          <img src={LOGO_SRC}
            srcSet={import.meta.env.PROD ? "/assets/jyc-logo-270.avif 270w, /assets/jyc-logo-320.avif 320w, /assets/jyc-logo.avif 480w" : undefined}
            sizes="(max-width: 680px) 250px, (max-width: 1024px) 340px, 430px"
            alt="JIIT Youth Club official crest" className="jyc-emblem-logo-img"
            width="480" height="480" loading="eager" fetchPriority="high" decoding="async"
            onError={event => {
              const image = event.currentTarget;
              image.removeAttribute('srcset');
              const stage = Number(image.dataset.logoFallbackStage || 0);
              const candidates = [LOGO_FALLBACK, LOGO_ORIGINAL];
              if (stage < candidates.length) {
                image.dataset.logoFallbackStage = String(stage + 1);
                image.src = candidates[stage];
              } else {
                const fallback = document.createElement('span');
                fallback.className = 'jyc-emblem-logo-fallback';
                fallback.textContent = 'JYC';
                image.replaceWith(fallback);
              }
            }} />
        </div>
      </div>

    </div>
  );
}
