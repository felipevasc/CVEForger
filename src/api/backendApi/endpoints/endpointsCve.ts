import useGatewayApi from '../../useGatewayApi';
import ENDERECOS_ENDPOINTS from '../ENDERECOS_ENDPOINTS';
import type { CveExpoitDBResponse } from '../types/CveExploitDBResponse';

const useEndpointsCve = () => {
  const gatewayApi = useGatewayApi();
  const enderecos = ENDERECOS_ENDPOINTS;

  return {
    obterCVEsExploitDB: () =>
      gatewayApi.GET<CveExpoitDBResponse>(enderecos.obterCVEsExploitDB()),
  };
};

export default useEndpointsCve;
