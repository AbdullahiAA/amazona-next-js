import type { NextPage } from "next";
import { Layout, ProductItem } from "../components";
import data from "../utils/data";

const Home: NextPage = () => {
  return (
    <Layout title="Home">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.products.map((product) => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>
    </Layout>
  );
};

export default Home;
