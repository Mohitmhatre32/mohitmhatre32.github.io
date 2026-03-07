import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const addRipple = useCallback((x: number, y: number) => {
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 800);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };

      // Update glass card glow positions
      document.querySelectorAll('.glass-card').forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        (card as HTMLElement).style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    };

    const onDown = (e: MouseEvent) => {
      setIsClicking(true);
      addRipple(e.clientX, e.clientY);
    };
    const onUp = () => setIsClicking(false);

    const checkHover = () => {
      const el = document.elementFromPoint(target.current.x, target.current.y);
      const interactive = el?.closest('a, button, [role="button"], input, textarea, .magnetic-btn');
      setIsHovering(!!interactive);
    };

    let animId: number;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x - 6}px, ${pos.current.y - 6}px)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pos.current.x - 20}px, ${pos.current.y - 20}px)`;
      }
      if (trailRef.current) {
        const tx = pos.current.x + (target.current.x - pos.current.x) * -0.3;
        const ty = pos.current.y + (target.current.y - pos.current.y) * -0.3;
        trailRef.current.style.transform = `translate(${tx - 4}px, ${ty - 4}px)`;
      }

      checkHover();
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(animId);
    };
  }, [addRipple]);

  return (
    <>
      {/* Trail */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] w-2 h-2 rounded-full opacity-30"
        style={{ background: "hsl(38 90% 55%)", transition: "opacity 0.3s" }}
      />
      {/* Glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full transition-all duration-300"
        style={{
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          background: `radial-gradient(circle, hsl(38 90% 55% / ${isHovering ? 0.2 : 0.1}), transparent 70%)`,
          filter: "blur(2px)",
        }}
      />
      {/* Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-all duration-200"
        style={{
          width: isClicking ? 8 : isHovering ? 16 : 12,
          height: isClicking ? 8 : isHovering ? 16 : 12,
          background: isHovering
            ? "hsl(38 90% 55%)"
            : "hsl(38 90% 55% / 0.8)",
          boxShadow: `0 0 ${isHovering ? 20 : 10}px hsl(38 90% 55% / 0.5)`,
          mixBlendMode: "screen",
        }}
      />
      {/* Ripples */}
      <AnimatePresence>
        {ripples.map(r => (
          <motion.div
            key={r.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed pointer-events-none z-[9997] rounded-full"
            style={{
              left: r.x - 15,
              top: r.y - 15,
              width: 30,
              height: 30,
              border: "1px solid hsl(38 90% 55% / 0.4)",
            }}
          />
        ))}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
