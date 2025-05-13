import type { AxiosResponse } from 'axios';
import useApiInstance from './useApiInstance';
import useNavegacaoStore from '../store/navegacao/useNavegacaoStore';

const useGatewayApi = () => {
  const apiInstance = useApiInstance();
  const { loading } = useNavegacaoStore();

  const GET = async <T>(url: string): Promise<T | undefined> => {
    try {
      loading.start();
      const retorno = await apiInstance.get<T | undefined>(url);
      loading.end();
      return retorno?.data;
    } catch (e) {
      loading.end();
      console.error('Falha ao chamar a API', url, e);
    }
  };
  const POST = async <T>(
    url: string,
    body: unknown
  ): Promise<T | undefined> => {
    try {
      loading.start();
      const retorno = await apiInstance.post<
        T | undefined,
        AxiosResponse<T>,
        typeof body
      >(url, body);
      loading.end();
      return retorno?.data;
    } catch (e) {
      loading.end();
      console.error('Falha ao chamar a API', url, e);
    }
  };
  const PUT = async <T>(url: string, body: unknown): Promise<T | undefined> => {
    try {
      loading.start();
      const retorno = await apiInstance.put<
        T | undefined,
        AxiosResponse<T>,
        typeof body
      >(url, body);
      loading.end();
      return retorno?.data;
    } catch (e) {
      loading.end();
      console.error('Falha ao chamar a API', url, e);
    }
  };
  const DEL = async <T>(url: string) => {
    try {
      loading.start();
      const retorno = await apiInstance.delete<T | undefined>(url);
      loading.end();
      return retorno?.data;
    } catch (e) {
      loading.end();
      console.error('Falha ao chamar a API', url, e);
    }
  };
  return {
    GET,
    POST,
    PUT,
    DEL,
  };
};

export default useGatewayApi;
