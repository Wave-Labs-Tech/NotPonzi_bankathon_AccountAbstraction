import formatDate  from  '../utils/FormatDate';
export class Participant {
    name: string;
    participantType: string;
    participantAddress: string;
    id: string;
  
    constructor(name: string, participantType: string, participantAddress: string, participantId: string) {
      this.name = name;
      this.participantType = participantType;
      this.participantAddress = participantAddress;
      this.id = `participant-${participantId}-` + crypto.randomUUID(); // Asegúrate de que crypto.randomUUID() esté disponible en tu entorno

    }
  }
  export class Product {
    id: string;
    // ownerId :number | undefined;
    modelNumber: string;
    serialNumber: string;
    participantName: string;
    participantType: string;
    productCost: number | undefined;
    // mfgTimeStamp: Date | undefined;
    mfgTimeStamp: string;
    participantAddress: string;
  
    // constructor(ownerId: number, modelNumber: string, serialNumber: string, participantName: string, participantType: string, productCost: number, mfgTimeStamp: Date, participantAddress: string) {
    constructor(modelNumber: string, serialNumber: string, participantName: string, participantType: string, productCost: number, _mfgTimeStamp: bigint, participantAddress: string, addProductID: string) {
      // this.ownerId = ownerId;
      this.modelNumber = modelNumber;
      this.serialNumber = serialNumber;
      this.participantName = participantName;
      this.participantType = participantType;
      this.productCost = productCost;
      // this.mfgTimeStamp = mfgTimeStamp;
      this.mfgTimeStamp = formatDate(_mfgTimeStamp);
      this.participantAddress = participantAddress;
      this.id = `product-${addProductID}-` + crypto.randomUUID(); // Asegúrate de que crypto.randomUUID() esté disponible en tu entorno
      console.log("Datos Producto: ", modelNumber, serialNumber, productCost, this.id);
    }
  }
  export class Ownership {
    id: string;
    productId: number;
    productOwnerId: number;
    // pass: string;
    trxTimeStamp: string;
    productOwnerAddress: string;
  
    // constructor(name: string, pass: string, participantType: string, participantAddress: string) {
    constructor(productId: number, productOwnerId: number, productOwnerAddress: string, _trxTimeStamp: bigint, ownershipId: string) {
      this.productId = productId;
      this.productOwnerId = productOwnerId;
      this.productOwnerAddress = productOwnerAddress;
      this.trxTimeStamp = formatDate(_trxTimeStamp);
      this.id = `ownership-${ownershipId}-` + crypto.randomUUID(); // Asegúrate de que crypto.randomUUID() esté disponible en tu entorno
      console.log("Datos Ownership: ", productId, productOwnerId, productOwnerAddress, this.trxTimeStamp, this.id);
    }
  }
