import useEndpointsCve from './endpoints/endpointsCve';

const useBackendApi = () => {
  return {
    ...useEndpointsCve(),
  };
};

export default useBackendApi;
