// ConfirmationModal.tsx
import React from 'react';
import '../styles/ModalConfirmation.css'; // Asegúrate de crear este archivo CSS
// import { Modal, Button } from 'react-bootstrap'; 
import { BigNumberish } from 'ethers';


interface ConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  offer: any;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, onClose, onConfirm, offer }) => {
    if (!show) return null; // No renderiza nada si el modal no debe mostrarse
    console.log("OFFER EN MODAL", offer);
    console.log("Id EN MODAL", offer.id);
    return (
      <div className="modal-overlay-confirmation">
        <div className="modal-content-confirmation">
          <button className="modal-close-confirmation" onClick={onClose}>X</button>
          <h2>Confirmar</h2>
          <p>¿Estás seguro de que quieres aceptar esta oferta?</p>
          <p>Detalles de la oferta: {offer?.id}</p>
          <ul>
            <li>Valor: {offer?.[2].toString()}</li>
            <li>Coste: {offer?.[3].toString()}</li>
            <p>Tipo: {offer?.[6]? 'ETF': 'UDST'}</p>
            <li>Vendedor: {offer?.[1]}</li>
            <li>Comision: {offer?.[8].toString()}</li>
          </ul>
          <div className="modal-actions-confirmation">
            <button className="modal-button-confirmation-cancel" onClick={onClose}>x</button>
            <button className="modal-button-confirmation-confirm" onClick={onConfirm}>Aceptar</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationModal;