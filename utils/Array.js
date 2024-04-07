/**
 * Rank an array of benchmarks from fastest to slowest
 */
export function getRanked(benchmarks) {
  // Exclude those that are errored, unrun, or have hz of Infinity.
  return benchmarks.filter(bench => bench.cycles && Number.isFinite(bench.hz) && !bench.error).sort((a, b) => {
    a = a.stats; b = b.stats
    return a.mean + a.moe > b.mean + b.moe ? 1 : -1
  })
}
