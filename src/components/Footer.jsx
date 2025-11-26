export default function Footer() {
  return (
    <footer className="border-t border-black/5 mt-10 py-8 text-[10px] md:text-xs">
      <div className="reloved-page flex flex-col md:flex-row justify-between gap-4 opacity-60">
        <div className="space-y-1">
          <div>INFO</div>
          <div>PRICING</div>
          <div>ABOUT</div>
          <div>CONTACTS</div>
        </div>
        <div className="space-y-1">
          <div>LANGUAGES</div>
          <div>ENG</div>
          <div>ID</div>
        </div>
        <div className="text-right space-y-1 md:text-left md:self-end">
          <div className="tracking-[0.3em] uppercase">ReLoved</div>
          <div className="opacity-60">Preloved pieces, new stories.</div>
        </div>
      </div>
    </footer>
  );
}
