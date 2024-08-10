import React from 'react';
import Modal from 'react-modal';
import formatDate  from  '../utils/FormatDate';


  type ProductModalProps = {
    isParticipantModalOpen: boolean;
    onRequestClose: () => void;
    participantId: number;
    participantData: any[];
  };


const ParticipantModal: React.FC<ProductModalProps> = ({ participantId, participantData, isParticipantModalOpen, onRequestClose}) => { 
  if (!participantData || !participantId) return null;

  return (
    <Modal className="flex flex-wrap flex-col place-content-center  p-4 px-12 m-auto mt-72 w-fit bg-gray-50 border-2 border-stone-800 rounded-md"
     isOpen={isParticipantModalOpen} onRequestClose={onRequestClose} contentLabel="Detalles de producto" appElement={document.getElementById('root') || undefined}>
      <h2 className="py-1 px-2 bg-blue-300 text-stone-800 border-2 border-stone-800 p-2 rounded-md text-l font-semibold text-2xl">
        Se ha añadido exitosamente este proveedor:</h2>
      {/* <p>ID: {product.id}</p> */}
      {participantData && (
       <div className="bg-gray-100 my-4 w-auto border-gray-300 rounded-lg p-4 w-64 shadow-md text-3xl flex flex-col place-content-center">
        <p>Id del proveedor: {participantId}</p>
        <p>Nombre: {participantData[0]}</p>
        <p>Tipo de Proveedor: {participantData[1]}</p>
        <p>Id de cuenta: {participantData[2]}</p>
       </div> 
     )}
      <div className="flex flex-col justify-self-end">
      <button onClick={onRequestClose} className="p2 w-14 h-14 bg-blue-300 text-stone-800 self-end border-2 border-stone-800 rounded-md hover:bg-orange-400 transition-all disabled:opacity-80 text-6xl font-semibold">
        x</button>
      </div>
    </Modal>
  );
};

export default ParticipantModal;