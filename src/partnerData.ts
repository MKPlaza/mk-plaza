export interface PartnerItem {
  id: string;
  name: string;
  operatedBy: string;
  desc: string;
  link: string;
  logo: string;
  banner?: string;
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
    socials: [
      { platform: 'Discord', url: 'https://discord.gg/unblockify' }
    ]
  },
  {
    id: 'placeholder-2',
    name: 'Placeholder',
    operatedBy: 'Placeholder',
    desc: 'Placeholder description.',
    link: '#',
    logo: '',
    socials: [
      { platform: 'Website', url: '#' }
    ]
  },
  {
    id: 'placeholder-3',
    name: 'Placeholder',
    operatedBy: 'Placeholder',
    desc: 'Placeholder description.',
    link: '#',
    logo: '',
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
    socials: [
      { platform: 'Website', url: '#' }
    ]
  }
];
