import styled from "styled-components";
import ProductItemByCategory from "./ProductItemByCategory";
import { PropTypes } from "prop-types";
import { breakpoints } from "../../styles/themes/default";

const ProductListWrapper = styled.div`
  column-gap: 20px;
  row-gap: 40px;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));

  @media (max-width: ${breakpoints.sm}) {
    gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const ProductListByCategory = ({ products }) => {
  return (
    <ProductListWrapper className="grid">
      {products?.length > 0 ? (
        products?.map((product) => (
          <ProductItemByCategory key={product.id} product={product} />
        ))
      ) : (
        <p>Không có sản phẩm nào</p>
      )}
    </ProductListWrapper>
  );
};

export default ProductListByCategory;

ProductListByCategory.propTypes = {
  products: PropTypes.array,
};
