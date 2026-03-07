import { useEffect, useRef } from "react";
import { achievements } from "@/lib/data";

const AchievementsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGsap = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        if (!scrollRef.current) return;

        const scrollWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

        gsap.to(scrollRef.current, {
          x: -scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 20%",
            end: `+=${scrollWidth}`,
            pin: true,
            scrub: 1,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    };
    loadGsap();
  }, []);

  return (
    <section ref={sectionRef} id="achievements" className="relative py-32 overflow-hidden">
      <div className="px-6 mb-16 max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4">
          <span className="gradient-text">Achievements</span>
        </h2>
        <p className="text-muted-foreground max-w-xl text-lg">
          Milestones from hackathons and competitions.
        </p>
      </div>

      <div ref={scrollRef} className="flex gap-6 px-6" style={{ width: "max-content" }}>
        {achievements.map((a, i) => (
          <div
            key={i}
            className="glass-card p-8 w-80 flex-shrink-0 group hover:border-primary/30 transition-all duration-500"
          >
            <div className="text-xs font-mono text-primary/60 mb-4">{a.year}</div>
            <h3 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-500">
              {a.title}
            </h3>
            <p className="text-sm text-muted-foreground">{a.event}</p>
            <div className="mt-6 w-full h-px bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default AchievementsSection;
