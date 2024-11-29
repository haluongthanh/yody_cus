/* eslint-disable react/prop-types */
import styled from "styled-components";
import { PropTypes } from "prop-types";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { useEffect, useState } from "react";
import {
  updateProductInCart,
  deleteProductInCart,
  getVariant,
  getProductById,
  getSize,
  getColor,
} from "../../services/apiService";
import { useCart } from "../../context/CartContext";

const CartTableRowWrapper = styled.tr`
  .cart-tbl {
    &-prod {
      grid-template-columns: 80px auto;
      column-gap: 12px;

      @media (max-width: ${breakpoints.xl}) {
        grid-template-columns: 60px auto;
      }
    }

    &-qty {
      .qty-inc-btn,
      .qty-dec-btn {
        width: 24px;
        height: 24px;
        border: 1px solid ${defaultTheme.color_platinum};
        border-radius: 2px;

        &:hover {
          border-color: ${defaultTheme.color_sea_green};
          background-color: ${defaultTheme.color_sea_green};
          color: ${defaultTheme.color_white};
        }
      }

      .qty-value {
        width: 40px;
        height: 24px;
      }
    }
  }

  .cart-prod-info {
    p {
      margin-right: 8px;
      span {
        margin-right: 4px;
      }
    }
  }

  .cart-prod-img {
    width: 80px;
    height: 80px;
    overflow: hidden;
    border-radius: 8px;

    @media (max-width: ${breakpoints.xl}) {
      width: 60px;
      height: 60px;
    }
  }

  .color-box {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid ${defaultTheme.color_platinum};
    display: inline-block;
  }
`;

const CartItem = ({ cartItem, onQuantityChange, onItemDelete }) => {
  const { updateCartCountWhenDelete } = useCart();

  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [loading, setLoading] = useState(false);
  const [variant, setVariant] = useState([]);
  const [product, setProduct] = useState({});
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [images, setImages] = useState([]);

  const handleQuantityChange = async (newQuantity) => {
    setQuantity(newQuantity); // Cập nhật ngay lập tức trong UI
    setLoading(true);
    try {
      await updateProductInCart({ id: cartItem.id, quantity: newQuantity });
      onQuantityChange(cartItem.id, newQuantity); // Thông báo lên component cha
    } catch (error) {
      console.error("Failed to update quantity:", error);
      // Khôi phục lại số lượng cũ nếu có lỗi xảy ra
      setQuantity(cartItem.quantity);
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => {
    if (!loading) {
      handleQuantityChange(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1 && !loading) {
      handleQuantityChange(quantity - 1);
    }
  };

  const deleteCart = async () => {
    setLoading(true);
    try {
      const data = await deleteProductInCart(cartItem.id);
      if (data.code === 20001) {
        onItemDelete(cartItem.id);
        updateCartCountWhenDelete(data.data);
      }
    } catch (error) {
      console.error("Failed to delete product from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getVariant(cartItem.product_variant_id);
      setVariant(data.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(variant.product_id);
      const filteredImages = data?.data?.Images?.filter(
        (image) => image.color_id === variant.color_id
      );
      setProduct(data?.data?.Product);
      setImages(filteredImages[0]?.link);
    };
    const fetchSize = async () => {
      const data = await getSize();
      setSize(data.data.find((s) => s.id === variant.size_id)); // So sánh và lấy kích thước đúng
    };
    const fetchColor = async () => {
      const data = await getColor();
      setColor(data.data.find((c) => c.id === variant.color_id)); // So sánh và lấy màu đúng
    };
    fetchProduct();
    fetchColor(), fetchSize();
  }, [variant]);

  return (
    <CartTableRowWrapper key={cartItem.id}>
      <td>
        <div className="cart-tbl-prod grid">
          <div className="cart-prod-img">
            <img
              src={`https://api.yody.lokid.xyz${images}`}
              className="object-fit-cover"
              alt=""
            />
          </div>
          <div className="cart-prod-info">
            <h4 className="text-base">{product?.name}</h4>
            <div className="inline-flex" style={{ gap: 10, marginTop: 10 }}>
              <span
                className="color-box"
                style={{ backgroundColor: color?.hex_code }}
              ></span>
              <p className="text-sm text-gray inline-flex">
                <span className="font-semibold">Size:</span>
                {size?.name}
              </p>
            </div>
          </div>
        </div>
      </td>
      <td>
        <span className="text-lg font-bold text-outerspace">
          {product?.price?.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}{" "}
        </span>
      </td>
      <td>
        <div className="cart-tbl-qty flex items-center">
          <button className="qty-dec-btn" onClick={decreaseQuantity}>
            <i className="bi bi-dash-lg"></i>
          </button>
          <span className="qty-value inline-flex items-center justify-center font-medium text-outerspace">
            {quantity}
          </span>
          <button className="qty-inc-btn" onClick={increaseQuantity}>
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </td>
      <td>
        <span className="text-lg font-bold text-outerspace">
          {(product?.price * quantity)?.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </span>
      </td>
      <td>
        <div className="cart-tbl-actions flex justify-center">
          <button onClick={deleteCart} className="tbl-del-action text-red">
            <i className="bi bi-trash3"></i>
          </button>
        </div>
      </td>
    </CartTableRowWrapper>
  );
};

export default CartItem;

CartItem.propTypes = {
  cartItem: PropTypes.object,
};
