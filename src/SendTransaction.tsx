import * as React from 'react';
import {
  type BaseError,
  useReadContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { wagmiContractConfig } from './contracts';
import { parseEther } from 'viem';
import abi from './abis/erc20.json';
import { useAccount } from 'wagmi';
export function SendTransaction() {
  const tokenAddress = '0xf767660b24f2E7C29386549441dBF4E758edC507';
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { address } = useAccount();
  const { data: balance } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });
  //   const {
  //     data: hash,
  //     error,
  //     isPending,
  //     sendTransaction,
  //   } = useSendTransaction();
  console.log(address);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get('address') as `0x${string}`;
    const value = formData.get('value') as string;
    writeContract({
      address: tokenAddress,
      abi,
      functionName: 'transfer',
      args: [to, parseEther(value)],
    });
  }

  const {
    isLoading: isConfirming,
    error,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  return (
    <form onSubmit={submit}>
      <div>Balance: {balance?.toString()}</div>
      <input name='address' placeholder='0xA0Cf…251e' required />
      <input name='value' placeholder='0.05' required />
      <button disabled={isPending} type='submit'>
        {isPending ? 'Confirming...' : 'Send'}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>
  );
}
