'use client';
import { useEffect, useRef, useState } from 'react';
// Fades and lifts its children into view the first time they scroll on screen.
export default function Reveal({ as: Tag = 'div', className = '', children, ...props }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const node = ref.current;
        if (!node)
            return;
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
        } }, { rootMargin: '0px 0px -10% 0px' });
        observer.observe(node);
        return () => observer.disconnect();
    }, []);
    return <Tag ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} {...props}>{children}</Tag>;
}
