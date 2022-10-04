import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "../../components";
import data from "../../utils/data";
import { Store } from "../../utils/Store";

export default function ProductScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const { query, push } = useRouter();
  const { slug } = query;

  const product = data.products.find((p) => p.slug === slug);
  if (!product) {
    return <Layout title="Product Not Found">Product Not Found</Layout>;
  }

  function addToCart() {
    const existItem = cart.cartItems.find(
      (item: any) => item.slug === product?.slug
    );

    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product?.countInStock && product?.countInStock < quantity) {
      alert("Sorry, product is out of stock");
      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });

    push("/cart");
  }

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">back to products</Link>
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

          <button className="primary-button w-full" onClick={addToCart}>
            Add to cart
          </button>
        </div>
      </div>
    </Layout>
  );
}
