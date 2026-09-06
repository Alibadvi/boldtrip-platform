type EmbassyCountryTheme = {
  border: string
  button: string
  cardGradient: string
  heroGradient: string
  softBackground: string
  text: string
}

const defaultTheme: EmbassyCountryTheme = {
  border: 'border-brand-200',
  button: 'bg-brand-600 text-white',
  cardGradient:
    'from-brand-700 via-brand-600 to-brand-900',
  heroGradient:
    'from-brand-950 via-brand-800 to-brand-600',
  softBackground: 'bg-brand-50',
  text: 'text-brand-700',
}

const themes: Record<string, EmbassyCountryTheme> = {
  CA: {
    border: 'border-red-200',
    button: 'bg-red-600 text-white',
    cardGradient: 'from-red-700 via-red-600 to-red-800',
    heroGradient: 'from-red-950 via-red-700 to-red-500',
    softBackground: 'bg-red-50',
    text: 'text-red-700',
  },
  EU: {
    border: 'border-blue-200',
    button: 'bg-blue-800 text-yellow-300',
    cardGradient:
      'from-blue-950 via-blue-800 to-indigo-700',
    heroGradient:
      'from-blue-950 via-blue-800 to-indigo-600',
    softBackground: 'bg-blue-50',
    text: 'text-blue-800',
  },
}

export function getEmbassyCountryTheme(
  countryCode: string,
): EmbassyCountryTheme {
  return themes[countryCode.toUpperCase()] ?? defaultTheme
}