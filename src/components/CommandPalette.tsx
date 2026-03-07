import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const commands = [
  { label: "Go to Hero", action: () => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "Go to About", action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "Go to Skills", action: () => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "Go to Projects", action: () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "Go to Experience", action: () => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "Go to Contact", action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "Download Resume", action: () => alert("Resume download coming soon!") },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen(prev => !prev);
      setQuery("");
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const execute = (cmd: typeof commands[0]) => {
    cmd.action();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-lg"
          >
            <div className="glass-card overflow-hidden border border-border/50">
              <div className="p-4 border-b border-border/30">
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Type a command..."
                  className="w-full bg-transparent text-foreground font-mono text-sm outline-none placeholder:text-muted-foreground/40"
                />
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                {filtered.map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => execute(cmd)}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-mono text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors duration-200 flex items-center gap-3"
                  >
                    <span className="text-primary/40">→</span>
                    {cmd.label}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="px-4 py-3 text-sm font-mono text-muted-foreground/40">No commands found.</p>
                )}
              </div>
              <div className="px-4 py-2 border-t border-border/30">
                <span className="text-xs font-mono text-muted-foreground/30">
                  Press ESC to close · ⌘K to toggle
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
