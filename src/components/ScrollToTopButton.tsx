import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = document.querySelector(".min-h-screen");

    if (!container) return;

    const onScroll = () => {
      setVisible(container.scrollTop > 200);
    };

    container.addEventListener("scroll", onScroll);
    onScroll();

    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    const container = document.querySelector(".min-h-screen");
    if (!container) return;

    container.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-24 right-4 z-50 rounded-full border border-secondary bg-card p-3 shadow-lg"
    >
      <ArrowUp size={18} />
    </button>
  );
}