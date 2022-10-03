import { createContext, useReducer } from "react";

interface IState {
  cart: {
    cartItems: any[];
  };
  state: any;
  dispatch: any;
}

interface IStoreProvider {
  children: any;
}

const initialState: IState = {
  cart: {
    cartItems: [],
  },
  state: null,
  dispatch: null,
};

export const Store = createContext(initialState);

function reducer(state: IState, action: { type: string; payload: any }) {
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
  const value = { ...state, dispatch };

  return <Store.Provider value={value}>{children}</Store.Provider>;
}
