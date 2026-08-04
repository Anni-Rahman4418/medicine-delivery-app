import React from 'react';

type IconProps = { size?: number; color?: string };

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const CartIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg {...base(size)} style={{ color }}>
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg {...base(size)} style={{ color }}>
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

export const PillIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg {...base(size)} style={{ color }}>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
    <path d="m8.5 8.5 7 7" />
  </svg>
);

export const RxIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg {...base(size)} style={{ color }}>
    <path d="M8 3v18M8 3h6a4 4 0 1 1 0 8H8m5 0 6 10" />
  </svg>
);

export const TruckIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg {...base(size)} style={{ color }}>
    <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg {...base(size)} style={{ color }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg {...base(size)} style={{ color }}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg {...base(size)} style={{ color }}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg {...base(size)} style={{ color }}>
    <path d="M5 12h14" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg {...base(size)} style={{ color }}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg {...base(size)} style={{ color }}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg {...base(size)} style={{ color }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg {...base(size)} style={{ color }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
);

export const BellIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg {...base(size)} style={{ color }}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
