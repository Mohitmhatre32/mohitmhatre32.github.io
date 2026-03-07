import { useEffect, useRef, useState } from "react";
import { experience } from "@/lib/data";

const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCommands, setActiveCommands] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadGsap = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from(".terminal-line", {
          x: -30,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    };
    loadGsap();
  }, []);

  const toggleCommand = (index: number) => {
    setActiveCommands(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section ref={sectionRef} id="experience" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4">
          <span className="gradient-text">Experience</span>
        </h2>
        <p className="text-muted-foreground mb-16 max-w-xl text-lg">
          Click commands to explore.
        </p>

        {/* Terminal */}
        <div className="glass-card overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border/50">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-primary/40" />
            <div className="w-3 h-3 rounded-full bg-primary/60" />
            <span className="ml-4 text-xs font-mono text-muted-foreground">mohit@forge ~ experience</span>
          </div>

          {/* Terminal body */}
          <div className="p-6 space-y-6 font-mono text-sm">
            <div className="terminal-line text-muted-foreground">
              <span className="text-primary">$</span> ls experience/
            </div>

            {experience.map((exp, i) => (
              <div key={i} className="terminal-line">
                <button
                  onClick={() => toggleCommand(i)}
                  className="flex items-center gap-2 text-left w-full group"
                >
                  <span className="text-primary">$</span>
                  <span className="text-foreground/80 group-hover:text-primary transition-colors duration-300">
                    {exp.command}
                  </span>
                  <span className="text-muted-foreground/40 text-xs ml-auto">
                    {activeCommands.has(i) ? "▼" : "▶"}
                  </span>
                </button>

                {activeCommands.has(i) && (
                  <div className="mt-4 ml-4 pl-4 border-l border-primary/20 space-y-2 animate-fade-in">
                    <p className="text-foreground font-display text-lg font-semibold not-italic" style={{ fontFamily: "var(--font-display)" }}>
                      {exp.role}
                    </p>
                    <p className="text-primary/80">{exp.company}</p>
                    <p className="text-muted-foreground text-xs">{exp.period}</p>
                    <p className="text-foreground/60 mt-2">{exp.description}</p>
                  </div>
                )}
              </div>
            ))}

            <div className="terminal-line flex items-center gap-2">
              <span className="text-primary">$</span>
              <span className="w-2 h-4 bg-primary/60 animate-pulse-glow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
