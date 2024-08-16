import React, { useState } from 'react';
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
    // const usdtPrecio = 1;
    // const ethPrecio = 3333;

    // Valores iniciales para usdtValue y ethValue
    const initialUsdtValue = '';
    const initialEthValue = '';

    const [usdtValue, setUsdtValue] = useState(initialUsdtValue);
    const [ethValue, setEthValue] = useState(initialEthValue);
  
    const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
      const { name, value } = event.target;

      // Reemplazar comas por puntos
      let newValue = value.replace(',', '.');

      // Verificar si el nuevo valor es una cadena vacía o contiene caracteres no numéricos
      if (!newValue || isNaN(parseFloat(newValue))) {
        // Limpiar el valor del campo correspondiente
        if (name === 'usdt') {
          setUsdtValue(initialUsdtValue);
          setEthValue(usdtValue); // Mantiene el valor de ETH igual
        } else if (name === 'eth') {
          setEthValue(initialEthValue);
          setUsdtValue(ethValue); // Mantiene el valor de USDT igual
        }
        return; // Salir de la función temprano
      }

      if (name === 'usdt') {
        setUsdtValue(newValue);
        // Convertir USDT a ETH: Divide la cantidad de USDT por el precio de ETH en dólares
        const convertedEthValue = (parseFloat(newValue) / ethPrecio); // Ajusta los decimales según sea necesario para ETH
        setEthValue(convertedEthValue.toFixed(18));
      } else if (name === 'eth') {
        setEthValue(newValue);
        // Convertir ETH a USDT: Multiplica la cantidad de ETH por el precio de ETH en dólares
        const convertedUsdtValue = (parseFloat(newValue) * ethPrecio); // Ajusta los decimales según sea necesario para USDT
        setUsdtValue(convertedUsdtValue.toFixed(6));
      }
    };
    
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
            {prices && <p>1 ETH:  {ethPrecio} dolares </p>}
            {prices && <p>1 USDT:  {usdtPrecio} dolares</p>}
          </div>
            <div className='form-prices'>
            {prices && <p>1 ETH: {(ethPrecio / usdtPrecio).toFixed(6)} usdt</p>}
            {prices && <p>1 USDT:  {(usdtPrecio / ethPrecio).toFixed(18)} eth </p>}
            </div>
            <div>
            <button className="form-close-button" onClick={handleClose}>x</button>
          </div>
        </div>
        <div>
        <div className='converter-container'>
          <label htmlFor="usdt">USDT:</label>
          <input type="text" pattern="\d*(\.\d{0,18})?"  id="usdt" name="usdt" value={usdtValue} onChange={handleInputChange} />
          {/* <p>ETH: {ethValue}</p> */}
          <label htmlFor="eth">ETH:</label>
          <input type="text" pattern="\d*(\.\d{0,18})?"  id="eth" name="eth" value={ethValue} onChange={handleInputChange} />
          {/* <p>USDT: {usdtValue}</p> */}
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
          <label htmlFor="value">Cantidad - Usar hasta 18 decimales para ETH y 6 para USDT</label>
          <input type="text" id="value" name="value" placeholder="Ejemplo 12.555577 USDT o 0.000000000000000111 ETH" value={datosModal.value}
            onChange={handleChange}></input>
            <p>Disponible: {datosModal.crypto === "usdt"? balanceOf.toString() : ethBalance}</p>
          <label htmlFor="price">Precio/unidad - Usar hasta 18 decimales para ETH y 6 para USDT</label>
          <input type="text" id="price" name="price" placeholder="Ejemplo 4500000 USDT o 1000000000000000000 ETH" value={datosModal.price}
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