import axios from "axios";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, CheckoutWizard, Layout } from "../components";
import { ICartItem } from "../types";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";

function PlaceOrder() {
  const { push, replace } = useRouter();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const [itemsPrice, setItemsPrice] = useState<number>(0);
  const [taxPrice, setTaxPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  function roundToTwoDecimals(num: number) {
    return Math.round(num * 100 + Number.EPSILON) / 100;
  }

  async function placeOrderHandler() {
    setIsLoading(true);

    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const { data } = await axios.post("/api/orders", orderData);
      setIsLoading(false);

      dispatch({ type: "CART_CLEAR_ITEMS" });

      Cookies.set("cart", JSON.stringify({ ...cart, cartItems: [] }));

      replace(`/order/${data._id}`);
    } catch (err) {
      toast.error(getError(err) || "An error occurred");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!paymentMethod) {
      push("/payment");
      return;
    }
  }, [paymentMethod, push]);

  useEffect(() => {
    setItemsPrice(
      roundToTwoDecimals(
        cartItems?.reduce(
          (a: number, c: { quantity: number; price: number }) =>
            a + c.quantity * c.price,
          0
        )
      )
    );

    setShippingPrice(itemsPrice > 200 ? 0 : 15);

    setTaxPrice(roundToTwoDecimals(itemsPrice * 0.15));

    setTotalPrice(roundToTwoDecimals(itemsPrice + taxPrice + shippingPrice));
  }, [cartItems, itemsPrice, shippingPrice, taxPrice]);

  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />

      <h1 className="text-xl mb-4">Place Order</h1>

      {cartItems.length === 0 ? (
        <h3 className="text-lg">
          Cart is empty. <Link href="/">Go shopping</Link>
        </h3>
      ) : (
        <div className="grid md:grid-cols-4 gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>

              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </div>

              <div>
                <Link href="/shipping">Edit</Link>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>

              <div>{paymentMethod}</div>

              <div>
                <Link href="/payment">Edit</Link>
              </div>
            </div>

            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">
                Order Item{cartItems.length > 1 ? "s" : ""}
              </h2>

              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="p-2 md:p-5 text-left">Item</th>
                    <th className="p-2 md:p-5 text-right">Quantity</th>
                    <th className="p-2 md:p-5 text-right">Price</th>
                    <th className="p-2 md:p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems?.map((item: ICartItem) => (
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
                      <td className="p-2 md:p-5 text-right">{item.quantity}</td>
                      <td className="p-2 md:p-5 text-right">${item.price}</td>
                      <td className="p-2 md:p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div>
                <Link href="/cart">Edit</Link>
              </div>
            </div>
          </div>

          <div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul className="flex flex-col gap-3">
                <li>
                  <div className="flex items-center justify-between">
                    <span>Items</span>
                    <span>${itemsPrice}</span>
                  </div>
                </li>

                <li>
                  <div className="flex items-center justify-between">
                    <span>Tax</span>
                    <span>${taxPrice}</span>
                  </div>
                </li>

                <li>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>${shippingPrice}</span>
                  </div>
                </li>

                <li>
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </li>

                <li>
                  <Button
                    onClick={() => placeOrderHandler()}
                    className="w-full"
                    isLoading={isLoading}
                  >
                    Place Order
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

PlaceOrder.auth = true;

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
