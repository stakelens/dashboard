import { db } from '@/server/db';
import { getStakeWiseTVL } from './stake-wise';
import { bigIntDiv } from '../utils';

export async function getAllTVLs() {
  const etherFiTVL = await db.etherFi.findMany({
    orderBy: {
      block_number: 'asc'
    }
  });

  const rocketPoolTVL = await db.rocketPool.findMany({
    orderBy: {
      block_number: 'asc'
    }
  });

  const stakeWiseTVL = await getStakeWiseTVL();

  return {
    rocketPoolTVL: rocketPoolTVL.map((value) => ({
      eth: bigIntDiv(BigInt(value.eth), BigInt(1e18)),
      timestamp: Number(value.block_timestamp) * 1000
    })),
    etherFiTVL: etherFiTVL.map((value) => ({
      eth: bigIntDiv(BigInt(value.eth), BigInt(1e18)),
      timestamp: Number(value.block_timestamp) * 1000
    })),
    stakeWiseTVL: stakeWiseTVL.map((value) => ({
      eth: bigIntDiv(BigInt(value.eth), BigInt(1e18)),
      timestamp: Number(value.block_timestamp) * 1000
    }))
  };
}
