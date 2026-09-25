/**
 * @jest-environment node
 */
import { aggregateByAverageShare, PairwiseVote } from "@/lib/pairwiseAllocation"

const sum = (shares: Record<string, number>) =>
  Object.values(shares).reduce((total, share) => total + share, 0)

describe("aggregateByAverageShare", () => {
  it("returns no shares when there are no votes", () => {
    expect(aggregateByAverageShare([])).toEqual({})
  })

  it("keeps a single vote's split", () => {
    const votes: PairwiseVote[] = [
      { thisId: "a", thatId: "b", thisPercentage: 70 },
    ]
    expect(aggregateByAverageShare(votes)).toEqual({ a: 70, b: 30 })
  })

  it("scales the shares to sum to 100", () => {
    const votes: PairwiseVote[] = [
      { thisId: "a", thatId: "b", thisPercentage: 80 },
      { thisId: "b", thatId: "c", thisPercentage: 40 },
      { thisId: "c", thatId: "a", thisPercentage: 25 },
    ]
    expect(sum(aggregateByAverageShare(votes))).toBeCloseTo(100)
  })

  it("does not favor items that appear in more votes", () => {
    // Every vote is an even split, but "a" appears in two votes.
    const votes: PairwiseVote[] = [
      { thisId: "a", thatId: "b", thisPercentage: 50 },
      { thisId: "a", thatId: "c", thisPercentage: 50 },
    ]
    const shares = aggregateByAverageShare(votes)
    for (const id of ["a", "b", "c"]) {
      expect(shares[id]).toBeCloseTo(100 / 3)
    }
  })

  it("limits the shares to the given items", () => {
    const votes: PairwiseVote[] = [
      { thisId: "a", thatId: "removed", thisPercentage: 60 },
      { thisId: "a", thatId: "b", thisPercentage: 20 },
    ]
    const shares = aggregateByAverageShare(votes, ["a", "b", "no-votes"])
    expect(Object.keys(shares).sort()).toEqual(["a", "b"])
    // a averages (60 + 20) / 2 = 40 and b averages 80, so a gets 40 / 120.
    expect(shares.a).toBeCloseTo((40 / 120) * 100)
    expect(shares.b).toBeCloseTo((80 / 120) * 100)
  })

  it("rejects percentages outside 0 to 100", () => {
    const votes: PairwiseVote[] = [
      { thisId: "a", thatId: "b", thisPercentage: 150 },
    ]
    expect(() => aggregateByAverageShare(votes)).toThrow(
      "Invalid average allocation"
    )
  })
})
