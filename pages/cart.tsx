import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { Layout } from "../components";
import { IProduct } from "../types";
import { Store } from "../utils/Store";
import { XCircleIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

function Cart() {
  const router = useRouter();

  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  function removeItem(itemToRemove: IProduct) {
    dispatch({
      type: "CART_REMOVE_ITEM",
      payload: itemToRemove,
    });
  }

  function updateQuantity(item: IProduct, qty: string) {
    const quantity = Number(qty);

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  }

  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-xl">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <h3 className="text-lg">
          Cart is empty. <Link href="/">Go shopping</Link>
        </h3>
      ) : (
        <div className="grid md:grid-cols-4 gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="p-2 md:p-5 text-left">Item</th>
                  <th className="p-2 md:p-5 text-right">Quantity</th>
                  <th className="p-2 md:p-5 text-right">Price</th>
                  <th className="p-2 md:p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems?.map((item: IProduct) => (
                  <tr key={item.slug} className="border-b">
                    <td className="p-2 md:p-5 text-left">
                      <Link href={`/product/${item.slug}`}>
                        <a className="flex items-center gap-2 border pr-1">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          {item.name}
                        </a>
                      </Link>
                    </td>
                    <td className="p-2 md:p-5 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item, e.target.value)}
                      >
                        {[...Array.from(Array(item.countInStock).keys())].map(
                          (x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                    <td className="p-2 md:p-5 text-right">{item.price}</td>
                    <td className="p-2 md:p-5 text-center">
                      <button onClick={() => removeItem(item)}>
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div className="card p-5">
              <ul>
                <li>
                  <div className="pb-3">
                    Subtotal (
                    {cartItems?.reduce(
                      (a: number, c: { quantity: number }) => a + c.quantity,
                      0
                    )}
                    ) : $
                    {cartItems?.reduce(
                      (a: number, c: { quantity: number; price: number }) =>
                        a + c.quantity * c.price,
                      0
                    )}
                  </div>
                </li>

                <li>
                  <button
                    onClick={() => router.push("/login?redirect=/shipping")}
                    className="primary-button w-full"
                  >
                    Check out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
