import type { SVGProps } from 'react'

type IconName = 'arrow' | 'plane' | 'globe' | 'calendar' | 'document' | 'shield' | 'menu' | 'close' | 'phone' | 'message' | 'mail' | 'camera'

const paths: Record<IconName, string> = {
  arrow: 'M19 12H5m6-6-6 6 6 6',
  plane: 'm21 3-6 18-4-8-8-4 18-6ZM11 13 21 3',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z',
  calendar:
    'M7 3v4m10-4v4M4 10h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 9h2m4 0h2m-8 3h2',
  document: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Zm0 0v6h6M8 13h8m-8 4h5',
  shield: 'm12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6l8-3Zm-4 9 3 3 5-6',
  menu: 'M4 7h16M8 12h12M4 17h16',
  close: 'm6 6 12 12M6 18 18 6',
  phone: 'M6 3h3l2 5-2 2c1 2 3 4 5 5l2-2 5 2v3c0 2-2 3-4 3A16 16 0 0 1 3 7c0-2 1-4 3-4Z',
  message: 'M4 5h16v12H8l-4 3V5Zm3 4h10m-10 4h7',
  mail: 'M3 5h18v14H3V5Zm0 1 9 7 9-7',
  camera: 'M4 7h4l2-2h4l2 2h4v13H4V7Zm8 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
}

export function TravelIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  )
}
