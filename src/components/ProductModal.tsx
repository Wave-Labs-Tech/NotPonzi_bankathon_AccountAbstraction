import React from 'react';
import Modal from 'react-modal';
import formatDate  from  '../utils/FormatDate';

type Product = {
    id: string;
    modelNumber: string;
    serialNumber: string;
    participantName: string;
    participantType: string;
    productCost: number;
    mfgTimeStamp: Date;
    participantAddress: string;
  };

  type ProductModalProps = {
    isProductModalOpen: boolean;
    onRequestClose: () => void;
    productId: number;
    productData: any[];
  };


const ProductModal: React.FC<ProductModalProps> = ({ productId, productData, isProductModalOpen, onRequestClose}) => { 
  if (!productData || !productId) return null;

  return (
    <Modal className="flex flex-wrap flex-col place-content-center  p-4 px-12 m-auto mt-72 w-1/3  bg-gray-50 border-2 border-stone-800 rounded-md"
     isOpen={isProductModalOpen} onRequestClose={onRequestClose} contentLabel="Detalles de producto" appElement={document.getElementById('root') || undefined}>
      <h2 className="py-1 px-2 bg-blue-300 text-stone-800 border-2 border-stone-800 p-2 rounded-md text-l font-semibold text-2xl">
        Se ha añadido exitosamente este producto:</h2>
      {/* <p>ID: {product.id}</p> */}
      {productData && (
       <div className="bg-gray-100 my-4 w-auto border-gray-300 rounded-lg p-4 w-64 shadow-md text-3xl flex flex-col place-content-center">
        <p>Id del producto: {productId}</p>
        <p>Modelo: {productData[0]}</p>
        <p>Número de serie: {productData[1]}</p>
        <p>Proveedor: {productData[2]}</p>
        <p>Tipo: {productData[3]}</p>
        <p>Costo: {productData[4].toString()}</p>
        <p>Fecha de alta: {formatDate(productData[5])}</p>  
       </div> 
     )}
      <div className="flex flex-col justify-self-end">
      <button onClick={onRequestClose} className="p2 w-14 h-14 bg-blue-300 text-stone-800 self-end border-2 border-stone-800 rounded-md hover:bg-orange-400 transition-all disabled:opacity-80 text-6xl font-semibold">
        x</button>
      </div>
    </Modal>
  );
};

export default ProductModal;