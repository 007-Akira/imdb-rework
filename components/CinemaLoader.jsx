import './CinemaLoader.css';
// Server-compatible cinema loader. variant: 'overlay' (fixed, full screen) or 'inline' (fills part of a page).
export default function CinemaLoader({ variant = 'inline', exiting = false, label = 'Loading' }) {
    return <div role="status" aria-live="polite" aria-label={`${label}…`} className={`cl-root cl-${variant}${exiting ? ' cl-exiting' : ''}`}>
    <div className="cl-stage">
      <div className="cl-countdown" aria-hidden="true">
        <div className="cl-sweep"/>
        <svg className="cl-dial" viewBox="0 0 200 200" focusable="false">
          <line className="cl-cross" x1="100" y1="6" x2="100" y2="194"/>
          <line className="cl-cross" x1="6" y1="100" x2="194" y2="100"/>
          <circle className="cl-ring-inner" cx="100" cy="100" r="78"/>
          <circle className="cl-ring" cx="100" cy="100" r="96"/>
          <circle className="cl-trace" cx="100" cy="100" r="96" pathLength="100" transform="rotate(-90 100 100)"/>
        </svg>
        <span className="cl-number cl-number-3">3</span>
        <span className="cl-number cl-number-2">2</span>
        <span className="cl-number cl-number-1">1</span>
      </div>
      <div className="cl-strip" aria-hidden="true"><div className="cl-strip-track"/></div>
      <p className="cl-label">{label}<span aria-hidden="true"><span className="cl-dot">.</span><span className="cl-dot">.</span><span className="cl-dot">.</span></span></p>
    </div>
  </div>;
}
