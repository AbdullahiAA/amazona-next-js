// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Product from "../../../models/Product";
import db from "../../../utils/db";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();

  res.status(200).json(product);
}
