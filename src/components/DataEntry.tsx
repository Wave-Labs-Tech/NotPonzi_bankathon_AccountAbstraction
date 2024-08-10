import React from 'react';
import { useUserContext } from '../contexts/UserContext';
// import '../App.css';
// import './App.css';

// interface ProductData {
//   modelNumber: string;
//   serialNumber: string;
//   participantName: string;
//   participantType: string;
//   cost: number;
//   fgTimeStamp: number;
//   productOwnerAddress: string;
// }
// interface OwnershipData {
//   productId: number,
//   productOwnerId: number,
//   productOwnerAddress: string
//   trxTimeStamp: number
// }
// interface ParticipantData {
//   userName: string,
//   participantType: string,
//   participantAddress: string
// }


interface ProductEntryProps {
  provider: any;
  contract: any;
  address: string;
  name: string;
  pass: string;
  participantAddress: any;
  participantType: string;
  modelNumber: string;
  serialNumber: string;
  partNumber: string;
  productCost :number;
  isLoading: boolean;
  user1: number;
  user2: number;
  theProductId: number;
  ownerId: number,
  theOwnershipId: number,
  setParticipantData: React.Dispatch<React.SetStateAction<any[] | undefined>>;
  setProductData: React.Dispatch<React.SetStateAction<any[] | undefined>>;
  setOwnershipData: React.Dispatch<React.SetStateAction<any[] | undefined>>;
  setProvenanceData: React.Dispatch<React.SetStateAction<any[] | undefined>>;
  setName: React.Dispatch<React.SetStateAction<string | ''>>; 
  setPass: React.Dispatch<React.SetStateAction<string| ''>>; 
  setParticipantAddress: React.Dispatch<React.SetStateAction<any | ''>>; 
  setParticipantType: React.Dispatch<React.SetStateAction<string | ''>>; 
  setOwnerId: React.Dispatch<React.SetStateAction<number>>; 
  setModelNumber: React.Dispatch<React.SetStateAction<string | ''>>; 
  setSerialNumber: React.Dispatch<React.SetStateAction<string | ''>>; 
  setProductCost: React.Dispatch<React.SetStateAction<number>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>; 
  setUser1: React.Dispatch<React.SetStateAction<number>>; 
  setUser2: React.Dispatch<React.SetStateAction<number>>; 
  setTheOwnershipId: React.Dispatch<React.SetStateAction<number>>; 
  setTheProductId: React.Dispatch<React.SetStateAction<number>>; 
  setIsProductModalOpen:React.Dispatch<React.SetStateAction<boolean>>; 
  setIsParticipantModalOpen:React.Dispatch<React.SetStateAction<boolean>>; 
  setIsNewOwnerModalOpen:React.Dispatch<React.SetStateAction<boolean>>; 
  // fetchProvenanceData: () => Promise<void>;
  addParticipant: (provider: any, contract: any, address: string, name: string, pass: string, 
    participantType:string, participantAddress: string, setIsParticipantModalOpen:React.Dispatch<React.SetStateAction<boolean>>, 
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,setParticipantData: React.Dispatch<React.SetStateAction<any[] | undefined>>,
    setName: React.Dispatch<React.SetStateAction<string>>,setPass: React.Dispatch<React.SetStateAction<string>>,
    setParticipantAddress: React.Dispatch<React.SetStateAction<string>>, setParticipantType: React.Dispatch<React.SetStateAction<string>>) => void;
  addProduct: (provider: any, contract: any, address: string, ownerId: number, modelNumber: string, partNumber: string, 
    serialNumber: string, productCost: number, setIsProductModalOpen:React.Dispatch<React.SetStateAction<boolean>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, setProductData: React.Dispatch<React.SetStateAction<any[] | undefined>>, 
    setOwnerId: React.Dispatch<React.SetStateAction<number>>,  setModelNumber: React.Dispatch<React.SetStateAction<string>>,
    setSerialNumber: React.Dispatch<React.SetStateAction<string>>, setProductCost: React.Dispatch<React.SetStateAction<number>>,
    ) => void;
  newOwner: (provider: any, contract: any, address: string, user1: number, user2: number, theProductId: number, theOwnershipId: number,
    setIsNewOwnerModalOpen:React.Dispatch<React.SetStateAction<boolean>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, 
    setOwnershipData: React.Dispatch<React.SetStateAction<any[] | undefined>>, setProvenanceData: React.Dispatch<React.SetStateAction<any[] | undefined>>,
    setUser1: React.Dispatch<React.SetStateAction<number>>,setUser2: React.Dispatch<React.SetStateAction<number>>,
    setTheOwnershipId: React.Dispatch<React.SetStateAction<number>>,setTheProductId: React.Dispatch<React.SetStateAction<number>>, 
    // fetchProvenanceData: () => Promise<void>
  ) => void;
}
const DataEntry: React.FC<ProductEntryProps> = ({
  provider, 
  contract,
  address,
  name,
  pass,
  participantAddress,
  participantType,
  modelNumber,
  serialNumber,
  partNumber,
  productCost,
  isLoading,
  // user1,
  user2,
  theProductId,
  ownerId,
  setParticipantData,
  setProductData,
  setOwnershipData,
  setProvenanceData,
  setName,
  setPass,
  setParticipantAddress,
  setParticipantType,
  setOwnerId,
  setModelNumber,
  setSerialNumber,
  setProductCost,
  setIsLoading,
  // setUser1,
  setUser2,
  setTheProductId,
  setIsProductModalOpen,
  setIsParticipantModalOpen,
  setIsNewOwnerModalOpen,
  addParticipant,
  addProduct,
  newOwner,
  // fetchProvenanceData
  // fetchOwnershipData,
  // fetchParticipantData
}) => {
  const {user1, setUser1, theOwnershipId, setTheOwnershipId} = useUserContext();
  const handleAddParticipant = async () => {
    addParticipant(
      provider, 
      contract, 
      address, 
      name,
      pass,
      participantType,
      participantAddress,
      setIsParticipantModalOpen,
      setIsLoading,
      setParticipantData,
      setName,
      setPass,
      setParticipantAddress,
      setParticipantType
    );
  };

  const handleAddProduct = async () => {
    addProduct(
      provider, 
      contract, 
      address, 
      ownerId,
      modelNumber,
      partNumber,
      serialNumber,
      productCost,
      setIsProductModalOpen,
      setIsLoading,
      setProductData,
      setOwnerId,
      setModelNumber,
      setSerialNumber,
      setProductCost
    );
  };

  const handleNewOwner = async () => {
    newOwner(
      provider, // Asegúrate de que `provider` está definido o es pasado como prop
      contract, 
      address,
      user1,
      user2,
      theProductId,
      theOwnershipId,
      setIsNewOwnerModalOpen,
      setIsLoading,
      setProvenanceData,
      setOwnershipData,
      setUser1,
      setUser2,
      setTheOwnershipId,
      setTheProductId,
      // fetchProvenanceData
    );
  };

  return (

// const ProductEntry = ({ name, pass, participantAddress, participantType, ownerId, modelNumber, serialNumber, productCost, user1, user2, theProductId, setName, setPass, setParticipantAddress, setParticipantType,setOwnerId, setModelNumber, setSerialNumber, setProductCost, setUser1, setUser2, setTheProductId }) => {
// }) => {  return (
  <div className=" flex flex-col flex-center m-auto w-full justify-evenly gap-2 p-2 text-stone-800">     
  <div className="flex flex-col justify-between gap-2 ">
      {/* Aquí va el contenido de la sección de entrada de datos del producto */}
      <div className="flex flex-row justify-between place-items-center p-1 m-auto w-full max-w-6xl border-2 border-stone-800 rounded-md">
      <h1 className="md:text-3xl w-auto text-[#292d67]">
        Entrada de datos</h1>
      <img src="trazable2.png" className={`h-10 w-60 rounded-md`} alt="TrazableDLT logo m2"/>
      </div>
      <div className="flex flex-col flex-center m-auto w-full max-w-6xl justify-evenly gap-2 ">

      {/* Sección de entrada de datos del participante */}
      <div></div>
      <div className="flex flex-row gap-2 w-full">
      <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row justify-evenly gap-2">
        {/* <div className="flex flex-col w-full max-w-xs"> */}
        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="name">Nombre de proveedor:</label>
          <input
            type="text"
            placeholder="Nombre del proveedor"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#292d67] border-2 border-stone-800 p-2 rounded-md w-full flex-grow text-base text-white md:text-xl"
            style={{ fontSize: '20px' }}
          />
        </div>
        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="pass">Password:</label>
          <input
            type="text"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="bg-[#292d67] border-2 border-stone-800 p-2 rounded-md w-full flex-grow text-base md:text-xl text-white"
            style={{ fontSize: '20px' }}
          />
        </div>

        </div>
        <div className="flex flex-row gap-2 justify-evenly">

        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="name">Cuenta del proveedor:</label>
          <input
            type="text"
            placeholder="Cuenta del proveedor"
            value={participantAddress}
            onChange={(e) => setParticipantAddress(e.target.value)}
            className="bg-[#292d67] border-2 border-stone-800 p-2 rounded-md w-full flex-grow text-base md:text-xl text-white"
            style={{ fontSize: '20px' }}
          />
        </div>
        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="pass">Tipo de proveedor:</label>
          <input
            type="text"
            placeholder="Tipo de proveedor"
            value={participantType}
            onChange={(e) => setParticipantType(e.target.value)}
            className="bg-[#292d67] border-2 border-stone-800 p-2 rounded-md w-full flex-grow text-base md:text-xl text-white"
            style={{ fontSize: '20px' }}
            />
        </div>
        </div>
        </div>
        <div className="content-end">
        <button
          className="py-1 px-3 h-12 w-56 mt-4 bg-[#ca0372]  text-white border-2 border-stone-800 rounded-md hover:bg-opacity-50 transition-all disabled:opacity-80 text-xl"
          onClick={handleAddParticipant}
          disabled={isLoading || !name || !pass || !participantAddress || !participantType}
        >
          {isLoading ? 'Añadiendo proveedor...' : '📤 Añadir proveedor'}
        </button>
      </div>
      </div>
      
      {/* Sección de entrada de datos del producto */}
      <div className="flex flex-row justify-between gap-2 w-full">
        {/* <div className="flex flex-row justify-strech w-full gap-4 mb-4 "> */}
        <div className="w-full flex flex-row flex-grow gap-1">
        <div className="flex flex-col max-w-xs">
          <label htmlFor="ownerId">Id del fabricante:</label>
          <input
            type="number"
            placeholder="Número de Id del fabricante"
            value={ownerId}
            min="0"
            onChange={(e) => setOwnerId(parseInt(e.target.value))}
            // className="w-28 bg-orange-100 border-2 border-stone-800 p-2 rounded-md  text-base md:text-xl"
            className="w-28 bg-[#292d67] border-2 border-stone-800 p-2 rounded-md text-base md:text-xl text-white"
            style={{fontSize: '20px' }}
          />
        </div>
        <div className="flex flex-col flex-grow">
          <label htmlFor="modelNumber">Número de modelo:</label>
          <input
            type="text"
            placeholder="Número del producto"
            value={modelNumber}
            onChange={(e) => setModelNumber(e.target.value)}
            className="flex-grow bg-[#292d67] border-2 border-stone-800 p-2 rounded-md text-base md:text-xl text-white"
            style={{ fontSize: '20px' }}
            // style={{ backgroundColor: '#5e606d', fontSize: '20px' }}
          />
          </div>
          <div className="flex flex-col flex-grow">
          <label htmlFor="serialNumber">Número de serie:</label>
          <input
            type="text"
            placeholder="Número de serie del producto" 
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="flex-grow bg-[#292d67] border-2 border-stone-800 p-2 rounded-md text-base md:text-xl text-white"
            style={{fontSize: '20px' }}
          />
          </div>
          <div className="flex flex-col max-w-xs">
          {/* <label htmlFor="productCost">Coste del producto:</label> */}
          <label htmlFor="serialNumber">Coste del producto:</label>
          <input
            type="number"
            placeholder="Coste del producto"
            min="0"
            value={productCost}
            onChange={(e) => setProductCost(parseFloat(e.target.value))}
            // className="w-1/3 h-12 mt-6 bg-orange-100 border-2 border-stone-800 p-2 rounded-md  text-base md:text-xl"
            className="w-36 bg-[#292d67] border-2 border-stone-800 p-2 rounded-md  text-base md:text-xl text-white"
            // className="w-full bg-orange-100 border-2 border-stone-800 p-2 rounded-md  text-base md:text-xl"
            // style={{ backgroundColor: '#5e606d', fontSize: '20px' }}
            style={{ fontSize: '20px' }}
          />
        </div>
        </div>
        <div>
        <button
          className="py-1 px-3 h-12 w-56 mt-6 bg-[#ca0372] text-white border-2 border-stone-800 rounded-md hover:bg-opacity-50 transition-all disabled:opacity-80 text-xl"
          onClick={handleAddProduct}
          disabled={isLoading || !ownerId || !modelNumber || !serialNumber || !productCost}
          >
          {isLoading ? 'Añadiendo producto...' : '📤 Añadir producto'}
        </button>
        </div>
      </div>

      {/* Sección para mover el producto */}
        {/* <div className="flex flex-col flex-grow w-full max-w-xs"> */}
        <div className="flex flex-row gap-2">
        <div className="flex flex-col max-w-xs">
          <label htmlFor="theProductId">Id del producto:</label>
          <input
            type="number"
            placeholder="Número de Id del producto"
            min="0"
            value={theProductId}
            onChange={(e) => setTheProductId(parseInt(e.target.value))}
            className="w-28 h-12 bg-[#292d67] border-2 border-stone-800 p-2 rounded-md text-base md:text-xl text-white"
            style={{ fontSize: '20px' }}
          />
        </div>
        <div className="flex flex-col flex-grow max-w-md">
        <label htmlFor="user1">Mover el producto de este proveedor...</label>
        <input
          type="number"
          placeholder="Número de Id del poseedor actual"
          value={user1}
          min="0"
          onChange={(e) => setUser1(parseInt(e.target.value))}
          className="flex-grow max-w-md bg-[#292d67] p-2 border-2 border-stone-800  rounded-md text-base md:text-xl text-white"
          style={{ fontSize: '20px' }}
        />
        </div>
        <div className="flex flex-col flex-grow max-w-md">
          <label htmlFor="user2">...a este proveedor:</label>
          <input
            type="number"
            placeholder="Número de Id del próximo poseedor"
            min="0"
            value={user2}
            onChange={(e) => setUser2(parseInt(e.target.value))}
            // className="py-1 px-3 h-12 flex-grow bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-full text-base md:text-xl"
            className=" flex-grow  bg-[#292d67] p-2 border-2 border-stone-800 rounded-md text-base md:text-xl text-white"
            style={{ fontSize: '20px' }}
          />
        <div>
        </div>
        </div>

        <button
          className="w-56 h-12 mt-6 bg-[#ca0372] text-white border-2 border-stone-800 rounded-md hover:bg-opacity-50  transition-all disabled:opacity-80 text-xl"
          onClick={handleNewOwner}
          disabled={isLoading || !user1 || !user2 || !theProductId}
          >
          {isLoading ? 'Moviendo el producto...' : '📤 Mover el producto'}
        </button>
      </div>
    </div>
  </div>
  </div>
  );
};

export default DataEntry;