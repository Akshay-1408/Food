"use client";

export default function ScrollToTop() {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      className="font-black text-lg bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
      aria-label="Scroll to top"
    >
      Servd AI
    </button>
  );
}
