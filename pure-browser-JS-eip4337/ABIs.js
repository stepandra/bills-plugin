// goerli:
const RPCuri = "https://rpc-evm-sidechain.xrpl.org";
const BUNDLERuri = "https://seahorse-app-tyrb7.ondigitalocean.app/rpc";
const chainID = "0x15F902";

const addr_Entrypoint = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
const addr_SimpleAccountFactory = '0x9406Cc6185a346906296840746125a0E44976454';
const addr_PurePaymaster = '0x749dd43e35A9D917763a188d2945E0C43f9112a7';

//logic contracts
const addr_RequestFactory = "0xCc6a1C5CecEFC85Ee80350D6820152D1081fE48a";

const addr_ERC20PaymentProxy = "0x6FbEf10f8e1Ae82A66ee6AEec394A9f0c6a64263";

const addr_NativePaymentProxy = "0xe198285bD9EA7A3Bf10065DA711F45B6D4A3761F";  

let salt = '0x11122024';

const accountABI = ["function execute(address to, uint256 value, bytes data)"];

//======= logic ABIs =====================================
const ABI_RequestFactory = `

[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_storageManager",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newRequest",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "requestType",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "payer",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "payee",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "RequestDeployed",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "requestType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "payer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "payee",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "salt",
          "type": "uint256"
        }
      ],
      "name": "createRequest",
      "outputs": [
        {
          "internalType": "contract Request",
          "name": "ret",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "requestType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "payer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "payee",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "salt",
          "type": "uint256"
        }
      ],
      "name": "getAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "requestImplementation",
      "outputs": [
        {
          "internalType": "contract Request",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

`; 

const ABI_Request = `
[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_storageManager",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        }
      ],
      "name": "AddressEmptyCode",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ECDSAInvalidSignature",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "length",
          "type": "uint256"
        }
      ],
      "name": "ECDSAInvalidSignatureLength",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "ECDSAInvalidSignatureS",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "implementation",
          "type": "address"
        }
      ],
      "name": "ERC1967InvalidImplementation",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ERC1967NonPayable",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "FailedInnerCall",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidInitialization",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotInitializing",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "UUPSUnauthorizedCallContext",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "slot",
          "type": "bytes32"
        }
      ],
      "name": "UUPSUnsupportedProxiableUUID",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "version",
          "type": "uint64"
        }
      ],
      "name": "Initialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "RequestAccepted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "RequestAmountEdited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "RequestCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "storageManager",
          "type": "address"
        }
      ],
      "name": "RequestCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "requestType",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "payer",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "payee",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "RequestInitialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "implementation",
          "type": "address"
        }
      ],
      "name": "Upgraded",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "UPGRADE_INTERFACE_VERSION",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "accept",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "amount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "asset",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "cancel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "edit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "action",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "getMessageHash",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_type",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "_payer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_payee",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_asset",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "payee",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "payer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "proxiableUUID",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "requestData",
      "outputs": [
        {
          "internalType": "string",
          "name": "requestType",
          "type": "string"
        },
        {
          "internalType": "enum Request.Status",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "storageManager",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "upgradeToAndCall",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ]
`;

const ABI_NativePaymentProxy = `
[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "referenceId",
          "type": "address"
        }
      ],
      "name": "TransferWithReferenceExecuted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "referenceId",
          "type": "address"
        }
      ],
      "name": "transferWithReference",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]
`;

//======= service ABIs ===================================

const ABI_SimpleAccountFactory =
  `[{"inputs":[{"internalType":"contract IEntryPoint","name":"_entryPoint","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"accountImplementation","outputs":[{"internalType":"contract SimpleAccount","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"salt","type":"uint256"}],"name":"createAccount","outputs":[{"internalType":"contract SimpleAccount","name":"ret","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"salt","type":"uint256"}],"name":"getAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]`;

const ABI_Entrypoint = `
[
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "preOpGas",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "paid",
          "type": "uint256"
        },
        {
          "internalType": "uint48",
          "name": "validAfter",
          "type": "uint48"
        },
        {
          "internalType": "uint48",
          "name": "validUntil",
          "type": "uint48"
        },
        {
          "internalType": "bool",
          "name": "targetSuccess",
          "type": "bool"
        },
        {
          "internalType": "bytes",
          "name": "targetResult",
          "type": "bytes"
        }
      ],
      "name": "ExecutionResult",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "opIndex",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "reason",
          "type": "string"
        }
      ],
      "name": "FailedOp",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "SenderAddressResult",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "aggregator",
          "type": "address"
        }
      ],
      "name": "SignatureValidationFailed",
      "type": "error"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "preOpGas",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "prefund",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "sigFailed",
              "type": "bool"
            },
            {
              "internalType": "uint48",
              "name": "validAfter",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "validUntil",
              "type": "uint48"
            },
            {
              "internalType": "bytes",
              "name": "paymasterContext",
              "type": "bytes"
            }
          ],
          "internalType": "struct IEntryPoint.ReturnInfo",
          "name": "returnInfo",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "stake",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "unstakeDelaySec",
              "type": "uint256"
            }
          ],
          "internalType": "struct IStakeManager.StakeInfo",
          "name": "senderInfo",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "stake",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "unstakeDelaySec",
              "type": "uint256"
            }
          ],
          "internalType": "struct IStakeManager.StakeInfo",
          "name": "factoryInfo",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "stake",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "unstakeDelaySec",
              "type": "uint256"
            }
          ],
          "internalType": "struct IStakeManager.StakeInfo",
          "name": "paymasterInfo",
          "type": "tuple"
        }
      ],
      "name": "ValidationResult",
      "type": "error"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "preOpGas",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "prefund",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "sigFailed",
              "type": "bool"
            },
            {
              "internalType": "uint48",
              "name": "validAfter",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "validUntil",
              "type": "uint48"
            },
            {
              "internalType": "bytes",
              "name": "paymasterContext",
              "type": "bytes"
            }
          ],
          "internalType": "struct IEntryPoint.ReturnInfo",
          "name": "returnInfo",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "stake",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "unstakeDelaySec",
              "type": "uint256"
            }
          ],
          "internalType": "struct IStakeManager.StakeInfo",
          "name": "senderInfo",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "stake",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "unstakeDelaySec",
              "type": "uint256"
            }
          ],
          "internalType": "struct IStakeManager.StakeInfo",
          "name": "factoryInfo",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "stake",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "unstakeDelaySec",
              "type": "uint256"
            }
          ],
          "internalType": "struct IStakeManager.StakeInfo",
          "name": "paymasterInfo",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "aggregator",
              "type": "address"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "stake",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "unstakeDelaySec",
                  "type": "uint256"
                }
              ],
              "internalType": "struct IStakeManager.StakeInfo",
              "name": "stakeInfo",
              "type": "tuple"
            }
          ],
          "internalType": "struct IEntryPoint.AggregatorStakeInfo",
          "name": "aggregatorInfo",
          "type": "tuple"
        }
      ],
      "name": "ValidationResultWithAggregation",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "userOpHash",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "factory",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "paymaster",
          "type": "address"
        }
      ],
      "name": "AccountDeployed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "BeforeExecution",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalDeposit",
          "type": "uint256"
        }
      ],
      "name": "Deposited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "aggregator",
          "type": "address"
        }
      ],
      "name": "SignatureAggregatorChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalStaked",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "unstakeDelaySec",
          "type": "uint256"
        }
      ],
      "name": "StakeLocked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "withdrawTime",
          "type": "uint256"
        }
      ],
      "name": "StakeUnlocked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "withdrawAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "StakeWithdrawn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "userOpHash",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "paymaster",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "actualGasCost",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "actualGasUsed",
          "type": "uint256"
        }
      ],
      "name": "UserOperationEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "userOpHash",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "revertReason",
          "type": "bytes"
        }
      ],
      "name": "UserOperationRevertReason",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "withdrawAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Withdrawn",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "SIG_VALIDATION_FAILED",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "initCode",
          "type": "bytes"
        },
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "paymasterAndData",
          "type": "bytes"
        }
      ],
      "name": "_validateSenderAndPaymaster",
      "outputs": [],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "unstakeDelaySec",
          "type": "uint32"
        }
      ],
      "name": "addStake",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "depositTo",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "deposits",
      "outputs": [
        {
          "internalType": "uint112",
          "name": "deposit",
          "type": "uint112"
        },
        {
          "internalType": "bool",
          "name": "staked",
          "type": "bool"
        },
        {
          "internalType": "uint112",
          "name": "stake",
          "type": "uint112"
        },
        {
          "internalType": "uint32",
          "name": "unstakeDelaySec",
          "type": "uint32"
        },
        {
          "internalType": "uint48",
          "name": "withdrawTime",
          "type": "uint48"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "getDepositInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint112",
              "name": "deposit",
              "type": "uint112"
            },
            {
              "internalType": "bool",
              "name": "staked",
              "type": "bool"
            },
            {
              "internalType": "uint112",
              "name": "stake",
              "type": "uint112"
            },
            {
              "internalType": "uint32",
              "name": "unstakeDelaySec",
              "type": "uint32"
            },
            {
              "internalType": "uint48",
              "name": "withdrawTime",
              "type": "uint48"
            }
          ],
          "internalType": "struct IStakeManager.DepositInfo",
          "name": "info",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint192",
          "name": "key",
          "type": "uint192"
        }
      ],
      "name": "getNonce",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "initCode",
          "type": "bytes"
        }
      ],
      "name": "getSenderAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "initCode",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "callData",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "callGasLimit",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "verificationGasLimit",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "preVerificationGas",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxFeePerGas",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxPriorityFeePerGas",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "paymasterAndData",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            }
          ],
          "internalType": "struct UserOperation",
          "name": "userOp",
          "type": "tuple"
        }
      ],
      "name": "getUserOpHash",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "sender",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "nonce",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "initCode",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "callData",
                  "type": "bytes"
                },
                {
                  "internalType": "uint256",
                  "name": "callGasLimit",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "verificationGasLimit",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "preVerificationGas",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "maxFeePerGas",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "maxPriorityFeePerGas",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "paymasterAndData",
                  "type": "bytes"
                },
                {
                  "internalType": "bytes",
                  "name": "signature",
                  "type": "bytes"
                }
              ],
              "internalType": "struct UserOperation[]",
              "name": "userOps",
              "type": "tuple[]"
            },
            {
              "internalType": "contract IAggregator",
              "name": "aggregator",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            }
          ],
          "internalType": "struct IEntryPoint.UserOpsPerAggregator[]",
          "name": "opsPerAggregator",
          "type": "tuple[]"
        },
        {
          "internalType": "address payable",
          "name": "beneficiary",
          "type": "address"
        }
      ],
      "name": "handleAggregatedOps",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "initCode",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "callData",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "callGasLimit",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "verificationGasLimit",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "preVerificationGas",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxFeePerGas",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxPriorityFeePerGas",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "paymasterAndData",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            }
          ],
          "internalType": "struct UserOperation[]",
          "name": "ops",
          "type": "tuple[]"
        },
        {
          "internalType": "address payable",
          "name": "beneficiary",
          "type": "address"
        }
      ],
      "name": "handleOps",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint192",
          "name": "key",
          "type": "uint192"
        }
      ],
      "name": "incrementNonce",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "callData",
          "type": "bytes"
        },
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "sender",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "nonce",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "callGasLimit",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "verificationGasLimit",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "preVerificationGas",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "paymaster",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "maxFeePerGas",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "maxPriorityFeePerGas",
                  "type": "uint256"
                }
              ],
              "internalType": "struct EntryPoint.MemoryUserOp",
              "name": "mUserOp",
              "type": "tuple"
            },
            {
              "internalType": "bytes32",
              "name": "userOpHash",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "prefund",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "contextOffset",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "preOpGas",
              "type": "uint256"
            }
          ],
          "internalType": "struct EntryPoint.UserOpInfo",
          "name": "opInfo",
          "type": "tuple"
        },
        {
          "internalType": "bytes",
          "name": "context",
          "type": "bytes"
        }
      ],
      "name": "innerHandleOp",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "actualGasCost",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint192",
          "name": "",
          "type": "uint192"
        }
      ],
      "name": "nonceSequenceNumber",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "initCode",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "callData",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "callGasLimit",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "verificationGasLimit",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "preVerificationGas",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxFeePerGas",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxPriorityFeePerGas",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "paymasterAndData",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            }
          ],
          "internalType": "struct UserOperation",
          "name": "op",
          "type": "tuple"
        },
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "targetCallData",
          "type": "bytes"
        }
      ],
      "name": "simulateHandleOp",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "initCode",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "callData",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "callGasLimit",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "verificationGasLimit",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "preVerificationGas",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxFeePerGas",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxPriorityFeePerGas",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "paymasterAndData",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            }
          ],
          "internalType": "struct UserOperation",
          "name": "userOp",
          "type": "tuple"
        }
      ],
      "name": "simulateValidation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unlockStake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "withdrawAddress",
          "type": "address"
        }
      ],
      "name": "withdrawStake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "withdrawAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "withdrawAmount",
          "type": "uint256"
        }
      ],
      "name": "withdrawTo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]

`;

const ABI_ERC20PaymentProxy = `
[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "referenceId",
          "type": "address"
        }
      ],
      "name": "TransferWithReferenceExecuted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "referenceId",
          "type": "address"
        }
      ],
      "name": "transferWithReference",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]
`;
