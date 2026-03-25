export interface PartnerItem {
  id: string;
  name: string;
  operatedBy: string;
  desc: string;
  link: string;
  logo: string;
  banner?: string;
  background?: string;
  estDate?: string;
  socials?: {
    platform: string;
    url: string;
  }[];
}

export const PARTNERS: PartnerItem[] = [
  {
    id: 'zodiac',
    name: 'ZODIAC',
    operatedBy: '.dzxs (ZXS)',
    desc: ' "The best proxy on the block!!! " ',
    link: 'zodiac-thisdoesntmatter.vercel.app',
    logo: 'https://cdn.jsdelivr.net/gh/MKPlaza/assets@main/Zodiac/b2383ff7f33965fa9dd15a468d226b1a.webp',
    banner: 'https://cdn.jsdelivr.net/gh/MKPlaza/assets@main/Zodiac/zodiac-banner.jpg',
    background: 'https://cdn.jsdelivr.net/gh/MKPlaza/assets@main/Zodiac/zodiac-wallpaper-thing.webp',
    estDate: '2026',
    socials: [
      { platform: 'Discord', url: 'https://discord.gg/unblockify' }
    ]
  },
  {
    id: 'chillzone',
    name: 'Chillzone',
    operatedBy: 'ohsols',
    desc: 'my son potential man made this',
    link: 'https://chillz0ne.dev/',
    logo: 'https://cdn.jsdelivr.net/gh/MKPlaza/assets@main/Chillzone/czone-icon.jpg',
    banner: 'https://cdn.jsdelivr.net/gh/MKPlaza/assets@main/Chillzone/czone.gif',
    background: 'https://cdn.jsdelivr.net/gh/MKPlaza/assets@main/Chillzone/czone-background.gif',
    estDate: '2026',
    socials: [
      { platform: 'Discord', url: 'https://discord.com/invite/cuHARsXESW' }
    ]
  },
  {
    id: 'placeholder-3',
    name: 'Placeholder',
    operatedBy: 'Placeholder',
    desc: 'Placeholder description.',
    link: '#',
    logo: '',
    estDate: '2026',
    socials: [
      { platform: 'Website', url: '#' }
    ]
  },
  {
    id: 'placeholder-4',
    name: 'Placeholder',
    operatedBy: 'Placeholder',
    desc: 'Placeholder description.',
    link: '#',
    logo: '',
    estDate: '2026',
    socials: [
      { platform: 'Website', url: '#' }
    ]
  }
];
