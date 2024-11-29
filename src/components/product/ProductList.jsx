import styled from "styled-components";
import ProductItem from "./ProductItem";
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

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #999;
`;

const ProductList = ({ products, isLoading }) => {
  return (
    <ProductListWrapper className="grid">
      {isLoading ? (
        <LoadingMessage>Đang tải sản phẩm...</LoadingMessage>
      ) : products?.length > 0 ? (
        products?.map((product) =>
          product && product.Product ? (
            <ProductItem key={product.Product.id} product={product} />
          ) : (
            <p key={product.Product.id}>Không có sản phẩm nào.</p>
          )
        )
      ) : (
        <p>Không có sản phẩm nào.</p>
      )}
    </ProductListWrapper>
  );
};

export default ProductList;

ProductList.propTypes = {
  products: PropTypes.array,
  isLoading: PropTypes.bool,
};
