const DAY_MS = 1000 * 60 * 60 * 24;

function getDayTimestamp(timestamp: BigInt) {
  return new Date(new Date(Number(timestamp.toString()) * 1000).toDateString()).getTime();
}

function getDaysFromRange(minDay: number, maxDay: number) {
  const days: number[] = [];
  let timestamp = minDay;

  while (timestamp <= maxDay) {
    days.push(timestamp);
    timestamp += DAY_MS;
  }

  return days;
}

// Filters the TVL values so that we only keep the last tvl value of each day.
function getTheLastTVLOfEachDay(values: TVLFromDB[]): Map<number, bigint> {
  const historicalTVL: Map<number, bigint> = new Map();

  for (const value of values) {
    const timestamp = getDayTimestamp(value.block_timestamp);
    historicalTVL.set(timestamp, BigInt(value.eth));
  }

  return historicalTVL;
}

// Fill the gaps in the historical TVL. If the TVL is not defined for a day,
// we will set the TVL of that day to the last TVL value.
function fillTVLGaps({
  historicalTVL,
  min,
  max
}: {
  historicalTVL: Map<number, bigint>;
  min: number;
  max: number;
}): Map<number, bigint> {
  const days = getDaysFromRange(min, max);
  let lastTVL = BigInt(0);

  for (const day of days) {
    const dayTVL = historicalTVL.get(day);

    if (!dayTVL) {
      historicalTVL.set(day, lastTVL);
    } else {
      lastTVL = dayTVL;
    }
  }

  return historicalTVL;
}

type TVLFromDB = {
  block_timestamp: bigint;
  eth: string;
};

type TVL = {
  value: bigint;
  timestamp: number;
};

function getTVL(tvl: TVLFromDB[]): TVL[] {
  let historicalTVL = getTheLastTVLOfEachDay(tvl);

  const timestamps = Array.from(historicalTVL.keys());
  const max = Math.max(...timestamps);
  const min = Math.min(...timestamps);

  historicalTVL = fillTVLGaps({
    historicalTVL,
    min,
    max
  });

  const resultArray: TVL[] = [];

  for (const [timestamp, value] of historicalTVL.entries()) {
    resultArray.push({
      value,
      timestamp
    });
  }

  return resultArray;
}

export function combineTVLs(tvls: TVLFromDB[][]): TVL[] {
  const result: Map<number, bigint> = new Map();

  const tvlMapsWithGaps = tvls.map(getTheLastTVLOfEachDay);

  const timestamps = tvlMapsWithGaps.map((tvlMap) => Array.from(tvlMap.keys())).flat();
  const max = Math.max(...timestamps);
  const min = Math.min(...timestamps);

  const tvlMaps = tvlMapsWithGaps.map((historicalTVL) =>
    fillTVLGaps({
      historicalTVL,
      min,
      max
    })
  );

  for (const tvlMap of tvlMaps) {
    for (const [timestamp, tvlValue] of tvlMap) {
      const finalValue = result.get(timestamp);

      if (finalValue) {
        result.set(timestamp, finalValue + tvlValue);
      } else {
        result.set(timestamp, tvlValue);
      }
    }
  }

  const resultArray: TVL[] = [];

  for (const [timestamp, value] of result.entries()) {
    resultArray.push({
      value,
      timestamp
    });
  }

  return resultArray.sort((a, b) => a.timestamp - b.timestamp);
}
