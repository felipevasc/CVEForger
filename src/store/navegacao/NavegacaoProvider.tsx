import { useMemo, useState } from "react"; // Added useState
import { NavegacaoContext, type NavegacaoContextType } from "./NavegacaoContext";
import type { RightBarMenuItemType } from './types/RightBarMenuItemType'; // Added import
import useMensagensHandler from "./handlers/MensagensHandler";
import useLoadingHandler from "./handlers/LoadingHandler";
import useUrlApiHandler from "./handlers/UrlApiHandler";
import type { ProviderProps } from "../ProviderProps";
import useMenuHandler from "./handlers/MenuHandler";


const NavegacaoProvider: React.FC<ProviderProps> = ({ children }) => {
  const [rightBarMenuItems, setRightBarMenuItems] = useState<RightBarMenuItemType[]>([]); // Added state
  const mensagensHandler = useMensagensHandler();
  const loadingHandler = useLoadingHandler();
  const urlApiHandler = useUrlApiHandler();
  const menuHandler = useMenuHandler();

  const valuesProps: NavegacaoContextType = useMemo(
    () => ({
      loading: loadingHandler,
      urlApi: urlApiHandler,
      mensagens: mensagensHandler,
      menu: {
        ...menuHandler, // Spread existing menuHandler properties
        rightBarMenuItems: rightBarMenuItems, // Added property
        setRightBarMenuItems: setRightBarMenuItems, // Added property
      },
    }),
    [loadingHandler, urlApiHandler, mensagensHandler, menuHandler, rightBarMenuItems] // Added rightBarMenuItems to dependency array
  );

  return (
    <NavegacaoContext.Provider value={valuesProps}>
      {children}
    </NavegacaoContext.Provider>
  );
};

export default NavegacaoProvider;
