// Función para convertir un número con decimales en formato de cadena a un número
export function convertToBigNumber (value: number, decimals: number) {
    return parseFloat(value.toString()) * Math.pow(10, decimals);
  };
  
  // Función para convertir un número con decimales en formato de cadena a un número con precisión
export function convertFromBigNumber (value: number, decimals: number) {
    return value / Math.pow(10, decimals);
  };

export function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log(...args);
  }