import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Store } from "../utils/Store";
import Button from "./Button";

type IProductItem = {
  product: any;
};

export default function ProductItem({ product }: IProductItem) {
  const [isLoading, setIsLoading] = useState(false);

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  async function addToCart() {
    setIsLoading(true);

    toast.dismiss();

    const existItem = cart?.cartItems?.find(
      (item: any) => item.slug === product?.slug
    );

    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      toast.error("Sorry, product is out of stock");
      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });

    toast.success("Product added to the cart successfully");
    setIsLoading(false);
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

        <Button type="button" onClick={addToCart} isLoading={isLoading}>
          Add to cart
        </Button>
      </div>
    </div>
  );
}
