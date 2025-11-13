const getApiUrl = () => {
  //  Android emulator 
  /*if ((window as any).Capacitor?.getPlatform?.() === 'android') {
    return 'http://10.0.2.2:8080';
  }
  */
  // endpoint URL
  //return 'http://app.aurkitu.online';
  
  // Navegador
  return 'http://localhost:8080';
};

export const environment = {
  production: true,
  apiUrl: getApiUrl()
};
