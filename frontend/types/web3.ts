import { Transaction } from 'viem'

// Maintain name from ethers
export type ContractTransaction = Transaction['hash']
