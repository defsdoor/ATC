export const metresToNm = (metres) => metres / 1852

export function speedChangeRates(category, wakeCategory) {
  if (category === 'business') {
    return {
      accelerateRate: 5,
      decelerateRate: 8,
    }
  }

  if (category === 'turboprop') {
    return {
      accelerateRate: 3,
      decelerateRate: 5,
    }
  }

  if (category === 'regional') {
    return {
      accelerateRate: 4,
      decelerateRate: 6,
    }
  }

  switch (wakeCategory) {
    case 'J': // A380
      return {
        accelerateRate: 2,
        decelerateRate: 4,
      }

    case 'H': // 777, 787, A350, etc.
      return {
        accelerateRate: 2.5,
        decelerateRate: 5,
      }

    case 'M': // A320, 737
      return {
        accelerateRate: 2,
        decelerateRate: 3,
      }

    case 'L':
      return {
        accelerateRate: 4,
        decelerateRate: 7,
      }

    default:
      return {
        accelerateRate: 3,
        decelerateRate: 5,
      }
  }
}
