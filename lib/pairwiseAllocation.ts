// Aggregated pairwise preference allocation: each vote splits 100 points
// between two items, and the aggregate turns many votes into one budget
// share per item that sums to 100.

export type PairwiseVote = {
  thisId: string
  thatId: string
  thisPercentage: number
}

// Adds each item's points across all votes, then scales the totals to sum
// to 100. An item that appears in more votes collects more points.
export function aggregateByTotalShare(
  votes: PairwiseVote[]
): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const { thisId, thatId, thisPercentage } of votes) {
    totals[thisId] = (totals[thisId] || 0) + thisPercentage
    totals[thatId] = (totals[thatId] || 0) + (100 - thisPercentage)
  }
  return scaleTo100(totals)
}

// Averages each item's points over the votes it appeared in, then scales the
// averages to sum to 100, so the number of votes an item gets does not bias
// its share. Pass itemIds to limit the result to those items.
export function aggregateByAverageShare(
  votes: PairwiseVote[],
  itemIds?: string[]
): Record<string, number> {
  const shares: Record<string, number[]> = {}
  for (const { thisId, thatId, thisPercentage } of votes) {
    if (!shares[thisId]) shares[thisId] = []
    shares[thisId].push(thisPercentage)
    if (!shares[thatId]) shares[thatId] = []
    shares[thatId].push(100 - thisPercentage)
  }

  const averages: Record<string, number> = {}
  for (const id of itemIds ?? Object.keys(shares)) {
    const values = shares[id]
    if (!values?.length) continue
    const average = values.reduce((sum, value) => sum + value, 0) / values.length
    if (isNaN(average) || average < 0 || average > 100) {
      throw new Error(`Invalid average allocation for ${id}: ${average}`)
    }
    averages[id] = average
  }
  return scaleTo100(averages)
}

function scaleTo100(values: Record<string, number>): Record<string, number> {
  const total = Object.values(values).reduce((sum, value) => sum + value, 0)
  const scaled: Record<string, number> = {}
  for (const id in values) {
    scaled[id] = (values[id] / total) * 100
  }
  return scaled
}
