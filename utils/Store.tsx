import { createContext, useReducer } from "react";
import { IProduct } from "../types";
import Cookies from "js-cookie";

interface IState {
  cart: {
    cartItems: IProduct[];
    shippingAddress?: { location: any };
    paymentMethod?: string;
  };
}

interface IAction {
  type: string;
  payload: any;
}

interface IStoreProvider {
  children: any;
}

const cartFromCookies = Cookies.get("cart");

const initialState: IState = {
  cart: cartFromCookies ? JSON.parse(cartFromCookies) : { cartItems: [] },
};

export const Store = createContext<any>(null);

function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item: any) => item.slug === newItem.slug
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item: { name: string }) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "CART_REMOVE_ITEM": {
      const itemToRemove = action.payload;

      const cartItems = state.cart.cartItems.filter(
        (item: { slug: string }) => item.slug !== itemToRemove.slug
      );

      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "CART_RESET": {
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: "",
        },
      };
    }

    case "SAVE_SHIPPING_ADDRESS": {
      Cookies.set(
        "cart",
        JSON.stringify({
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        })
      );

      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };
    }

    default:
      return state;
  }
}

export function StoreProvider({ children }: IStoreProvider) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{children}</Store.Provider>;
}
