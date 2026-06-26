"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  formatFn?: (val: number) => string;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.2,
  className = "",
  formatFn,
}: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!nodeRef.current || hasAnimated) return;
    setHasAnimated(true);

    const node = nodeRef.current;
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate(latest) {
        const rounded = Math.round(latest);
        const display = formatFn ? formatFn(rounded) : rounded.toLocaleString("en-US");
        node.textContent = `${prefix}${display}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [value, prefix, suffix, duration, formatFn, hasAnimated]);

  const defaultDisplay = formatFn
    ? formatFn(value)
    : value.toLocaleString("en-US");

  return (
    <span ref={nodeRef} className={className}>
      {prefix}
      {defaultDisplay}
      {suffix}
    </span>
  );
}
