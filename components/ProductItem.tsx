import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { Store } from "../utils/Store";

type IProductItem = {
  product: any;
};

export default function ProductItem({ product }: IProductItem) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  function addToCart() {
    const existItem = cart?.cartItems?.find(
      (item: any) => item.slug === product?.slug
    );

    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      alert("Sorry, product is out of stock");
      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
  }

  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <a className="shadow block">
          <Image
            src={product.image}
            alt={product.name}
            width={100}
            height={100}
            layout="responsive"
            className="rounded"
          />
        </a>
      </Link>

      <div className="flex flex-col items-center justify-center p-5 gap-2">
        <Link href={`/product/${product.slug}`}>
          <a>
            <h2 className="text-lg font-semibold">{product.name}</h2>
          </a>
        </Link>

        <p>{product.brand}</p>

        <p className="font-semibold">${product.price}</p>

        <button className="primary-button" type="button" onClick={addToCart}>
          Add to cart
        </button>
      </div>
    </div>
  );
}
