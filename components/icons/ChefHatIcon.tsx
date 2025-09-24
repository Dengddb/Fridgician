
import React from 'react';

const ChefHatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 21h4" />
    <path d="M12 16a2 2 0 0 0-2 2v3h8v-3a2 2 0 0 0-2-2Z" />
    <path d="M12 2a5.1 5.1 0 0 1 4.1 2.2C17.5 5.6 19 8 19 9c0 2.7-2.2 5-5 5h-4c-2.8 0-5-2.3-5-5 0-1 .5-3.4 1.9-4.8C7.9 2.1 9.9 2 12 2Z" />
  </svg>
);

export default ChefHatIcon;
