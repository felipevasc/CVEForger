import type { RightBarMenuItemType } from './RightBarMenuItemType'; // Import the new type

type MenuType = {
    get: boolean;
    toogle: () => void;
    open: () => void;
    close: () => void;
}

export type MenuStoreType = {
    menuEsquerdo: MenuType;
    menuDireito: MenuType;
    menuSuperior: MenuType & {
        setElemento: (e: HTMLElement | null) => void;
        getElemento: HTMLElement | null
    };
    menuInferior: MenuType;
    rightBarMenuItems?: RightBarMenuItemType[]; // Add this line
    setRightBarMenuItems?: (items: RightBarMenuItemType[]) => void; // Add this line
}