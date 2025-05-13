import axios from 'axios';
import useNavegacaoStore from '../store/navegacao/useNavegacaoStore';

const useApiInstance = () => {
  const { urlApi, mensagens } = useNavegacaoStore();

  const apiInstance = axios.create({
    baseURL: urlApi.get || import.meta.env.VITE_APP_URL_DEFAULT_API_GATEWAY,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    validateStatus: (status) => {
      return status >= 200 && status < 300;
    },
  });

  apiInstance.interceptors.request.use(
    (config) => {
      config.headers['Cache-Control'] = 'no-cache';
      const tokenAuth = null;
      if (tokenAuth) {
        config.headers['Authorization'] = `Bearer ${tokenAuth}`;
      } else {
        //DESLOGAR
        mensagens.error(
          'É necessário realizar o login no sistema para executar esta ação'
        );
        console.error('Usuario deslogado');
      }
      console.log(config);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiInstance.interceptors.request.use(
    (config) => {
      const tokenServidor = localStorage.getItem('srv_auth');
      if (tokenServidor) {
        config.headers['Tokenservidor'] = `${tokenServidor}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('Deu erro:', error);
      return Promise.reject(error);
    }
  );

  return apiInstance;
};

export default useApiInstance;
