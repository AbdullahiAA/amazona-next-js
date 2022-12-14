import React, { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Layout } from "../../components";
import { Store } from "../../utils/Store";
import Product from "../../models/Product";
import db from "../../utils/db";
import { IProductResponse } from "../../types";
import axios from "axios";
import { toast } from "react-toastify";
import { TiArrowBack } from "react-icons/ti";

type Props = {
  product: IProductResponse;
};

export default function ProductScreen({ product }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const { push } = useRouter();

  if (!product) {
    return <Layout title="Product Not Found">Product Not Found</Layout>;
  }

  async function addToCart() {
    setIsLoading(true);

    const existItem = cart.cartItems.find(
      (item: any) => item.slug === product?.slug
    );

    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data?.countInStock < quantity) {
      toast.error("Sorry, product is out of stock");
      setIsLoading(false);

      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });

    push("/cart");
    setIsLoading(false);
  }

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">
          <a className="flex items-center gap-1 w-fit">
            <TiArrowBack /> back to products
          </a>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
            className="rounded"
          />
        </div>

        <div>
          <ul className="flex flex-col gap-2">
            <li>
              <h1 className="text-lg font-bold">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>

        <div className="card p-5 flex flex-col gap-2 h-fit">
          <div className="flex justify-between">
            <h3>Price</h3>
            <p>${product.price}</p>
          </div>

          <div className="flex justify-between">
            <h3>Status</h3>
            <p>{product.countInStock > 0 ? "In stock" : "Unavailable"}</p>
          </div>

          <Button onClick={addToCart} isLoading={isLoading}>
            Add to cart
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const { params } = context;
  const { slug } = params;

  await db.connect();

  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
