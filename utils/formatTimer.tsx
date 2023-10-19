export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    seconds -= hours * 3600

    const minutes = Math.floor(seconds / 60)
    seconds -= minutes * 60

    const result = []

    if (hours > 0) {
      result.push(`${hours}H`)
    }
    if (minutes > 0) {
      result.push(`${minutes}M`)
    }
    if (seconds <= 0) {
      result.push(0)
    }

    return result.join(' ')
  }