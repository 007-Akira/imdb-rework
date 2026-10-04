// A template re-mounts on every navigation (unlike layout), so each page gets a fresh entrance animation.
export default function Template({ children }) { return <div className="anim-page">{children}</div>; }
