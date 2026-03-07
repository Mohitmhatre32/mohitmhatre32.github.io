import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import HeroScene from "./HeroScene";
import { profile } from "@/lib/data";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGsap = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from(".hero-name-char", {
          y: 100,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.04,
          delay: 0.3,
        });

        gsap.from(".hero-role", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.2,
        });

        gsap.from(".hero-cta", {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: 1.6,
        });

        gsap.from(".hero-scroll-indicator", {
          opacity: 0,
          duration: 1,
          delay: 2.2,
        });
      }, sectionRef);

      return () => ctx.revert();
    };
    loadGsap();
  }, []);

  const nameChars = profile.name.split("");

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <HeroScene />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass-card"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-sm font-mono text-muted-foreground">
            Open to opportunities
          </span>
        </motion.div>

        {/* Name */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold leading-none mb-6 overflow-hidden">
          {nameChars.map((char, i) => (
            <span
              key={i}
              className={`hero-name-char inline-block ${
                char === " " ? "mr-4" : ""
              } glow-text text-foreground`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        {/* Role */}
        <p className="hero-role text-lg sm:text-xl md:text-2xl text-muted-foreground font-body max-w-2xl mx-auto mb-10 leading-relaxed">
          <span className="gradient-text font-semibold">Full-Stack Developer</span>
          {" · "}
          <span className="text-foreground/70">AI & Blockchain Enthusiast</span>
          {" · "}
          <span className="text-foreground/50">Building the future</span>
        </p>

        {/* CTAs */}
        <div className="hero-cta flex flex-wrap justify-center gap-4">
          <a
            href="#projects"
            className="magnetic-btn px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm tracking-wide hover:shadow-[var(--shadow-glow)] transition-shadow duration-500"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="magnetic-btn px-8 py-3 rounded-full border border-primary/30 text-foreground font-semibold text-sm tracking-wide hover:border-primary/60 hover:bg-primary/5 transition-all duration-500"
          >
            Get in Touch
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground/50"
          >
            <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
