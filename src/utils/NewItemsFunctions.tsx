
import { contract } from 'web3/lib/commonjs/eth.exports';
import { Contract, ethers, hashMessage, JsonRpcProvider, Wallet } from 'ethers';
import { toast } from 'react-toastify';

import { addItemToLocalStorage } from './StorageFuntions';
import { Participant, Product, Ownership } from './Types';
import { signMessage} from '../utils/SignMessageFunction';


export const addParticipant = async (
  provider: any,
  contract: any,
  address: string,
  name: string,
  pass: string,
  participantType: string,
  participantAddress: string,
  setIsParticipantModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setParticipantData: React.Dispatch<React.SetStateAction<any[] | undefined>>,
  setName: React.Dispatch<React.SetStateAction<string>>,
  setPass: React.Dispatch<React.SetStateAction<string>>,
  setParticipantType: React.Dispatch<React.SetStateAction<string>>,
  setParticipantAddress: React.Dispatch<React.SetStateAction<string>>,
) => {
        try {
          setIsLoading(true);
          const message = "Hola, TraZableDLT pagará el gas por ti";
          const hash = hashMessage(message);
          // console.log("HASH", hash);
          const signature = await signMessage(message, provider);
          // console.log("SIGNATURE", signature);
    
          if (!contract) {
            throw new Error("Contract not found");
          }
    
          const addParticipantID = await contract.participant_id(); // Asegúrate de que este método existe y devuelve el último productId
          const addParticipantTx = await contract.addParticipant(address, hash, signature, name, pass, participantType, participantAddress, {
            gasLimit: 5000000,
          });
          await addParticipantTx.wait();
    
          if(addParticipantTx){

              let participant = new Participant(
                  name,
                  participantType,
                  participantAddress,
                  addParticipantID.toString()
                )
                
                addItemToLocalStorage(participant, "participant");
                // console.log("participantId.toString():", participantId.toString());
                // console.log("PARTICIPANT:", participant);
                // console.log("addParticipantID - 1:", (parseInt(addParticipantID) - 1).toString());
                setParticipantData(await contract.getParticipant(addParticipantID));
                // setParticipantData(participant);
            }
                
                toast("Participant added successfully");
                setIsParticipantModalOpen(true);
            } catch (error) {
                console.error(error);
                toast.error('Error while adding participant. Try again.')
        } finally {
          setIsLoading(false);
        }
        // console.log("ParticipantAddress", participantAddress);
        // console.log("Adress", address);
        setName('');
        setPass('');
        setParticipantAddress('');
        setParticipantType('');
        setIsLoading(true)
      };

      export const addProduct = async (
        provider: any,
        contract: any,
        address: string,
        ownerId: number, 
        modelNumber: string,
        partNumber: string, 
        serialNumber: string, 
        productCost: number,
        // productData: any,
        setIsProductModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setProductData: React.Dispatch<React.SetStateAction<any[] | undefined>>,
        setOwnerId: React.Dispatch<React.SetStateAction<number>>,
        setModelNumber: React.Dispatch<React.SetStateAction<string>>,
        setSerialNumber: React.Dispatch<React.SetStateAction<string>>,
        setProductCost: React.Dispatch<React.SetStateAction<number>>
      ) => {
        try {
          setIsLoading(true);
          const message = "Hola, TraZableDLT pagará el gas por ti";
          const hash = hashMessage(message);
          const signature = await signMessage(message, provider);
    
          if (!contract) {
            throw new Error("Contract not found");
          }
    
          // const addProductID = addProductTx.toNumber();
          const addProductID = await contract.product_id(); 
          console.log("___addProductID:", addProductID.toString());
    
          const addProductTx = await contract.addProduct(address, hash, signature, ownerId, modelNumber, partNumber, serialNumber, productCost, {
            gasLimit: 5000000,
          });
          const receipt = await addProductTx.wait();
          // console.log("Producto añadido con ID ANTES:", addProductTx.toString());
          console.log("___receipt:", receipt);
    
          // console.log("Producto añadido con ID DES:", (parseInt(addProductID) - 1).toString());
          if(receipt && addProductID){

            // const _productData = await contract.getProduct(parseInt(addProductID.toString()))
            const _productData = await contract.getProduct(parseInt(addProductID));
            // await _productData.wait();
            console.log("_productData:", _productData);
            setProductData(_productData);
            
            let product = new Product(
              _productData ? (_productData[0]).toString() : '',
              _productData ? (_productData[1]).toString() : '',
              _productData ? (_productData[2]).toString() : '',
              _productData ? (_productData[3]).toString() : '',
              _productData ? parseInt(_productData[4].toString()) : 0,
              _productData ? _productData[5]: 0,
              _productData ? (_productData[6]).toString() : '',
              (parseInt(addProductID)).toString())
              console.log("SET_ITEM_DATA:", product.id, JSON.stringify(product));
              // localStorage.setItem(product.id, JSON.stringify(product));
              // addProductToLocalStorage(product, productId.toString());
              addItemToLocalStorage(product, "product");
              // fetchProductData(addProductID.toString());
              
              toast("Product added successfully");
              setIsProductModalOpen(true);
              
          }
        } catch (error) {
          console.error(error);
          toast.error('Error while adding product. Try again.')
        } finally {
          setIsLoading(false);
        }
        // console.log("ParticipantAddress", participantAddress);
        // console.log("Adress", address);
        setOwnerId(0);
        setModelNumber('');
        setSerialNumber('');
        setProductCost(0);
        // console.log("Adress", address);
      };
      // console.log("Product Data", productData);
    
      export const newOwner = async (
        provider: any,
        contract: any,
        address: string,
        user1: number, 
        user2: number, 
        theProductId: number, 
        theOwnershipId: number,
        // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
        // setIsNewOwnerModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
        setIsNewOwnerModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setProvenanceData: React.Dispatch<React.SetStateAction<any[] | undefined>>,
        setOwnershipData: React.Dispatch<React.SetStateAction<any[] | undefined>>,
        setTheOwnershipId: React.Dispatch<React.SetStateAction<number>>,
        setUser2: React.Dispatch<React.SetStateAction<number>>,
        setTheProductId: React.Dispatch<React.SetStateAction<number>>,
        // fetchProvenanceData: () => Promise<void>
      ) => {
        try {
          setIsLoading(true);
          const message = "Hola, TraZableDLT pagará el gas por ti";
          const hash = hashMessage(message);
          const signature = await signMessage(message, provider);
    
          if (!contract) {
            throw new Error("Contract not found");
          }
          
          const theOwnershipId = await contract.owner_id();
          // setOwnershipId(theOwnershipId);

          // Esperar hasta que el estado esté actualizado
          await new Promise(resolve => setTimeout(resolve, 0));

          const result = await contract.getProvenance(theProductId);
          setProvenanceData(result);
          console.log("### Provenance result", result);
          const newOwnerTx = await contract.newOwner(address, hash, signature, user1, user2, theProductId, {
            gasLimit: 5000000,
          });
          await newOwnerTx.wait();
          if(newOwnerTx){
    
            // setOwnershipId(parseInt(_ownershipId.toString()));
            console.log("___newOwnerTx", newOwnerTx);
            console.log("___theOwnershipId", theOwnershipId.toString());
            // console.log("___OwnershipId", _ownershipId.toString());
            const result = await contract.getOwnership(parseInt(theOwnershipId.toString()));
            setOwnershipData(result);
            console.log("### Ownership result", result);
          // fetchOwnershipData();
          const [productId, productOwnerId, productOwnerAddress, trxTimeStamp] = result;
          
          let ownership = new Ownership(
            parseInt(productId.toString()),
            parseInt(productOwnerId.toString()),
            productOwnerAddress.toString(),
            trxTimeStamp,
            theOwnershipId.toString()
          );
          // // Validar que ownership no sea vacío
          if (ownership.productId !== 0 && ownership.productOwnerId !== 0 && ownership.productOwnerAddress && ownership.trxTimeStamp) {
            console.log("FECHA,etc", ownership.trxTimeStamp, ownership.productId, ownership.productOwnerAddress, ownership.productOwnerId, ownership.id);
            addItemToLocalStorage(ownership, "ownership");
            // fetchProvenanceData();
          }
          toast('Product transfered successfully')
          setIsNewOwnerModalOpen(true);
          
        }
        } catch (error) {
          console.error(error);
          toast.error('Error while transfering product. Try again.')
        } finally {
          setIsLoading(false);
        }
        // console.log("ParticipantAddress", participantAddress);
        // console.log("Adress", address);
        // setUser1(0);
        setUser2(0);
        setTheProductId(0);
      };