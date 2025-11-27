import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // Efek shadow halus saat di-scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`md:hidden fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled 
          ? "bg-[#f4f2f0]/90 backdrop-blur-md border-b border-black/5 shadow-sm" 
          : "bg-[#f4f2f0]/0 backdrop-blur-none border-transparent"
      }`}
    >
    </header>
  );
}