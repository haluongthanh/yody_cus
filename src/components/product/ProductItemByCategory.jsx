import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { commonCardStyles } from "../../styles/card";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { useEffect, useState } from "react";
import { getImgUrlBySlug } from "../../services/apiService";

const ProductCardWrapper = styled(Link)`
  ${commonCardStyles}
  @media(max-width: ${breakpoints.sm}) {
    padding-left: 0;
    padding-right: 0;
  }

  .product-img {
    height: 393px;
    position: relative;

    @media (max-width: ${breakpoints.sm}) {
      height: 320px;
    }
  }

  .product-wishlist-icon {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    border-radius: 100%;

    &:hover {
      background-color: ${defaultTheme.color_yellow};
      color: ${defaultTheme.color_white};
    }
  }
`;

const ProductItemByCategory = ({ product }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const data = await getImgUrlBySlug(product.slug);
        if (data.data && data.data.length > 0) {
          setImageUrl(data.data[0].image_link);
        }
      } catch (error) {
        console.error("Lỗi: ", error);
      }
    };

    fetchImageUrl();
  }, [product.slug]);

  return (
    <ProductCardWrapper key={product.id} to={`/product/details/${product.id}`}>
      <div className="product-img">
        <img
          className="object-fit-cover"
          src={`https://api.yody.lokid.xyz${imageUrl}`}
        />
        {/* <button
          type="button"
          className="product-wishlist-icon flex items-center justify-center bg-white"
        >
          <i className="bi bi-heart"></i>
        </button> */}
      </div>
      <div className="product-info">
        <p className="font-bold">{product.name}</p>
        <div className="flex items-center justify-between text-sm font-medium">
          <span className="text-outerspace font-bold">
            {product.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        </div>
      </div>
    </ProductCardWrapper>
  );
};

export default ProductItemByCategory;

ProductItemByCategory.propTypes = {
  product: PropTypes.object,
};
