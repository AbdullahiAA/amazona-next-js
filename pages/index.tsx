import { Layout, ProductItem } from "../components";
import Product from "../models/Product";
import { IProduct } from "../types";
import db from "../utils/db";

type Props = { products: IProduct[] };

function Home({ products }: Props) {
  return (
    <Layout title="Home">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>
    </Layout>
  );
}

export default Home;

export async function getServerSideProps() {
  await db.connect();

  const products = await Product.find().lean();

  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
