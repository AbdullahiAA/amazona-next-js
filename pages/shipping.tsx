import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { Button, CheckoutWizard, Layout } from "../components";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";

type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export default function Shipping() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ShippingAddress>();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;

  const { push } = useRouter();

  useEffect(() => {
    setValue("fullName", shippingAddress?.fullName);
    setValue("address", shippingAddress?.address);
    setValue("city", shippingAddress?.city);
    setValue("postalCode", shippingAddress?.postalCode);
    setValue("country", shippingAddress?.country);
  }, [setValue, shippingAddress]);

  const onSubmit: SubmitHandler<ShippingAddress> = async ({
    address,
    city,
    country,
    fullName,
    postalCode,
  }) => {
    setIsLoading(true);

    try {
      dispatch({
        type: "SAVE_SHIPPING_ADDRESS",
        payload: { address, city, country, fullName, postalCode },
      });

      push("/payment");
      setIsLoading(false);
    } catch (err) {
      toast.error(getError(err) || "An error occured!");
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />

      <form
        className="m-auto max-w-screen-md flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-xl">Shipping Address</h1>

        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            className="w-full"
            {...register("fullName", {
              required: "Please enter your full name",
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>

        <div>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            className="w-full"
            {...register("address", {
              required: "Please enter your address",
              minLength: { value: 3, message: "Address is too short" },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>

        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            className="w-full"
            {...register("city", {
              required: "Please enter your city",
            })}
          />
          {errors.city && (
            <div className="text-red-500">{errors.city.message}</div>
          )}
        </div>

        <div>
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            className="w-full"
            {...register("postalCode", {
              required: "Please enter your postal code",
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500">{errors.postalCode.message}</div>
          )}
        </div>

        <div>
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            className="w-full"
            {...register("country", {
              required: "Please enter your country",
            })}
          />
          {errors.country && (
            <div className="text-red-500">{errors.country.message}</div>
          )}
        </div>

        <div className="flex justify-between">
          <Button isLoading={isLoading}>Next</Button>
        </div>
      </form>
    </Layout>
  );
}

Shipping.auth = true;
