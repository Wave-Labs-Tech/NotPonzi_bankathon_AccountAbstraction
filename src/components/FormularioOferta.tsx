import React from 'react';
// import styles from '../styles/FormularioAnuncio.module.css';
import '../styles/FormularioOferta.css';

type FormularioOfertaProps = {
  handleSubmitModal: (e: React.FormEvent<HTMLFormElement>) => void;
  datosModal: {
    // Define aquí los tipos de los campos dentro de datosModal
    crypto: string;
    value: string;
    price: string;
    conditions: string;
    // Agrega más propiedades según lo que tengas en datosModal
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCloseForm: () => void;
  balanceOf: number;
  ethBalance: string;
  prices: {
    [key: string]: {
      precio: number;
      nombre: string;
    };
  };
};
// function ModalResumen({ onCloseModal, cripto, value, price, payment_mode }){
  const FormularioOferta: React.FC<FormularioOfertaProps> = ({ handleSubmitModal, datosModal, handleChange, onCloseForm, ethBalance, balanceOf, prices }) => {
    const usdtPrecio = prices['usdt']?.precio;
    const ethPrecio = prices['eth']?.precio;
    const valorEthEnUsd = ethPrecio * usdtPrecio;
    const valorUsdEnEth = usdtPrecio / ethPrecio;
    
  console.log("Datos modal formulario", datosModal);
  const handleClose = () => {
    onCloseForm(); // Reinicia datosModal y cierra el formulario
  };
  return (
    <div className="form">

      <form onSubmit={handleSubmitModal}>
        {/* <div className={styles.container}> */}
        <div className='form-price-container'>
          <div className='form-prices'>
            {prices && <p>ETH - DOLLAR:  {ethPrecio} </p>}
            {prices && <p>USDT - DOLLAR:  {usdtPrecio} </p>}
          </div>
            <div className='form-prices'>
            {prices && <p>ETH - USDT: {valorEthEnUsd} </p>}
            {prices && <p>USDT - ETH: {valorUsdEnEth} </p>}
            </div>
            <div>
            <button className="form-close-button" onClick={handleClose}>x</button>
          </div>
        </div>
        <div>
          <label htmlFor="usdt">
            <input type="radio" id="usdt" name="crypto" value="usdt" checked={datosModal.crypto === "usdt"} onChange={handleChange} />
            USDT
          </label>
          <label htmlFor="eth">
            <input type="radio" id="eth" name="crypto" value="eth" checked={datosModal.crypto === "eth"} onChange={handleChange} />
            ETH
          </label>
        </div>
        <div className="inputs-container">
          <label htmlFor="value">Cantidad</label>
          <input type="text" id="value" name="value" placeholder="Cantidad. Por ejemplo 2.45" value={datosModal.value}
            onChange={handleChange}></input>
            <p>Disponible: {datosModal.crypto === "usdt"? balanceOf.toString() : ethBalance}</p>
          <label htmlFor="price">Precio por unidad</label>
          <input type="text" id="price" name="price" placeholder="Precio unidad. Por ejemplo 0.0025" value={datosModal.price}
            onChange={handleChange}></input>
          {/*         <label htmlFor="payment_mode">Modo de pago</label><br></br> */}
          {/* <div className={styles.container}>
                        <input type="radio" id="usdt" name="crypto" value="usdt" checked={datosModal.usdt} onChange={handleChange}></input>
                  <label for="usdt">USDT</label><br></br>
                           <input type="radio" id="eth" name="crypto" value="eth" checked={datosModal.eth} onChange={handleChange}></input> 
                  <input type="radio" id="eth" name="crypto" value="eth" checked={datosModal.eth} onChange={handleChange}></input>
                           <label for="eth">ETH</label> 
                  <label for="eth">ETH</label>
                </div>
                <div> */}
          {/* <div>
                    <select name="payment_mode" value={datosModal.payment_mode}
                    onChange={handleChange}>
                        <option value="">Seleccione un modo de pago</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia_bancaria">Transferencia</option>
                    </select>
                </div> */}
          {/* <label for="maximo">Límite máximo de venta</label><br></br>
                <input type="number" id="maximo" name="maximo" min="0" step="0.001" placeholder="Límite máximo de venta" value={datosModal.maximo}
                  onChange={handleChange}></input>

                <label for="minimo">Límite mínimo de venta</label><br></br>
                <input type="number" id="minimo" name="minimo" min="0" step="0.001" placeholder="Límite mínimo de venta" value={datosModal.minimo}
                  onChange={handleChange}></input> */}

          <label htmlFor="conditions">Condiciones de la venta</label>
          <textarea id="conditions" name="conditions" placeholder="Condiciones de la venta" rows={6} cols={50}
            value={datosModal.conditions} onChange={handleChange}></textarea>
        </div>

        <button type="submit">Crear Oferta {datosModal.crypto}</button>
        {/* necesario agregar esto al final de la funcion que que crea la Oferta
            console.log("Creando oferta con:", formularioDatos);
          cerrarModal();  */}
      </form>
    </div>
  );
}

export default FormularioOferta;