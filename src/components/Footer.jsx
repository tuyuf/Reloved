import { Link } from "react-router-dom";

export default function Footer({ inSidebar = false, isCollapsed = false }) {
  // 1. Collapsed View (Sidebar only)
  if (inSidebar && isCollapsed) {
    return (
      <div className="py-6 border-t border-black/5 flex justify-center transition-all">
        <span className="text-[10px] text-gray-400 select-none">©</span>
      </div>
    );
  }

  // 2. Expanded / Standard View
  return (
    <footer 
      className={`transition-all duration-300 ${
        inSidebar 
          ? "mt-auto border-t border-black/5 bg-[#F3F3F1]" // Sidebar styles
          : "mt-20 border-t border-black/5 bg-white"       // Default Page styles
      }`}
    >
      <div 
        className={`${
          inSidebar ? "p-6" : "reloved-page py-12 md:py-16"
        }`}
      >
        <div 
          className={`text-xs tracking-wider leading-relaxed ${
            inSidebar 
              ? "flex flex-col gap-8 opacity-100" // Vertical stack for sidebar
              : "grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8" // Grid for page
          }`}
        >
          

          {/* Links 1 */}
          <div className="space-y-4">
            <h4 className="font-semibold uppercase opacity-40 text-[10px] tracking-[0.2em]">Explore</h4>
            <div className="flex flex-col gap-2 opacity-80">
              <a href="#" className="hover:underline underline-offset-4">New Arrivals</a>
              <Link to="/collections" className="hover:underline underline-offset-4">Collections</Link>
              <Link to="/api-docs" className="hover:underline underline-offset-4 text-blue-600">API Docs</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}