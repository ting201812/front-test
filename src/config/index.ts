const serveIp = import.meta.env.VITE_ENV === 'production' ?
  '/front-test' :
  '';

export default serveIp;
