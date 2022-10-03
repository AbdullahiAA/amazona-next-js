/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

type IProductItem = {
  product: any;
};

export default function ProductItem({ product }: IProductItem) {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <a>
          <img
            src={product.image}
            alt={product.name}
            className="rounded shadow"
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

        <button className="primary-button" type="button">
          Add to cart
        </button>
      </div>
    </div>
  );
}
