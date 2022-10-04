import { createContext, useReducer } from "react";
import { IProduct } from "../types";

interface IState {
  cart: {
    cartItems: IProduct[];
  };
}

interface IAction {
  type: string;
  payload: any;
}

interface IStoreProvider {
  children: any;
}

const initialState: IState = {
  cart: {
    cartItems: [],
  },
};

export const Store = createContext<any>(null);

function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case "CART_ADD_ITEM":
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item: any) => item.slug === newItem.slug
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item: { name: string }) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      return { ...state, cart: { ...state.cart, cartItems } };

    default:
      return state;
  }
}

export function StoreProvider({ children }: IStoreProvider) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{children}</Store.Provider>;
}
