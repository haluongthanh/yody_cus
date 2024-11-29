import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { commonCardStyles } from "../../styles/card";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { useEffect, useState } from "react";

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

const ProductItem = ({ product }) => {
  const { Product, Images } = product;
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (
      Images?.length > 0 &&
      typeof Images[0] === "object" &&
      "link" in Images[0]
    ) {
      setImageUrl(Images[0].link);
    } else {
      setImageUrl(Images[0]);
    }
  }, [Images]);

  return (
    <ProductCardWrapper key={Product.id} to={`/product/details/${Product.id}`}>
      <div className="product-img">
        <img
          className="object-fit-cover"
          src={`https://api.yody.lokid.xyz${imageUrl}`}
          alt={Product.name}
        />
        {/* <button
          type="button"
          className="product-wishlist-icon flex items-center justify-center bg-white"
        >
          <i className="bi bi-heart"></i>
        </button> */}
      </div>
      <div className="product-info">
        <p className="font-bold">{Product.name}</p>
        <div className="flex items-center justify-between text-sm font-medium">
          <span className="text-outerspace font-bold">
            {Product.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        </div>
      </div>
    </ProductCardWrapper>
  );
};

export default ProductItem;

ProductItem.propTypes = {
  product: PropTypes.object,
};
