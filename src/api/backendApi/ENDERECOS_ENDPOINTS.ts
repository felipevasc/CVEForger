const pathApi = 'http://localhost:3001/api';

const ENDERECOS_ENDPOINTS = {
  obterCVEsExploitDB: () => `${pathApi}/cves/exploitdb`,
  obterCVEsDB: () => `${pathApi}/cves/db`,
};
export default ENDERECOS_ENDPOINTS;
