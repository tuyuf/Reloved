import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { Link } from "react-router-dom";

export default function ApiDocs() {
  return (
    <div className="bg-white min-h-screen">
      {/* Custom Header agar bisa kembali ke aplikasi */}
      <div className="bg-[#111] text-white py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="text-xs font-bold uppercase tracking-widest hover:text-gray-300 transition-colors"
          >
            ← Back to App
          </Link>
          <div className="h-4 w-[1px] bg-white/20"></div>
          <span className="font-serif italic text-lg">ReLoved API</span>
        </div>
        <div className="text-[10px] text-gray-400">
          Powered by Swagger UI
        </div>
      </div>

      {/* Container Swagger */}
      <div className="max-w-[1200px] mx-auto py-10 px-4">
        {/* URL mengarah ke file di folder public/swagger.yaml */}
        <SwaggerUI url="/swagger.yaml" />
      </div>
    </div>
  );
}