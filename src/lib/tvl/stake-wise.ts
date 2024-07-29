import { db } from '@/server/db';

export async function getStakeWiseTVL() {
  const stakeWiseDB = await db.stakeWise.findMany({
    orderBy: {
      block_number: 'asc'
    }
  });

  const vaultTVLChanges = stakeWiseDB.map((value) => {
    return {
      ...value,
      eth: BigInt(value.eth)
    };
  });

  const stakeWiseTVL: {
    block_timestamp: bigint;
    eth: bigint;
  }[] = [];

  stakeWiseTVL[0] = vaultTVLChanges[0];

  for (let i = 1; i < vaultTVLChanges.length; i++) {
    stakeWiseTVL[i] = {
      eth: vaultTVLChanges[i].eth + stakeWiseTVL[i - 1].eth,
      block_timestamp: vaultTVLChanges[i].block_timestamp
    };
  }

  const stakeWise = stakeWiseTVL
    .map((value) => ({ ...value, eth: value.eth.toString() }))
    .sort((a, b) => Number(a.block_timestamp - b.block_timestamp));

  return stakeWise;
}
