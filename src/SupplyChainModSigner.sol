// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
using ECDSA for bytes32;

contract supplyChain {
    //CAMBIAR A 1 PARA EVITAR ERRORE Y VOLVER A DESPLEGAR
    uint256 public product_id = 1;   // Product ID
    uint256 public participant_id = 1;   // Participant ID
    uint256 public owner_id = 1;   // Ownership ID
 

    struct product {
        string modelNumber;
        string partNumber;
        string serialNumber;
        string participantName;
        string participantType;
        uint256 cost;
        uint256 mfgTimeStamp;
        address productOwnerAddress;
    }

    mapping(uint256 => product) public products;

    struct participant {
        string userName;
        string password;
        string participantType;
        address participantAddress;
    }
    mapping(uint256 => participant) public participants;

    struct ownership {
        uint256 productId;
        uint256 productOwnerId;
        uint256 trxTimeStamp;
        address productOwnerAddress;
    }
    mapping(uint256 => ownership) public ownerships; // ownerships by ownership ID (owner_id)
    mapping(uint256 => uint256[]) public productTrack;  // ownerships by Product ID (product_id) / Movement track for a product

    event TransferOwnership(uint256 productId);

    error NotSigner();

    modifier onlyOwner(uint256 _productId) {
         require(msg.sender == products[_productId].productOwnerAddress,"");
         _;

    }

    modifier verifySignature(
        address _signer,
        bytes32 _hash,
        bytes memory _signature
    ){
        _checkSigner(_signer, _hash, _signature);
        _;
    }

    function _checkSigner(
        address _signer,
        bytes32 _hash,
        bytes memory _signature      
    ) internal pure{
        bool isSigner = _hash.recover(_signature) == _signer;
        if(!isSigner){
            revert NotSigner();
        }
    }

    function addParticipant(address _signer,
                        bytes32 _hash, 
                        bytes memory _signature,
                        string memory _name, 
                        string memory _pass, 
                        string memory _pType, 
                        address _pAdd) public verifySignature(_signer, _hash, _signature) returns (uint256){
                        uint256 userId = participant_id++;
        participants[userId].userName = _name;
        participants[userId].password = _pass;
        participants[userId].participantType = _pType;
        participants[userId].participantAddress = _pAdd;

        return userId;
    }

    function getParticipant(uint256 _participant_id) public view returns (string memory, string memory, address) {
        return (participants[_participant_id].userName,
                participants[_participant_id].participantType,
                participants[_participant_id].participantAddress);
    }

    function addProduct(address _signer,
                        bytes32 _hash, 
                        bytes memory _signature,
                        uint256 _productOwnerId,
                        string memory _modelNumber,
                        string memory _partNumber,
                        string memory _serialNumber,
                        uint256 _productCost) public verifySignature(_signer, _hash, _signature) returns (uint256) {
        if(keccak256(abi.encodePacked(participants[_productOwnerId].participantType)) == keccak256("Manufacturer")) {
            uint256 productId = product_id++;

            products[productId].modelNumber = _modelNumber;
            products[productId].partNumber = _partNumber;
            products[productId].serialNumber = _serialNumber;
            products[productId].participantName= participants[_productOwnerId].userName;
            products[productId].participantType = participants[_productOwnerId].participantType;
            products[productId].cost = _productCost;
            products[productId].mfgTimeStamp = uint256(block.timestamp);
            products[productId].productOwnerAddress = participants[_productOwnerId].participantAddress;

            return productId;
        }

       return 0;
    }


    // function getProduct(uint256 _productId) public view returns (string memory, string memory, string memory, string memory, string memory, uint256, uint256, address){
    function getProduct(uint256 _productId) public view returns (string memory, string memory, string memory, string memory, uint256, uint256, address){
        return (products[_productId].modelNumber,
                // products[_productId].partNumber,
                products[_productId].serialNumber,
                products[_productId].participantName,
                products[_productId].participantType,
                products[_productId].cost,
                products[_productId].mfgTimeStamp,
                products[_productId].productOwnerAddress);
    }
    function getproductOwnerData(uint256 _productId) public view returns (string memory, string memory, address){
        return (products[_productId].participantName,
                products[_productId].participantType,
                products[_productId].productOwnerAddress);
    }

    // function newOwner(uint256 _user1Id,uint256 _user2Id, uint256 _prodId) onlyOwner(_prodId) public returns (bool) {
    function newOwner(address _signer,
                        bytes32 _hash, 
                        bytes memory _signature,
                        uint256 _user1Id,
                        uint256 _user2Id, 
                        uint256 _prodId) public verifySignature(_signer, _hash, _signature) returns (bool) {
        participant memory p1 = participants[_user1Id];
        participant memory p2 = participants[_user2Id];
        uint256 ownership_id = owner_id++;

        if(keccak256(abi.encodePacked(p1.participantType)) == keccak256("Manufacturer")
            && keccak256(abi.encodePacked(p2.participantType))==keccak256("Supplier")){
            ownerships[ownership_id].productId = _prodId;
            ownerships[ownership_id].productOwnerAddress = p2.participantAddress;
            ownerships[ownership_id].productOwnerId = _user2Id;
            ownerships[ownership_id].trxTimeStamp = uint256(block.timestamp);
            products[_prodId].productOwnerAddress = p2.participantAddress;
            products[_prodId].participantName = p2.userName;
            products[_prodId].participantType = p2.participantType;
            productTrack[_prodId].push(ownership_id);
            emit TransferOwnership(_prodId);

            return (true);
        }
        else if(keccak256(abi.encodePacked(p1.participantType)) == keccak256("Supplier") && keccak256(abi.encodePacked(p2.participantType))==keccak256("Supplier")){
            ownerships[ownership_id].productId = _prodId;
            ownerships[ownership_id].productOwnerAddress = p2.participantAddress;
            ownerships[ownership_id].productOwnerId = _user2Id;
            ownerships[ownership_id].trxTimeStamp = uint256(block.timestamp);
            products[_prodId].productOwnerAddress = p2.participantAddress;
            products[_prodId].participantName = p2.userName;
            products[_prodId].participantType = p2.participantType;
            productTrack[_prodId].push(ownership_id);
            emit TransferOwnership(_prodId);

            return (true);
        }
        else if(keccak256(abi.encodePacked(p1.participantType)) == keccak256("Supplier") && keccak256(abi.encodePacked(p2.participantType))==keccak256("Consumer")){
            ownerships[ownership_id].productId = _prodId;
            ownerships[ownership_id].productOwnerAddress = p2.participantAddress;
            ownerships[ownership_id].productOwnerId = _user2Id;
            ownerships[ownership_id].trxTimeStamp = uint256(block.timestamp);
            products[_prodId].productOwnerAddress = p2.participantAddress;
            products[_prodId].participantName = p2.userName;
            products[_prodId].participantType = p2.participantType;
            productTrack[_prodId].push(ownership_id);
            emit TransferOwnership(_prodId);

            return (true);
        }

        return (false);
    }

   function getProvenance(uint256 _prodId) external view returns (uint256[] memory) {

       return productTrack[_prodId];
    }

    function getOwnership(uint256 _regId)  public view returns (uint256,uint256,address,uint256) {

        ownership memory r = ownerships[_regId];

         return (r.productId,r.productOwnerId,r.productOwnerAddress,r.trxTimeStamp);
    }

    function authenticateParticipant(uint256 _uid,
                                    string memory _uname,
                                    string memory _pass,
                                    string memory _utype) public view returns (bool){
        if(keccak256(abi.encodePacked(participants[_uid].participantType)) == keccak256(abi.encodePacked(_utype))) {
            if(keccak256(abi.encodePacked(participants[_uid].userName)) == keccak256(abi.encodePacked(_uname))) {
                if(keccak256(abi.encodePacked(participants[_uid].password)) == keccak256(abi.encodePacked(_pass))) {
                    return (true);
                }
            }
        }

        return (false);
    }
}