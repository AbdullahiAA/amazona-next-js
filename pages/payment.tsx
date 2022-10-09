import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { CheckoutWizard, Layout } from "../components";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";

export default function Payment() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const { push } = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedPaymentMethod) {
      return toast.error("Payment method is required");
    }

    try {
      dispatch({
        type: "SAVE_PAYMENT_METHOD",
        payload: selectedPaymentMethod,
      });

      push("/placeorder");
    } catch (err) {
      toast.error(getError(err) || "An error occured!");
    }
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      push("/shippinng");
      return;
    }

    setSelectedPaymentMethod(paymentMethod || "");
  }, [paymentMethod, push, shippingAddress.address]);

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />

      <form
        className="m-auto max-w-screen-md flex flex-col gap-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h1 className="text-xl">Payment Method</h1>

        {["PayPal", "Stripe", "CashOnDelivery"].map((payment) => (
          <div className="flex items-center gap-2" key={payment}>
            <input
              type="radio"
              id={payment}
              name="paymentMethod"
              className="outline-none ring-0 focus:ring-0"
              onChange={() => setSelectedPaymentMethod(payment)}
              checked={selectedPaymentMethod === payment}
            />
            <label htmlFor={payment}>{payment}</label>
          </div>
        ))}

        <div className="flex justify-between">
          <button
            className="default-button"
            type="button"
            onClick={() => push("/shipping")}
          >
            Back
          </button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}

Payment.auth = true;
