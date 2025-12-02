import { motion } from "framer-motion";
import { formatPrice, formatDate } from "../lib/format";

export default function ReceiptModal({ order, onClose }) {
  if (!order) return null;

  // Hitung subtotal dari item
  const subtotal = order.order_items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  // Hitung shipping (Total - Subtotal)
  const shipping = order.total_price - subtotal;

  // Fungsi Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm print:bg-white print:p-0">
      {/* Background Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-sm shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none"
        style={{ borderRadius: "0px", fontFamily: "'Courier Prime', 'Courier New', monospace" }} // Font Struk
      >
        {/* Paper jagged edge effect (Top) */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[linear-gradient(135deg,transparent_50%,#fff_50%),linear-gradient(225deg,transparent_50%,#fff_50%)] bg-[length:10px_10px] rotate-180 print:hidden"></div>

        <div className="p-8 space-y-6 text-[#111]">
          
          {/* Header Struk */}
          <div className="text-center space-y-2 border-b-2 border-dashed border-gray-300 pb-6">
            <h2 className="text-2xl font-bold tracking-tighter uppercase">ReLoved.</h2>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">Official Receipt</p>
            <p className="text-[10px] text-gray-400">Jl. Dinar Mas X No.39, Semarang</p>
          </div>

          {/* Info Order */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Date:</span>
              <span>{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID:</span>
              <span>#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="uppercase font-bold">{order.status}</span>
            </div>
          </div>

          {/* List Item */}
          <div className="border-t-2 border-dashed border-gray-300 py-4 space-y-3">
            {order.order_items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs items-start">
                <div className="flex-1 pr-2">
                  <div className="font-bold uppercase">{item.products?.name}</div>
                  <div className="text-[10px] text-gray-500">
                    {item.quantity} x {formatPrice(item.price)} {item.size && `(${item.size})`}
                  </div>
                </div>
                <div className="text-right font-medium">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t-2 border-dashed border-gray-300 pt-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100 mt-2">
              <span>Total Paid</span>
              <span>{formatPrice(order.total_price)}</span>
            </div>
          </div>

          {/* Footer Struk */}
          <div className="text-center pt-6 space-y-4">
            <div className="barcode h-8 w-3/4 mx-auto bg-repeat-x opacity-40" style={{ backgroundImage: "linear-gradient(90deg, #000 50%, transparent 50%)", backgroundSize: "4px 100%" }}></div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Thank you for supporting<br/>sustainable fashion</p>
          </div>

        </div>

        {/* Buttons (Hidden when printing) */}
        <div className="bg-gray-50 p-4 flex gap-3 print:hidden border-t border-gray-100">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-xs font-bold uppercase tracking-widest border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print
          </button>
        </div>

        {/* Paper jagged edge effect (Bottom) */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-[linear-gradient(45deg,transparent_50%,#f9fafb_50%),linear-gradient(135deg,transparent_50%,#f9fafb_50%)] bg-[length:10px_10px] print:hidden"></div>
      </motion.div>
    </div>
  );
}