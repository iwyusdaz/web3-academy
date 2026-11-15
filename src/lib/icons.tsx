// Hand-drawn 24x24 stroke icons — one consistent family, no icon dependency.
import type { ReactNode } from 'react'

function Icon({ children, size = 18 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const LogoMark = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <rect x="2" y="2" width="60" height="60" rx="10" fill="#101d2e" />
    <path
      d="M14 44 L26 30 L38 36 L50 18"
      fill="none"
      stroke="#c8942a"
      strokeWidth="1.6"
    />
    <circle cx="14" cy="44" r="3.4" fill="#ece7d9" />
    <circle cx="26" cy="30" r="3.4" fill="#ece7d9" />
    <circle cx="38" cy="36" r="3.4" fill="#ece7d9" />
    <circle cx="50" cy="18" r="4.4" fill="#c8942a" />
    <path d="M50 10v6M50 20v6M44 18h4M52 18h4" stroke="#ece7d9" strokeWidth="1.4" />
  </svg>
)

export const IconSearch = (p: { size?: number }) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.8-3.8" />
  </Icon>
)

export const IconArrowRight = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Icon>
)

export const IconArrowLeft = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </Icon>
)

export const IconCheck = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="m5 13 4 4L19 7" />
  </Icon>
)

export const IconBook = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z" />
    <path d="M4 20.5V5.5" />
    <path d="M20 18v3H6.5" />
  </Icon>
)

export const IconShield = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 8.4-7 10-4-1.6-7-5.5-7-10V6Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
)

export const IconCoins = (p: { size?: number }) => (
  <Icon {...p}>
    <circle cx="9" cy="9" r="5.5" />
    <path d="M14.5 7.7a5.5 5.5 0 1 1-6.8 6.8" />
    <path d="M9 6.5v5" />
    <path d="M7.5 8h3" />
  </Icon>
)

export const IconLayers = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="m12 3 9 5-9 5-9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </Icon>
)

export const IconFlask = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="M10 3h4" />
    <path d="M11 3v6l-5.5 9.5A2 2 0 0 0 7.2 21h9.6a2 2 0 0 0 1.7-2.5L13 9V3" />
    <path d="M8.5 15h7" />
  </Icon>
)

export const IconTrophy = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="M8 4h8v5a4 4 0 0 1-8 0Z" />
    <path d="M8 5H5v1a3 3 0 0 0 3 3" />
    <path d="M16 5h3v1a3 3 0 0 1-3 3" />
    <path d="M12 13v4" />
    <path d="M8 21h8" />
    <path d="M10 17h4v4h-4z" />
  </Icon>
)

export const IconClock = (p: { size?: number }) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5l3.5 2" />
  </Icon>
)

export const IconExternal = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4 11 13" />
    <path d="M19 14v5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V8a1.5 1.5 0 0 1 1.5-1.5H11" />
  </Icon>
)

export const IconChevronRight = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="m9 5 7 7-7 7" />
  </Icon>
)

export const IconGraduation = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="m2 9 10-5 10 5-10 5Z" />
    <path d="M6 11.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
    <path d="M22 9v6" />
  </Icon>
)

export const IconCompass = (p: { size?: number }) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5Z" />
  </Icon>
)

export const IconAlert = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="M12 4 2.5 20h19Z" />
    <path d="M12 10v4" />
    <path d="M12 17.2v.1" />
  </Icon>
)

export const IconBulb = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="M9 18h6" />
    <path d="M10 21h4" />
    <path d="M12 3a6.5 6.5 0 0 1 4 11.5c-.8.7-1 1.4-1 2.5h-6c0-1.1-.2-1.8-1-2.5A6.5 6.5 0 0 1 12 3Z" />
  </Icon>
)

export const IconZoom = (p: { size?: number }) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.8-3.8" />
    <path d="M8.5 11h5" />
    <path d="M11 8.5v5" />
  </Icon>
)

export const IconMenu = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </Icon>
)

export const IconX = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="m6 6 12 12" />
    <path d="m18 6-12 12" />
  </Icon>
)

export const IconFile = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v4h4" />
    <path d="M9 13h6" />
    <path d="M9 16.5h6" />
  </Icon>
)

export const IconTarget = (p: { size?: number }) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 12h.01" />
  </Icon>
)

export const IconLink = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3A4 4 0 0 0 13 5.3l-1.5 1.5" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1.5-1.5" />
  </Icon>
)

export const IconSpark = (p: { size?: number }) => (
  <Icon {...p}>
    <path d="M12 3v4" />
    <path d="M12 17v4" />
    <path d="M3 12h4" />
    <path d="M17 12h4" />
    <path d="m6 6 2.5 2.5" />
    <path d="m15.5 15.5 2.5 2.5" />
    <path d="m18 6-2.5 2.5" />
    <path d="m8.5 15.5-2.5 2.5" />
  </Icon>
)
