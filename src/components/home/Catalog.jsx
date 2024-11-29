import { Container, Section } from "../../styles/styles";
import Title from "../common/Title";
import { PropTypes } from "prop-types";
import ProductListByCategory from "../product/ProductListByCategory";

const Catalog = ({ catalogTitle, products }) => {
  return (
    <Section>
      <Container>
        <div className="categories-content">
          <Title titleText={catalogTitle} />
          <ProductListByCategory products={products} />
        </div>
      </Container>
    </Section>
  );
};

export default Catalog;

Catalog.propTypes = {
  catalogTitle: PropTypes.string,
  products: PropTypes.array,
};
