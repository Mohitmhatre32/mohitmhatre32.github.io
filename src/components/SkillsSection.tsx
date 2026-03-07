import { useEffect, useRef, useState } from "react";
import { skills } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

const categoryColors: Record<string, string> = {
  Languages: "hsl(38 90% 55%)",
  Frontend: "hsl(30 80% 55%)",
  Backend: "hsl(25 70% 50%)",
  Databases: "hsl(20 75% 50%)",
  Blockchain: "hsl(35 85% 55%)",
  "AI/ML": "hsl(40 90% 60%)",
  "Dev Tools": "hsl(28 60% 45%)",
};

const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    const loadGsap = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from(".skill-category", {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
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

  const categories = Object.entries(skills);

  return (
    <section ref={sectionRef} id="skills" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4">
          <span className="gradient-text">Skills</span>
        </h2>
        <p className="text-muted-foreground mb-16 max-w-xl text-lg">
          Technologies I work with across the full stack.
        </p>

        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setActiveCategory(null)}
            className={`magnetic-btn px-4 py-2 rounded-full text-sm font-mono transition-all duration-300 ${
              !activeCategory
                ? "bg-primary text-primary-foreground"
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map(([cat]) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={`magnetic-btn px-4 py-2 rounded-full text-sm font-mono transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {categories
              .filter(([cat]) => !activeCategory || cat === activeCategory)
              .map(([category, items]) => (
                <motion.div
                  key={category}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="skill-category glass-card p-6 group hover:border-primary/20 transition-colors duration-500"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: categoryColors[category] }}
                    />
                    <h3 className="text-sm font-mono text-primary/80 uppercase tracking-widest">
                      {category}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        onMouseEnter={() => setHoveredSkill(skill)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        className={`px-3 py-1.5 rounded-md text-sm font-mono transition-all duration-300 ${
                          hoveredSkill === skill
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : "bg-secondary text-secondary-foreground border border-transparent"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
