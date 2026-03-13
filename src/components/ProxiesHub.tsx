import React from 'react';
import { motion } from 'motion/react';
import { Shield, Activity } from 'lucide-react';
import { PROXIES } from '../proxyData';
import './ProxiesHub.css';

export default function ProxiesHub() {
  const handleCardClick = (url: string) => {
    const features = 'width=1200,height=800,scrollbars=yes,resizable=yes';

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Link Hub</title>
            <style>
                body { margin: 0; overflow: hidden; background-color: #0f172a; }
                iframe { width: 100%; height: 100vh; border: none; }
            </style>
        </head>
        <body>
            <iframe src="${url}" allowfullscreen sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"></iframe>
        </body>
        </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    const newWindow = window.open(blobUrl, '_blank', features);

    if (!newWindow) {
      alert("Pop-up blocked! Please allow pop-ups for this site.");
    }
  };

  return (
    <div className="proxies-container">
      <div className="relative min-h-screen w-full p-4 sm:p-8 flex flex-col items-center">
        <header className="text-center mb-12 mt-8 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Shield className="w-12 h-12 text-[var(--mk-gold)] drop-shadow-[0_0_10px_var(--mk-gold)]" />
            <h1 className="kirby-title text-5xl md:text-6xl font-black text-white">Pr0xy Collection</h1>
          </div>
          <div className="flex items-center justify-center gap-6">
            <p className="text-sm text-[var(--mk-silver)] opacity-60 font-bold uppercase tracking-widest">By MK-Plaza</p>
          </div>
        </header>

        <main id="url-grid" className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROXIES.map((item, index) => (
            <motion.div
              key={index}
              className="kirby-card"
              style={{ animationDelay: `${index * 75}ms` }}
              onClick={() => handleCardClick(item.url)}
              whileHover={{ scale: 1.03, y: -10 }}
            >
              <iframe 
                src={item.url} 
                loading="lazy"
                title={`Proxy ${index}`}
                sandbox="allow-scripts allow-same-origin"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">
                  Proxie_{index.toString().padStart(2, '0')}
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            </motion.div>
          ))}
        </main>

        <footer className="text-center text-[var(--mk-silver)] opacity-30 mt-16 pb-4 font-bold text-xs uppercase tracking-widest">
          <p>&copy; 2026 MK-Plaza Pr0xy Collection. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
