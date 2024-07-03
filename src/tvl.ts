const DAY_MS = 1000 * 60 * 60 * 24;

function getTimestamps(min: number, max: number, step: number) {
  const result: number[] = [];
  let timestamp = min;

  while (timestamp <= max) {
    result.push(timestamp);
    timestamp += step;
  }

  return result;
}

type TVL = {
  value: bigint;
  timestamp: number;
};

function fillGaps(tvls: TVL[], timestamps: number[]) {
  const result: TVL[] = [];

  for (let y = 0; y < tvls.length; y++) {
    const record = tvls[y];

    for (let i = 0; i < timestamps.length; i++) {
      const timestamp = timestamps[i];

      if (record.timestamp <= timestamp) {
        result[i] = {
          value: record.value,
          timestamp
        };
      }
    }
  }

  return result;
}

export function combineTVLs(tvls: TVL[][], step = DAY_MS / 20): TVL[] {
  const allTimestamps = tvls.map((tvl) => tvl.map((value) => value.timestamp)).flat();
  const max = Math.max(...allTimestamps);
  const min = Math.min(...allTimestamps);
  const resultTimestamps = getTimestamps(min, max, step);

  const result: TVL[] = [];

  for (let i = 0; i < resultTimestamps.length; i++) {
    result[i] = {
      value: BigInt(0),
      timestamp: resultTimestamps[i]
    };
  }

  for (const tvlWithGaps of tvls) {
    const tvl = fillGaps(tvlWithGaps, resultTimestamps);

    for (let i = 0; i < resultTimestamps.length; i++) {
      if (tvl[i]) {
        result[i].value = result[i].value + tvl[i].value;
      }
    }
  }

  return result;
}
