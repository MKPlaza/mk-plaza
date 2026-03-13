import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Handshake, ExternalLink, Users, Globe, Twitter, Github as GithubIcon, Youtube, MessageSquare } from 'lucide-react';
import { PARTNERS, PartnerItem } from '../partnerData';

const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case 'twitter': return <Twitter className="w-5 h-5" />;
    case 'github': return <GithubIcon className="w-5 h-5" />;
    case 'youtube': return <Youtube className="w-5 h-5" />;
    case 'discord': return <MessageSquare className="w-5 h-5" />;
    default: return <Globe className="w-5 h-5" />;
  }
};

export default function PartnersHub() {
  const [selectedPartner, setSelectedPartner] = useState<PartnerItem | null>(null);

  return (
    <div className="h-full w-full flex flex-col md:flex-row overflow-hidden bg-[var(--mk-midnight)]">
      <div className="w-full md:w-[450px] lg:w-[550px] h-full border-r border-white/5 flex flex-col bg-black/20">
        <div className="p-8 border-b border-white/5 flex-none">
          <div className="flex items-center gap-4 mb-2">
            <Handshake className="w-8 h-8 text-[var(--mk-gold)] drop-shadow-[0_0_8px_var(--mk-gold)]" />
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Partners</h1>
          </div>
          <p className="text-[10px] text-[var(--mk-silver)] opacity-40 font-bold uppercase tracking-[0.3em]">Partners & Special sites</p>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {PARTNERS.map((partner) => (
            <motion.button
              key={partner.id}
              onClick={() => setSelectedPartner(partner)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full relative group rounded-[2rem] p-6 transition-all overflow-hidden text-left border ${
                selectedPartner?.id === partner.id 
                  ? 'bg-white/10 border-[var(--mk-gold)]/50 shadow-[0_0_20px_rgba(255,215,0,0.1)]' 
                  : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
              }`}
            >
              {partner.banner && (
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                  <img src={partner.banner} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                </div>
              )}

              <div className="relative z-10 flex items-center gap-4">
                <div className="flex items-center gap-5 flex-grow">
                  <div className="w-16 h-16 rounded-full bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden p-3 shadow-2xl group-hover:border-[var(--mk-gold)]/30 transition-colors">
                    {partner.logo ? (
                      <img src={partner.logo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <Users className="w-8 h-8 text-[var(--mk-gold)]" />
                    )}
                  </div>
                  
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase leading-tight group-hover:text-[var(--mk-gold)] transition-colors">
                      {partner.name}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex-grow h-full relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {selectedPartner ? (
            <motion.div
              key={selectedPartner.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0 p-12 lg:p-20 overflow-y-auto flex flex-col"
            >
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--mk-gold)]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-5 shadow-2xl overflow-hidden">
                    {selectedPartner.logo ? (
                      <img src={selectedPartner.logo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <Users className="w-12 h-12 text-[var(--mk-gold)]" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">
                      {selectedPartner.name}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-[var(--mk-gold)]/10 border border-[var(--mk-gold)]/20 text-[10px] font-black text-[var(--mk-gold)] uppercase tracking-widest">
                        Partner
                      </span>
                      <span className="text-xs text-[var(--mk-silver)] opacity-40 font-bold uppercase tracking-widest">
                        Est. 2024 &bull; Made by {selectedPartner.operatedBy}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  <section>
                    <h4 className="text-[11px] text-[var(--mk-gold)] font-black uppercase tracking-[0.4em] mb-6 opacity-60">Desc.</h4>
                    <p className="text-xl lg:text-2xl text-[var(--mk-silver)] leading-relaxed font-medium">
                      {selectedPartner.desc}
                    </p>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <section>
                      <h4 className="text-[11px] text-[var(--mk-gold)] font-black uppercase tracking-[0.4em] mb-6 opacity-60">Socials</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedPartner.socials?.map((social, idx) => (
                          <motion.a
                            key={idx}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--mk-gold)]/30 transition-all text-white group"
                          >
                            <div className="text-[var(--mk-gold)] group-hover:scale-110 transition-transform">
                              <SocialIcon platform={social.platform} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider">{social.platform}</span>
                          </motion.a>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[11px] text-[var(--mk-gold)] font-black uppercase tracking-[0.4em] mb-6 opacity-60">Direct Access</h4>
                      <motion.a
                        href={selectedPartner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-[var(--mk-gold)] text-[var(--mk-midnight)] font-black uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(255,215,0,0.2)]"
                      >
                        Visit Website
                        <ExternalLink className="w-5 h-5" />
                      </motion.a>
                    </section>
                  </div>
                </div>
              </div>

              <footer className="mt-auto pt-20 text-[var(--mk-silver)] opacity-20 font-bold text-[9px] uppercase tracking-[0.5em]">
                &copy; 2026 MK-Plaza Alliance. All rights reserved.
              </footer>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-12"
            >
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                <Handshake className="w-10 h-10 text-[var(--mk-gold)] opacity-20" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-2 opacity-40">Select a Partner</h2>
              <p className="text-xs text-[var(--mk-silver)] opacity-20 font-bold uppercase tracking-[0.3em]">Choose a collaborator from the list to view details</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
