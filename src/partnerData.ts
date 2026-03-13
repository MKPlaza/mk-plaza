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
    id: 'placeholder-1',
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
