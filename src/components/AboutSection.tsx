import { useEffect, useRef } from "react";
import { profile, education } from "@/lib/data";

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGsap = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from(".about-card", {
          y: 60,
          opacity: 0,
          duration: 0.8,
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

  return (
    <section ref={sectionRef} id="about" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4">
          <span className="gradient-text">About</span>
        </h2>
        <p className="text-muted-foreground mb-16 max-w-xl text-lg">
          Building at the intersection of AI, blockchain, and modern web.
        </p>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Bio - spans 2 cols */}
          <div className="about-card glass-card p-8 lg:col-span-2 group hover:border-primary/20 transition-colors duration-500">
            <span className="text-xs font-mono text-primary/60 uppercase tracking-widest mb-4 block">Philosophy</span>
            <p className="text-foreground/80 leading-relaxed text-base">
              {profile.bio}
            </p>
          </div>

          {/* Location */}
          <div className="about-card glass-card p-8 group hover:border-primary/20 transition-colors duration-500">
            <span className="text-xs font-mono text-primary/60 uppercase tracking-widest mb-4 block">Based in</span>
            <p className="text-2xl font-display font-bold text-foreground mb-2">Mumbai</p>
            <p className="text-muted-foreground text-sm">Maharashtra, India</p>
            <div className="mt-6 text-4xl opacity-30 group-hover:opacity-60 transition-opacity">🇮🇳</div>
          </div>

          {/* Education */}
          {education.slice(0, 2).map((edu, i) => (
            <div key={i} className="about-card glass-card p-8 group hover:border-primary/20 transition-colors duration-500">
              <span className="text-xs font-mono text-primary/60 uppercase tracking-widest mb-4 block">
                {edu.current ? "Current" : "Education"}
              </span>
              <p className="text-lg font-display font-semibold text-foreground mb-1">{edu.degree}</p>
              <p className="text-sm text-muted-foreground mb-1">{edu.school}</p>
              {edu.score && (
                <p className="text-primary font-mono text-sm mt-2">{edu.score}</p>
              )}
              {edu.focus && (
                <p className="text-xs text-muted-foreground/70 mt-2">{edu.focus}</p>
              )}
            </div>
          ))}

          {/* Developer Mindset */}
          <div className="about-card glass-card p-8 group hover:border-primary/20 transition-colors duration-500">
            <span className="text-xs font-mono text-primary/60 uppercase tracking-widest mb-4 block">Mindset</span>
            <div className="space-y-3">
              {["Hackathon-Driven", "Open Source", "Ship Fast, Iterate"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  <span className="text-foreground/70 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
