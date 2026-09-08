export function isPayableStatus(status: string): boolean {
  return status === 'quoted' || status === 'awaitingPayment'
}

export function isClosedStatus(status: string): boolean {
  return ['cancelled', 'rejected', 'completed'].includes(status)
}

export function isPaymentAccountReady(settings: {
  active?: boolean
  cardholderName?: string | null
  cardNumber?: string | null
  iban?: string | null
}): boolean {
  return Boolean(
    settings.active &&
    settings.cardholderName?.trim() &&
    (settings.cardNumber?.trim() || settings.iban?.trim()),
  )
}
