function getTimestamps(min: number, max: number, step: number) {
  const result: number[] = [];
  let timestamp = min;

  while (timestamp < max) {
    result.push(timestamp);
    timestamp += step;
  }

  result[result.length - 1] = max;

  return result;
}

type TVL = {
  value: number;
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

export function combineTVLs({
  tvls,
  divisions,
  max,
  min
}: {
  tvls: TVL[][];
  divisions: number;
  max: number;
  min: number;
}): TVL[] {
  const allTimestamps = tvls.map((tvl) => tvl.map((value) => value.timestamp)).flat();
  const allTimestampsMin = Math.min(...allTimestamps);

  if (min < Math.min(...allTimestamps)) {
    min = allTimestampsMin;
  }

  const step = Math.round((max - min) / divisions);
  const resultTimestamps = getTimestamps(min, max, step);

  const result: TVL[] = [];

  for (let i = 0; i < resultTimestamps.length; i++) {
    result[i] = {
      value: 0,
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
