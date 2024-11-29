/* eslint-disable react/prop-types */
import { Section } from "../../styles/styles";
import Title from "../common/Title";
import ProductList from "./ProductList";

const ProductSimilar = ({ products }) => {
  return (
    <Section>
      <Title titleText={"Sản phẩm tương tự"} />
      <ProductList products={products.slice(0, 4)} />
    </Section>
  );
};

export default ProductSimilar;
