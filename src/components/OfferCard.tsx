import React, { useState } from 'react';
import { BigNumberish } from 'ethers'; // Asegúrate de importar BigNumber si lo usas
import ConfirmationModal from './ModalConfirmation'; // Importa el modal
import '../styles/OfferCard.css';


interface OfferCardProps {
    offer: any;
    acceptEscrowToken: (id: number, cost: number) => void;
    acceptEscrowNativeCoin: (id: number) => void;
  }
  const OfferCard: React.FC<OfferCardProps> = ({ offer, acceptEscrowToken, acceptEscrowNativeCoin }) => {
      const [showModal, setShowModal] = useState(false);
      // console.log("OFFER EN CARD", offer);
      // console.log("Id EN CARD", offer.id);
      
    const handleAccept = () => {
      if (offer[6]) {//comprobar si es escrowNative
        acceptEscrowNativeCoin(offer.id);
      } else {
        acceptEscrowToken(offer.id, parseInt(offer?.[3].toString()));
      }
      setShowModal(false);
    };
    

  return (
    // <div className='offerCard-container'>
    <div className='offerCard'>
      <h3>Oferta {offer?.id}</h3>
      {/* <p>Estado: {status}</p> */}
      <p>Valor: {offer?.[2].toString()}</p>
      <p>Coste: {offer?.[3].toString()}</p>
      <p>Tipo: {offer?.[6]? 'ETF': 'UDST'}</p>
      <p>Comision: {offer?.[8].toString()}</p>
        <div className='offercard-button-container'>
        <button onClick={() => setShowModal(true)}>Aceptar Oferta</button>
        <ConfirmationModal 
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleAccept}
            offer={offer}
            />
        </div>
    {/* </div> */}
    </div>
  );
};

export default OfferCard;
