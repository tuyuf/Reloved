export default function Footer() {
  return (
    <footer className="border-t border-black/5 mt-20 bg-white">
      <div className="reloved-page py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 text-xs tracking-wider leading-relaxed">
          
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="text-sm font-bold tracking-[0.3em] uppercase">ReLoved</div>
            <p className="opacity-60 max-w-[200px]">
              Curated preloved pieces looking for new stories. Sustainable fashion for everyone.
            </p>
          </div>

          {/* Links 1 */}
          <div className="space-y-4">
            <h4 className="font-semibold uppercase opacity-40 text-[10px] tracking-[0.2em]">Explore</h4>
            <div className="flex flex-col gap-2 opacity-80">
              <a href="#" className="hover:underline underline-offset-4">New Arrivals</a>
              <a href="#" className="hover:underline underline-offset-4">Collections</a>
              <a href="#" className="hover:underline underline-offset-4">Accessories</a>
            </div>
          </div>

          {/* Links 2 */}
          <div className="space-y-4">
            <h4 className="font-semibold uppercase opacity-40 text-[10px] tracking-[0.2em]">Support</h4>
            <div className="flex flex-col gap-2 opacity-80">
              <a href="#" className="hover:underline underline-offset-4">FAQ</a>
              <a href="#" className="hover:underline underline-offset-4">Shipping & Returns</a>
              <a href="#" className="hover:underline underline-offset-4">Contact Us</a>
            </div>
          </div>

          {/* Newsletter / Social */}
          <div className="space-y-4">
            <h4 className="font-semibold uppercase opacity-40 text-[10px] tracking-[0.2em]">Connect</h4>
            <div className="flex gap-4 opacity-80">
              <a href="#" className="hover:text-black/50 transition">Instagram</a>
              <a href="#" className="hover:text-black/50 transition">Twitter</a>
              <a href="#" className="hover:text-black/50 transition">TikTok</a>
            </div>
            <div className="pt-4 opacity-40 text-[10px]">
              © {new Date().getFullYear()} ReLoved Inc.
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}