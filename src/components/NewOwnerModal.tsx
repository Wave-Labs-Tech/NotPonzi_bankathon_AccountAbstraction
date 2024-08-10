import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useUserContext } from '../contexts/UserContext';
import formatDate from '../utils/FormatDate';


  type NewOwnerModalProps = {
    isNewOwnerModalOpen: boolean;
    onRequestClose: () => void;
    // productId: number;
    ownershipId: number;
    ownershipData: any[];
    // provenanceData: any[];
  }
//THE OWNERSHIPID TAMPOCO SIRVE, ES 0 SALVO AL CREARSE UNA NUEVA OWNERSHIP
const NewOwnerModal: React.FC<NewOwnerModalProps> = ({ ownershipId, ownershipData, isNewOwnerModalOpen, onRequestClose}) => { 
    // const [fetchedProduct, setFetchedProduct] = useState<any | null>(null);
    const [fetchedParticipants, setFetchedParticipants] = useState<any | null>(null);
    const { user1, setUser1, theOwnershipId, setTheOwnershipId } = useUserContext();
    useEffect(() => {
        console.log("Modal Open: ", isNewOwnerModalOpen);
    console.log("Current theownershipId: ", theOwnershipId);
        if (isNewOwnerModalOpen) {
            // Actualizar _ownershipId solo si el modal se abre
            setTheOwnershipId(theOwnershipId);
        }
    }, [isNewOwnerModalOpen, theOwnershipId, setTheOwnershipId]);
  
    useEffect(() => {
        console.log("2Modal Open2: ", isNewOwnerModalOpen);
        console.log("2Checking theOwnershipId2: ", theOwnershipId);
    
        if (isNewOwnerModalOpen) {
        //   const allProductIds: string[] = JSON.parse(localStorage.getItem('productIds') || '[]');
        const allParticipantIds: string[] = JSON.parse(localStorage.getItem('participantIds') || '[]');
        //   const filteredIds = allProductIds.filter(id.some(num => id.startsWith(`product-${num}-`)));
        //   const filteredIds = allProductIds.filter(id => id.startsWith(`product-${user1.toString()}-`));
        const participantIdsToFetch = [user1.toString(), ownershipData[1].toString()];
        const filteredParticipantIds = allParticipantIds.filter(id => {
            return participantIdsToFetch.some(participantId => id.startsWith(`participant-${participantId}-`));
        });
        //   if (filteredIds.length > 0) {
        //     const productData = localStorage.getItem(filteredIds[0]);
        //     setFetchedProduct(productData ? JSON.parse(productData) : null);
        //     console.log("@@@@setFetchedProduct",JSON.parse(productData? productData :''))
        //     }
        // Obtener datos de los participantes
        const participantsData: any[] = [];
        if(filteredParticipantIds){
            filteredParticipantIds.forEach(id => {
                const participantData = localStorage.getItem(id);
                if (participantData) {
                    participantsData.push(JSON.parse(participantData));
                }
            });
            setFetchedParticipants(participantsData);
            // setUser1(0);
        }
        console.log("YYYallParticipantIds",allParticipantIds)
        console.log("participantIdsToFetch ",participantIdsToFetch )
        console.log("filteredParticipantIds ",filteredParticipantIds )
        console.log("participantsData ",participantsData )
    }
    }, [isNewOwnerModalOpen, theOwnershipId, user1, ownershipData]);
        
//       setOwnerships(fetchedOwnerships);
//       /////////////
//       // Obtener los productIds de fetchedOwnerships
//       const productOwnerIds = fetchedOwnerships.map(ownership => ownership.productOwnerId);
//       // Filtrar participantIds basados en los productIds
//       console.log("productOwnerIds", productOwnerIds); // Verifica los productIds aquí
//       const filteredParticipants = allParticipantsIds.filter(id => {
    //         return productOwnerIds.some(productOwnerId => id.startsWith(`participant-${productOwnerId}-`));
//       });
//       console.log("XXfilteredParticipants", filteredParticipants);
// }
// }, [isNewOwnerModalOpen, ownershipId]);
const handleCloseModal = () => {
    onRequestClose();
    setUser1(0);  // Restablecer user1 al cerrar el modal
  };

if (!ownershipData || fetchedParticipants?.length < 2 || user1 === null) return null;

  const oldParticipant = fetchedParticipants?.find((participant: { id: string; }) =>
    participant.id.startsWith(`participant-${user1.toString()}`)
  );
  const newParticipant = fetchedParticipants?.find((participant: { id: string; })  =>
    participant.id.startsWith(`participant-${ownershipData[1].toString()}`)
  );
  console.log("DATA                     USER1" ,user1? user1: 999);
  console.log("DATA                     _OWNERSHIPID" ,theOwnershipId);
  console.log("DATA                     PIrulenta" ,ownershipData ,ownershipId, fetchedParticipants);
//   if (!ownershipData || !ownershipId || fetchedParticipants.length < 2) return null;
  // const oldParticipant = fetchedParticipants?.find((participant: { id: string; }) => participant.id.startsWith(`participant-${user1.toString()}`));
  // const newParticipant = fetchedParticipants?.find((participant: { id: string; }) => participant.id.startsWith(`participant-${ownershipData[1].toString()}`));
  console.log("oldParticipant ",oldParticipant)
  console.log("newParticipant ",newParticipant)
// }
  return (
    <Modal className="flex flex-wrap flex-col place-content-end  p-4 px-12 m-auto mt-72 w-fit bg-gray-50 border-2 border-stone-800 rounded-md"
     isOpen={isNewOwnerModalOpen} onRequestClose={handleCloseModal} contentLabel="Detalles de transferencia de producto" appElement={document.getElementById('root') || undefined}>
      <h2 className="py-1 px-2 bg-blue-300 text-stone-800 border-2 border-stone-800 p-2 rounded-md text-l font-semibold text-2xl">
        Se ha movido el producto numero {ownershipData[0].toString()}:</h2>
      {/* <p>ID: {product.id}</p> */}
      {ownershipData && fetchedParticipants && (
       <div className="bg-gray-100 my-4 w-auto border-gray-300 rounded-lg p-4 w-64 shadow-md text-3xl flex flex-col place-content-center">
        <p>Antiguo proveedor: {oldParticipant?.name}</p>
        <p>Nuevo proveedor: {newParticipant?.name}</p>
        <p>Numero de producto: {ownershipData?.[0].toString()}</p>
        {/* <p>Número de intercambio: {theOwnershipId.toString()}</p> */}
        <p>Fecha: {formatDate(ownershipData?.[3]).toString()}</p>
        {/* <p>Fecha: {ownershipData?.[1].toString()}</p> */}
        {/* <p>Nombre: {participantData[0]}</p>
        <p>Tipo de Proveedor: {participantData[1]}</p>
        <p>Id de cuenta: {participantData[2]}</p> */}
       </div> 
     )}
      <div className="flex flex-col justify-self-end">
      {/* <button onClick={() => { onRequestClose(); setUser1(0); }} className="p2 w-14 h-14 bg-blue-300 text-stone-800 self-end border-2 border-stone-800 rounded-md hover:bg-orange-400 transition-all disabled:opacity-80 text-6xl font-semibold"> */}
      <button onClick={handleCloseModal}  className="p2 w-14 h-14 bg-blue-300 text-stone-800 self-end border-2 border-stone-800 rounded-md hover:bg-orange-400 transition-all disabled:opacity-80 text-6xl font-semibold">
        x</button>
      </div>
    </Modal>
  );
};

export default NewOwnerModal;