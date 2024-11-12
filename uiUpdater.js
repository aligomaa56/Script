function updateMessageInHeading(message, color) {
    const targetHeading = document.querySelector('.tls-home-text-group .tls-heading-1');
    if (!targetHeading) {
      console.error('Target heading not found.');
      return;
    }
  
    targetHeading.textContent = message;
    targetHeading.style.color = color;
    targetHeading.style.fontFamily = '"Calibri", Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif';
    targetHeading.style.textAlign = 'center';
    targetHeading.style.margin = '0';
    targetHeading.style.lineHeight = '4rem';
    targetHeading.style.fontSize = '1.8rem';
}

export function setWarning(message) {
    updateMessageInHeading(message, '#f5d200');
}
  
export function setError(message) {
    updateMessageInHeading(message, '#da1c24');
}
  
export function setPositive(message) {
    updateMessageInHeading(message, '#1dcd79');
}
  
export function setInfo(message) {
    updateMessageInHeading(message, '#fff');
}