import { useEffect, useRef, useState } from "react";

/**
 * Hook that returns a ref and whether the element is in view.
 * @param {Object} options - IntersectionObserver options
 * @param {boolean} once - Only trigger once (default: true)
 */
export function useScrollReveal(options = {}, once = true) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: "-60px 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return [ref, isVisible];
}