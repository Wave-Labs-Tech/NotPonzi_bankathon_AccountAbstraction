export const abi = [
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
            "inputs": [],
            "name": "NotSigner",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "productId",
                    "type": "uint256"
                }
            ],
            "name": "TransferOwnership",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_signer",
                    "type": "address"
                },
                {
                    "internalType": "bytes32",
                    "name": "_hash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes",
                    "name": "_signature",
                    "type": "bytes"
                },
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_pass",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_pType",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "_pAdd",
                    "type": "address"
                }
            ],
            "name": "addParticipant",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
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
                    "name": "_signer",
                    "type": "address"
                },
                {
                    "internalType": "bytes32",
                    "name": "_hash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes",
                    "name": "_signature",
                    "type": "bytes"
                },
                {
                    "internalType": "uint256",
                    "name": "_productOwnerId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_modelNumber",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_partNumber",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_serialNumber",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_productCost",
                    "type": "uint256"
                }
            ],
            "name": "addProduct",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
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
                    "name": "_signer",
                    "type": "address"
                },
                {
                    "internalType": "bytes32",
                    "name": "_hash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes",
                    "name": "_signature",
                    "type": "bytes"
                },
                {
                    "internalType": "uint256",
                    "name": "_user1Id",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_user2Id",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_prodId",
                    "type": "uint256"
                }
            ],
            "name": "newOwner",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_uid",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_uname",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_pass",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_utype",
                    "type": "string"
                }
            ],
            "name": "authenticateParticipant",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_regId",
                    "type": "uint256"
                }
            ],
            "name": "getOwnership",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
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
                    "internalType": "uint256",
                    "name": "_participant_id",
                    "type": "uint256"
                }
            ],
            "name": "getParticipant",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
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
                    "internalType": "uint256",
                    "name": "_productId",
                    "type": "uint256"
                }
            ],
            "name": "getProduct",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
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
                    "internalType": "uint256",
                    "name": "_productId",
                    "type": "uint256"
                }
            ],
            "name": "getproductOwnerData",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
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
                    "internalType": "uint256",
                    "name": "_prodId",
                    "type": "uint256"
                }
            ],
            "name": "getProvenance",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner_id",
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
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "ownerships",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "productId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "productOwnerId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "trxTimeStamp",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "productOwnerAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "participant_id",
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
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "participants",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "userName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "password",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "participantType",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "participantAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "product_id",
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
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "products",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "modelNumber",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "partNumber",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "serialNumber",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "participantName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "participantType",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "cost",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "mfgTimeStamp",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "productOwnerAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "productTrack",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]