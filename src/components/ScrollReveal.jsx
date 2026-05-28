import { useEffect, useRef } from "react";

/**
 * Wraps children with a scroll-triggered reveal animation.
 * variant: "up" | "left" | "right" | "scale" | "stagger"
 * delay: CSS delay string e.g. "0.2s"
 */
export default function ScrollReveal({
  children,
  variant = "up",
  delay = "0s",
  className = "",
  as: Tag = "div",
  threshold = 0.12,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const variantClass = {
      up: "reveal",
      left: "reveal-left",
      right: "reveal-right",
      scale: "reveal-scale",
      stagger: "reveal-stagger",
    }[variant] || "reveal";

    el.classList.add(variantClass);
    el.style.transitionDelay = delay;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "-50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [variant, delay, threshold]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}