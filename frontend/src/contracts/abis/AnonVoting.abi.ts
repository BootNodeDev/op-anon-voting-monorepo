export default [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_verifier',
        type: 'address',
        internalType: 'contract ISemaphoreVerifier',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addVoter',
    inputs: [
      {
        name: 'pollId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'addVoter',
    inputs: [
      {
        name: 'pollId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'identityCommitment',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'uid',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'castVote',
    inputs: [
      {
        name: 'vote',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'nullifierHash',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'pollId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'proof',
        type: 'uint256[8]',
        internalType: 'uint256[8]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createPoll',
    inputs: [
      {
        name: 'pollId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'coordinator',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'merkleTreeDepth',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'endPoll',
    inputs: [
      {
        name: 'pollId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'decryptionKey',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getMerkleTreeDepth',
    inputs: [
      {
        name: 'groupId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMerkleTreeRoot',
    inputs: [
      {
        name: 'groupId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getNumberOfMerkleTreeLeaves',
    inputs: [
      {
        name: 'groupId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'startPoll',
    inputs: [
      {
        name: 'pollId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'encryptionKey',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'verifier',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract ISemaphoreVerifier',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'GroupCreated',
    inputs: [
      {
        name: 'groupId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'merkleTreeDepth',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'zeroValue',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MemberAdded',
    inputs: [
      {
        name: 'groupId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'index',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'identityCommitment',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'merkleTreeRoot',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MemberRemoved',
    inputs: [
      {
        name: 'groupId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'index',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'identityCommitment',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'merkleTreeRoot',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MemberUpdated',
    inputs: [
      {
        name: 'groupId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'index',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'identityCommitment',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'newIdentityCommitment',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'merkleTreeRoot',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PollCreated',
    inputs: [
      {
        name: 'pollId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'coordinator',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PollEnded',
    inputs: [
      {
        name: 'pollId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'coordinator',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'decryptionKey',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PollStarted',
    inputs: [
      {
        name: 'pollId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'coordinator',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'encryptionKey',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'VoteAdded',
    inputs: [
      {
        name: 'pollId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'vote',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AlreadyRegistered',
    inputs: [
      {
        name: 'voter',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidAttestation',
    inputs: [
      {
        name: 'message',
        type: 'string',
        internalType: 'string',
      },
    ],
  },
  {
    type: 'error',
    name: 'SelfEnrollmentOnly',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Semaphore__CallerIsNotThePollCoordinator',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Semaphore__GroupAlreadyExists',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Semaphore__GroupDoesNotExist',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Semaphore__MerkleTreeDepthIsNotSupported',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Semaphore__PollHasAlreadyBeenStarted',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Semaphore__PollIsNotOngoing',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Semaphore__YouAreUsingTheSameNillifierTwice',
    inputs: [],
  },
] as const
