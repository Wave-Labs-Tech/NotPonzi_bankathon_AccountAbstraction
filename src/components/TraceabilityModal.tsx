import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

type Ownership = {
  id: string;
  productId: number;
  productOwnerId: number;
  productOwnerAddress: string;
  trxTimeStamp: string;
  };
  type Participant = {
    id: string;
    name: string;
    participantType: string;
  };
  type Product = {
    id: string | '';
    modelNumber: string | '';
    serialNumber: string | '';
    participantName: string | '';
    participantType: string | '';
    productCost: number | undefined;
    mfgTimeStamp: string | '';
    participantAddress: string | '';
  }

  type TraceabilityModalProps = {
    ids: number[];
    isTraceabilityModalOpen: boolean;
    onRequestClose: () => void;
    productId: number;
    productData: Product[];
    provenanceData: string[];
  };


  const TraceabilityModal: React.FC<TraceabilityModalProps> = ({ ids, isTraceabilityModalOpen, productId, productData, provenanceData, onRequestClose }) => {
    const [ownerships, setOwnerships] = useState<Ownership[]>([]);
    // const [participants, setParticipants] = useState<Map<number, Participant>>(new Map());
    const [participants, setParticipants] = useState<Participant[]>([]);
    // const [productOwnerIds, setPproductOwnerIds] = useState<number[]>([]);
    console.log("YYY--TTTTTT",provenanceData);
    
    let _participants: (string | null)[] = [];
    useEffect(() => {
      if (isTraceabilityModalOpen) {
        const allOwnershipIds: string[] = JSON.parse(localStorage.getItem('ownershipIds') || '[]');
        const allParticipantsIds: string[] = JSON.parse(localStorage.getItem('participantIds') || '[]');
        
        const filteredIds = allOwnershipIds.filter(id => ids?.some(num => id.startsWith(`ownership-${num}-`)));
        
        const fetchedOwnerships = filteredIds.map(id => {
          const ownershipData = localStorage.getItem(id);
          return ownershipData ? JSON.parse(ownershipData) : null;
        }).filter((ownership): ownership is Ownership => ownership !== null);
        
        setOwnerships(fetchedOwnerships);
        console.log("YYY>allOwnershipIds",allOwnershipIds)
        console.log("fetchedOwnerships",fetchedOwnerships)
        console.log("allParticipantsIds",allParticipantsIds)
        /////////////
        // Obtener los productIds de fetchedOwnerships
        const productOwnerIds = fetchedOwnerships.map(ownership => ownership.productOwnerId);
        // Filtrar participantIds basados en los productIds
        console.log("productOwnerIds", productOwnerIds); // Verifica los productIds aquí
        const filteredParticipants = allParticipantsIds.filter(id => {
          return productOwnerIds.some(productOwnerId => id.startsWith(`participant-${productOwnerId}-`));
        });
        console.log("XXfilteredParticipants", filteredParticipants);
        ////////////
        // const filteredParticipants = allParticipantsIds.filter(id => ids.some(num => id.startsWith(`participant-${fetchedOwnerships.productOwnerId}`)));
        // console.log("XXfilteredParticipants",filteredParticipants)
        // const fetchedParticipants = filteredParticipants.map(id => {
          //   const participantData = localStorage.getItem(id);
          //   console.log("XXfetchedOwnerships",participantData)
          //   return participantData ? JSON.parse(participantData) : null;
          // }).filter((participant): participant is Participant => participant !== null);
          // setParticipants(fetchedParticipants);
          // console.log("XXfetchedParticipants",fetchedParticipants);
          
          
          // Obtener los datos de los participantes
          const fetchedParticipants = filteredParticipants.map(id => {
            const participantData = localStorage.getItem(id);
            _participants.push(participantData);
            console.log("XXfetchedParticipantData", participantData);
            return participantData ? JSON.parse(participantData) as Participant  : null;
          }).filter((participant): participant is Participant => participant !== null);
          
          setParticipants(fetchedParticipants);
          console.log("XXfetchedParticipants", fetchedParticipants);
          console.log("XXXXXXXXXXXPARTICIPANTs", _participants);
          console.log("XXPARTICIPANTs", participants);
        }
}, [ids, isTraceabilityModalOpen]);

return (
  // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  <div >
  
    <Modal className="modal-custom" 
  // <Modal className="m-auto bg-opacity-60 flex flex-wrap flex-col justify-center p-4 px-12  mx-4 w-min-1/3 w-fit bg-gray-50 border-2 border-stone-800 rounded-md" 
  isOpen={isTraceabilityModalOpen} onRequestClose={onRequestClose} contentLabel="Product Traceability Details" appElement={document.getElementById('root') || undefined}>
    <h2 className="py-1 px-2 w-fit  bg-blue-300 text-stone-800 border-2 border-stone-800 p-2 rounded-md text-l font-semibold">
      Trazabilidad del producto {productId}
    </h2>
    <p className="mt-2">Lista de transferencias: {provenanceData?.map(num => num.toString()).join(', ')}</p>
    {ownerships.length === 0 ? (
      <p>No hay transferencias de producto.</p>
    ) : (
      <div className="flex flex-wrap gap-4">
        {ownerships.map((ownership, index) => {
          const correspondingParticipant = participants.find(participant => participant.id.startsWith(`participant-${ownership.productOwnerId}-`));

          return (
            <div key={index} className="bg-gray-100 my-4 border border-gray-300 rounded-lg p-4 w-64 shadow-md">
              <p>Fecha: {ownership?.trxTimeStamp}</p>
              {correspondingParticipant ? (
                <>
                  <p>{correspondingParticipant.name}</p>
                  <p>{correspondingParticipant.participantType}</p>
                </>
              ) : (
                <p>No se encontró el participante correspondiente.</p>
              )}
              <hr className="my-2" />
            </div>
          );
        })}
      </div>
    )}
    <div className="flex flex-col justify-self-end">
    <button onClick={onRequestClose} className="p2 w-14 h-14 bg-blue-300 text-stone-800 self-end border-2 border-stone-800 rounded-md hover:bg-orange-400 transition-all disabled:opacity-80 text-6xl font-semibold">
      x
    </button>
    </div>
  </Modal>
  </div>
);
};
export default TraceabilityModal;

