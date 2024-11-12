export function selectCenterBasedOnUrlAndHideList() {
  const currentUrl = window.location.href;
  let selectedCenterValue = null;

  if (currentUrl.includes('/dz/dzAAE2fr/')) {
    selectedCenterValue = 'TlsFranceAnnaba_Case1';
  } else if (currentUrl.includes('/dz/dzORN2fr/')) {
    selectedCenterValue = 'TlsFranceOran_Case1';
  } else if (currentUrl.includes('/ma//')) {
    selectedCenterValue = 'TlsFranceFes_Case1';
  } else if (currentUrl.includes('/ma/maOUD2fr/')) {
    selectedCenterValue = 'TlsFranceOujda_Case1';
  } else if (currentUrl.includes('/ma/maCAS2fr/')) {
    selectedCenterValue = 'TlsFranceCasablanca_Case1';
  } else if (currentUrl.includes('/ma/maTNG2fr/')) {
    selectedCenterValue = 'TlsFranceTanger_Case1';
  } else if (currentUrl.includes('/ma/maAGA2fr/')) {
    selectedCenterValue = 'TlsFranceAgadir_Case1';
  } else if (currentUrl.includes('/ma/maRAK2fr/')) {
    selectedCenterValue = 'TlsFranceMarrakech_Case1';
  } else if (currentUrl.includes('/ma/maRBA2fr/')) {
    selectedCenterValue = 'TlsFranceRabat_Case1';
  }

  if (selectedCenterValue) {
    const centerSelectElement = document.getElementById('itemHunterList');
    if (centerSelectElement) {
      centerSelectElement.value = selectedCenterValue;
      console.log(`Center automatically selected based on URL: ${selectedCenterValue}`);
      centerSelectElement.style.display = 'none';
      centerSelectElement.dispatchEvent(new Event('change'));
    } else {
      console.error('Center selection element not found.');
    }
  } else {
    console.error('No matching center found for the current URL.');
  }
}