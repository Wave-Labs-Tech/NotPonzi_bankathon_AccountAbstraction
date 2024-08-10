export const initializeExistingPrefixes = () => {
    const types = ["product", "participant", "ownership"];
  
    types.forEach(type => {
      const storedIds: string[] = JSON.parse(localStorage.getItem(`${type}Ids`) || "[]");
      storedIds.forEach(id => {
        const parts = id.split("-");
        if (parts.length > 2) {
          // Crea el prefijo con los primeros dos segmentos y un delimitador extra
          const prefix = `${parts.slice(0, 2).join("-")}-`;
          existingPrefixes[type].add(prefix);
        }
      });
    });
  };
//   initializeExistingPrefixes();

let itemIndex: { [key: string]: string[] } = {};
const existingPrefixes: { [key: string]: Set<string> } = { // Conjuntos para almacenar prefijos existentes por tipo
  product: new Set(),
  participant: new Set(),
  ownership: new Set()
};


// };

// const addItemToLocalStorage = (product: Product, productId: string, participant: Participant, participantId: string, ownership: Ownership, ownershipId: string) => {

type StorableObject = {
    id: string;
    [key: string]: any; // Permitir otras propiedades
  };
  // const addItemToLocalStorage = (object: StorableObject, itemId: string, itemType: string) => {
  export  const addItemToLocalStorage = (object: StorableObject, itemType: string) => {
    // console.log("ProductId en addProductToLocalStorage", itemId);
    const itemKey = object.id;
    // let itemKey: string = '';
    let itemsArrayKey: string = '';
  
    // if(itemType === "product"){
    //   itemsArray = "productIds";
    // }else if(itemType === "participant"){
    //   // itemKey = object.id;
    //   itemsArray = "participantIds";
    // }else{
    //   itemsArray = "ownershipIds";
    // }
    switch (itemType) {
      case "product":
        itemsArrayKey = "productIds";
        break;
      case "participant":
        itemsArrayKey = "participantIds";
        break;
      case "ownership":
        itemsArrayKey = "ownershipIds";
        break;
      default:
        throw new Error(`Unknown itemType: ${itemType}`);
    }
    // const partticipantKey = object.id
  
    const itemIds: Set<string> = new Set(JSON.parse(localStorage.getItem(itemsArrayKey) || "[]"));
    console.log("itemIds", itemIds);
    // Dividir el itemKey para obtener el prefijo base (ej. product-3)
    const itemPrefix = itemKey.split("-").slice(0, 2).join("-") + "-"; // Ej: product-3-
    console.log("itemPrefix",itemPrefix);
    // Verificar si ya existe un prefijo con el mismo prefijo
    if (existingPrefixes[itemType].has(itemPrefix)) {
      console.log(`${itemType} with prefix ${itemPrefix} already exists!`);
      return;
    }
    // const existingProduct = localStorage.getItem("productIds");
    console.log("ProductKey en addProductToLocalStorage", itemKey);
    // productIds.add(productKey);
    const initialNumber = itemPrefix.split("-")[1];
    if (!itemIndex[initialNumber]) {
      itemIndex[initialNumber] = [];
    }
    // Agregar el itemKey al índice
    itemIndex[initialNumber].push(itemKey);
  
    // Agregar el prefijo al conjunto de prefijos existentes
    existingPrefixes[itemType].add(itemPrefix);
  
    // Agregar el ID del item al conjunto de IDs
    itemIds.add(itemKey);
  
    console.log("initialNumber en addProductToLocalStorage", initialNumber);
    console.log("productIndex[initialNumber] en addProductToLocalStorage", itemIndex[initialNumber]);
  
    console.log("Added itemKey:", itemKey);
    console.log("Updated itemIds:", Array.from(itemIds));
    console.log("Updated existingPrefixes:", existingPrefixes);
    console.log("Updated itemIndex:", itemIndex);
    localStorage.setItem(itemsArrayKey, JSON.stringify(Array.from(itemIds))); // Update set with new ID
    localStorage.setItem(itemKey, JSON.stringify(object)); // Store product data 
  
    console.log(`${itemType} añadido:`, itemKey);
    // Comprueba si el producto ya existe en localStorage
    // if (!localStorage.getItem(productKey)) {
    //   localStorage.setItem(productKey, JSON.stringify(product));
  
    //   // Actualiza la lista de IDs de productos
    //   let productList = JSON.parse(localStorage.getItem('productList')) || [];
    //   productList.push(productKey);
    //   localStorage.setItem('productList', JSON.stringify(productList));
  
    //   console.log("Producto añadido:", productKey);
    // } else {
    //   console.log("El producto ya existe:", productKey);
    // }
  };
  // function getProductFromLocalStorage(productId: number) : Product[] {
  //   const products: Product[] = [];
  //   const productKey = productId.toString();
  //   const productString = localStorage.getItem(productKey);
  
  //   if (productString) {
  //     return JSON.parse(productString) as Product; // Parse back to Product object
  //   }
  //   const initialNumber = "3";
  // const productsWithInitialNumber3 = productIndex[initialNumber] || []; // O
  //   return null; // Or any default value if not found
  // }

    
  export function findProductsByInitialNumber(initialNumber: number) {
    const results: Object[] = [];
    // const results: Product[] = [];
  
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
  
      if (key && key.startsWith(`product-${initialNumber.toString()}-`)) {
        const productString = localStorage.getItem(key);
        console.log("-------productString en findProductsByInitialNumber:------", productString);
  
        // Verificamos si productString es null antes de parsear
        if (productString) {
          const product: Object = JSON.parse(productString);
          console.log("-------product en findProductsByInitialNumber:------", product);
          results.push(product);
        }
      }
    }
  
    console.log("RESULTS", results);
  }
  
  export function findItemsByInitialNumbers(initialNumbers: number[], itemType: string): any[] {
    const results: any[] = [];
  
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
  
      if (key) {
        initialNumbers.forEach(initialNumber => {
          const prefix = `${itemType}-${initialNumber.toString()}-`;
          console.log("PREFIJO", prefix);
          if (key.startsWith(prefix)) {
            const itemString = localStorage.getItem(key);
            console.log(`-------${itemType}String en findItemsByInitialNumbers:------`, itemString);
  
            // Verificamos si itemString es null antes de parsear
            if (itemString) {
              const item = JSON.parse(itemString);
              console.log(`-------${itemType} en findItemsByInitialNumbers:------`, item);
              results.push(item);
            }
          }
        });
      }
    }
  
    console.log("XXX FindItemsByInitialNumbers:", results);
    return results;
  }
    // return formattedDate;
  

    // function recoverProduct(productId: number) {
    //   //  for (let i = 0; i < localStorage.length; i++) {
    //   //     // console.log(localStorage.getItem(localStorage.key(i)))
    //   //     let taskObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
    //   //     // console.log(createRecoveredTaskFromLocalStorage(taskObj));
    //   //     let taskHTML = createRecoveredTaskFromLocalStorage(taskObj);
    //   //     if((taskObj.id).includes("task-")){
    //   //         if (taskObj.taskDone) {
    //   //             taskDivContainerDone.appendChild(taskHTML);
    //   //         } else {
    //   //             taskDivContainer.appendChild(taskHTML);
    //   //         }           
    //   //     }
    //   // }
    //   if (productId) {
    //     let productKey = productId.toString();
    //     let product = localStorage.getItem(productKey);
  
    //     if (product) {
    //       let productObj = JSON.parse(product);
    //       console.log("RECOVERED Product: ", productObj);
    //       return productObj;
    //     }
    //   }
    // }