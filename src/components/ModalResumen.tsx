import '../styles/ModalResumen.css'; // Asegúrate de importar el archivo CSS

type ModalResumenProps = {
  onCloseModal: () => void;
  datosModal: DatosModal
  onConfirm: () => void;
};

  // Define el tipo para datosModa
  type DatosModal = {
    // crypto: "usdt" | "eth"; // Cambia esto si hay más opciones
    crypto: string; 
    amount: number;
    price: number;
    maximo: number;
    minimo: number;
    conditions: string;
  };

// function ModalResumen({ onCloseModal, cripto, amount, price, payment_mode }){
  const ModalResumen: React.FC<ModalResumenProps> = ({ onCloseModal, datosModal, onConfirm }) => {
  const isValidCrypto = datosModal.crypto === "usdt" || datosModal.crypto === "eth";
  // console.log("Estos son los datos del modal", datosModal);
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* <p>{datosModal.crypto === "usdt"? "USDT" : "ETH"}</p> */}
        <p>{isValidCrypto ? datosModal.crypto.toUpperCase() : "Criptomoneda no válida"}</p>
        <p>Cantidad disponible: {datosModal.amount}</p>
        <p>Precio por unidad: {datosModal.price}</p>
        <p>Límite máximo de venta: {datosModal.maximo}</p>
        <p>Límite mínimo de venta: {datosModal.minimo}</p>
        {/* <p>Modo de pago: { datosModal.payment_mode}</p>
      <p>Ubicación: { datosModal.location}</p> */}
        <p>Condiciones de venta: {datosModal.conditions}</p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCloseModal}>
            x
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalResumen;
