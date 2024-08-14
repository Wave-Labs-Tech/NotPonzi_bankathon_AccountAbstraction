import React, { useState } from 'react';
import { ethers } from 'ethers'; // Asegúrate de importar BigNumber si lo usas
import ConfirmationModal from './ModalConfirmation'; // Importa el modal
import CancelationModal from './ModalCancelation'; // Importa el modal
import '../styles/OfferCard.css';


interface OfferCardProps {
    offer: any;
    acceptEscrowToken: (id: number, cost: number) => void;
    acceptEscrowNativeCoin: (id: number, cost: number) => void;
    cancelEscrow: (id: number) => void;
    address: string;
  }
  const OfferCard: React.FC<OfferCardProps> = ({ offer, acceptEscrowToken, acceptEscrowNativeCoin, cancelEscrow, address }) => {
      const [showModal, setShowModal] = useState(false);
      const [isCanceling, setIsCanceling] = useState(false);
      // console.log("OFFER EN CARD", offer);
      // console.log("Id EN CARD", offer.id);
     console.log("Offer COST y Type in Offercard", offer?.[3], offer?.[6]);
    const handleAccept = () => {
      if (offer[6]) {//comprobar si es escrowNative
        acceptEscrowNativeCoin(offer.id, offer?.[3]);
      } else {
        acceptEscrowToken(offer.id, offer?.[3]);
      }
      setShowModal(false);
    };
    const handleCancel = () => {
      if (offer[1] === address) {//comprobar si es escrowNative
        cancelEscrow(offer.id);
      } 
      setShowModal(false);
    };
    
    const weiValue = BigInt(offer?.[2]?.toString() || "0"); // Valor en wei
    const _cost = BigInt(offer?.[3]?.toString() || "0"); // Coste en wei
    
    // Determinar el tipo de oferta
    const isEthOffer = offer?.[6]; 
    
    // Convertir el valor de wei a la unidad correspondiente
    const valueInEth = parseFloat(ethers.formatEther(weiValue)); // Convertir wei a ETH y a número
    const valueInUsdt = Number(weiValue) / 1e12; // Convertir wei a USDT y a número

    const valueToDisplay = isEthOffer 
        ? valueInEth.toFixed(18) // Convertir a ETH y limitar a 18 decimales
        : valueInUsdt.toFixed(6); // Convertir a USDT y limitar a 6 decimales
      
    // Convertir el coste de wei a la unidad correspondiente
    const costInEth = parseFloat(ethers.formatEther(_cost)); // Convertir wei a ETH y a número
    const costInUsdt = Number(_cost) / 1e12; // Convertir wei a USDT y a número

    const costToDisplay = isEthOffer 
        ? costInUsdt.toFixed(6) // Convertir a USDT y limitar a 6 decimales
        : costInEth.toFixed(18); // Convertir a ETH y limitar a 18 decimales

  // Determinar si el usuario es el creador de la oferta
  const isCreator = offer[1] === address;
  // console.log("offer[1] === address?", offer[1] === address)
  // console.log("offer", offer[6]);
  // console.log("address", address);
  
  return (
    // <div className='offerCard-container'>
    <div className='offerCard'>
      <h3>Oferta {offer?.id}</h3>
      {/* <p>Estado: {status}</p> */}
      {/* <p>Valor: {offer?.[2].toString()}</p> */}
      {/* <p>Coste: {offer?.[3].toString()}</p> */}
      <p>Valor: {valueToDisplay} {isEthOffer ? 'ETH' : 'USDT'}</p>
      <p>Coste: {costToDisplay} {!isEthOffer ? 'ETH' : 'USDT'}</p>
      <p>Tipo: {offer?.[5]? 'ETH': 'UDST'}</p>
      <p>Comision: {offer?.[8].toString()}</p>
      <div className='offercard-button-container'>
                {isCreator ? (
                    <>
                        <button onClick={() => { setShowModal(true); setIsCanceling(true); }}>Cancelar Oferta</button>
                        <CancelationModal
                            show={showModal}
                            onClose={() => setShowModal(false)}
                            onConfirm={handleCancel}
                            offer={offer}
                        />
                    </>
                ) : (
                    <>
                        <button onClick={() => { setShowModal(true); setIsCanceling(false); }}>Aceptar Oferta</button>
                        <ConfirmationModal
                            show={showModal && !isCanceling}
                            onClose={() => setShowModal(false)}
                            onConfirm={handleAccept}
                            offer={offer}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default OfferCard;