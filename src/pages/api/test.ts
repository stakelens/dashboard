import type { APIRoute } from 'astro';

type RocketPoolDataItem = {
  id: string;
  date: string;
  ethLocked: number;
  rplLocked: number;
};

type RocketPoolData = RocketPoolDataItem[];

export async function getRocketPoolData(): Promise<RocketPoolData> {
  const response = await fetch('https://staking-indexer-production.up.railway.app', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      query: `{
                rocketPoolTVLs {
                    items {
                        id
                        date
                        ethLocked
                        rplLocked
                    }
                }
              }`
    })
  });

  const json = await response.json();

  // Sort by date
  json.data.rocketPoolTVLs.items.sort(
    (a: RocketPoolDataItem, b: RocketPoolDataItem) => Number(a.date) - Number(b.date)
  );

  return json.data.rocketPoolTVLs.items.map((item: RocketPoolDataItem) => ({
    id: item.id,
    date: new Date(Number(item.date) * 1000).toDateString(),
    ethLocked: item.ethLocked / 1e18,
    rplLocked: item.rplLocked / 1e18
  }));
}

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(await getRocketPoolData()), {
    headers: {
      'content-type': 'application/json'
    }
  });
};
