function formatDate(timestamp: bigint) {
    // Convertir el timestamp a un objeto Date
    const date = new Date(parseInt(timestamp.toString()) * 1000); // Multiplicamos por 1000 porque JavaScript espera milisegundos
    
    // Formatear la fecha al estilo preferido (por ejemplo, DD/MM/YYYY HH:mm:ss)
    // const formattedDate = date.toLocaleDateString("es-ES", { //no muestra la hora
    const formattedDate = date.toLocaleDateString("es-ES", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit'
        hour12: false //formato 24 horas
    });
    
    return formattedDate;
  }

  export default formatDate;