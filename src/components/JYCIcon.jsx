import React from 'react';

const paths = {
  home: ['M3 10.5 12 3l9 7.5M5.5 9.5V21h13V9.5M9 21v-6h6v6'],
  clubs: ['M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2.5 20a5.5 5.5 0 0 1 11 0M14 20a6 6 0 0 1 7.5 0'],
  events: ['M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z'],
  gallery: ['M4 5h16v14H4zM4 16l4-4 3 3 2-2 5 5', 'M15 9h.01'],
  team: ['M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2.5 20a5.5 5.5 0 0 1 11 0M14 20a6 6 0 0 1 7.5 0'],
  more: ['M5 7h14M5 12h14M5 17h14'],
  search: ['M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15ZM16 16l5 5'],
  close: ['M5 5l14 14M19 5 5 19'],
  'arrow-up-right': ['M7 17 17 7M8 7h9v9'],
  'chevron-right': ['m9 18 6-6-6-6'],
  calendar: ['M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z'],
  check: ['m5 12 4 4L19 6'],
  moon: ['M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z'],
  sun: ['M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M18.36 5.64l-1.42 1.42M7.06 16.94l-1.42 1.42', 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z']
};

export function JYCIcon({ name = 'more', size = 20, strokeWidth = 1.8, className }) {
  const shape = paths[name] || paths.more;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {shape.map((d, index) => <path key={index} d={d} />)}
    </svg>
  );
}
