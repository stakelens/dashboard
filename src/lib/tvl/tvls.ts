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

  const lidoTVL = await db.lido.findMany({
    orderBy: {
      block_number: 'asc'
    }
  });

  const staderTVL = await db.stader.findMany({
    orderBy: {
      block_number: 'asc'
    }
  });

  const swellTVL = await db.swell.findMany({
    orderBy: {
      block_number: 'asc'
    }
  });

  const mantleTVL = await db.mantle.findMany({
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
    })),
    lidoTVL: lidoTVL.map((value) => ({
      eth: bigIntDiv(BigInt(value.eth), BigInt(1e18)),
      timestamp: Number(value.block_timestamp) * 1000
    })),
    staderTVL: staderTVL.map((value) => ({
      eth: bigIntDiv(BigInt(value.eth), BigInt(1e18)),
      timestamp: Number(value.block_timestamp) * 1000
    })),
    swellTVL: swellTVL.map((value) => ({
      eth: bigIntDiv(BigInt(value.eth), BigInt(1e18)),
      timestamp: Number(value.block_timestamp) * 1000
    })),
    mantleTVL: mantleTVL.map((value) => ({
      eth: bigIntDiv(BigInt(value.eth), BigInt(1e18)),
      timestamp: Number(value.block_timestamp) * 1000
    }))
  };
}
