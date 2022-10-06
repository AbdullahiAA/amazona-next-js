import db from "../../utils/db";
import data from "../../utils/data";
import User from "../../models/User";

const handler = async (req: any, res: any) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await db.disconnect();

  res.send({ message: "Seeded successfully" });
};

export default handler;
