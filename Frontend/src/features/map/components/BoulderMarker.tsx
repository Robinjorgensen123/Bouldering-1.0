import L from "leaflet";

export const BoulderMarkerIcon = L.divIcon({
  className: "boulder-marker-shell",
  html: `
    <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      
      <!-- Glow filter -->
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Rock shape -->
      <path 
        d="M22 4 
           L34 10 
           L40 22 
           L36 34 
           L24 40 
           L10 38 
           L4 26 
           L8 14 Z"
        fill="url(#rockGradient)"
        stroke="#0f1216"
        stroke-width="2"
      />

      <!-- Gradient -->
      <defs>
        <linearGradient id="rockGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4b5563"/>
          <stop offset="40%" stop-color="#2f3742"/>
          <stop offset="100%" stop-color="#11161c"/>
        </linearGradient>
      </defs>

      <!-- Cracks -->
      <path d="M22 20 L32 10" stroke="#ff3b2f" stroke-width="2.5" filter="url(#glow)" />
      <path d="M22 20 L12 26" stroke="#ff3b2f" stroke-width="2.5" filter="url(#glow)" />
      <path d="M22 20 L20 34" stroke="#ff3b2f" stroke-width="2.5" filter="url(#glow)" />

      <!-- Highlight -->
      <ellipse cx="18" cy="16" rx="4" ry="2.5" fill="white" opacity="0.15"/>

    </svg>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 30],
  popupAnchor: [0, -24],
});
