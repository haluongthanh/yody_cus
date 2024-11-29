/* eslint-disable react/prop-types */
import styled from "styled-components";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import {
  getVariant,
  getProductById,
  getSize,
  getColor,
} from "../../services/apiService";
import { useEffect, useState } from "react";

const CheckoutSummaryWrapper = styled.div`
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.05),
    -2px -2px 4px 0px rgba(0, 0, 0, 0.05);
  padding: 40px;

  @media (max-width: ${breakpoints.xl}) {
    padding: 24px;
  }

  @media (max-width: ${breakpoints.sm}) {
    padding: 16px;
  }

  @media (max-width: ${breakpoints.xs}) {
    background-color: transparent;
    padding: 0;
    box-shadow: none;
  }

  .order-list {
    row-gap: 24px;
    margin-top: 20px;

    @media (max-width: ${breakpoints.sm}) {
      row-gap: 16px;
    }
  }

  .order-item {
    grid-template-columns: 60px auto;
    gap: 16px;

    @media (max-width: ${breakpoints.xs}) {
      align-items: center;
    }

    &-img {
      width: 60px;
      height: 60px;
      overflow: hidden;
      border-radius: 4px;
    }

    &-info {
      gap: 16px;

      @media (max-width: ${breakpoints.xs}) {
        flex-direction: column;
        gap: 6px;
      }
    }
  }

  .order-info {
    margin-top: 30px;
    @media (max-width: ${breakpoints.sm}) {
      margin-top: 20px;
    }

    li {
      margin: 6px 0;
    }

    .list-separator {
      height: 1px;
      background-color: ${defaultTheme.color_anti_flash_white};
      margin: 12px 0;
    }
  }
`;

const CheckoutSummary = ({ cartItems, subtotal }) => {
  const grandTotal = subtotal;
  const shippingCost = 0;

  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedItems = await Promise.all(
        cartItems?.map(async (item) => {
          const variantData = await getVariant(item.product_variant_id);
          const productData = await getProductById(variantData.data.product_id);
          const sizeData = await getSize();
          const colorData = await getColor();

          const getColorFollowVariant = colorData.data.find(
            (color) => color.id === variantData.data.color_id
          );

          const getSizeFollowVariant = sizeData.data.find(
            (size) => size.id === variantData.data.size_id
          );

          const getImgProduct = productData.data.Images.filter(
            (image) => image.color_id === variantData.data.color_id
          );

          return {
            ...item,
            img: getImgProduct[0]?.link,
            product: productData.data,
            size: getSizeFollowVariant,
            color: getColorFollowVariant,
          };
        })
      );
      setOrderDetails(fetchedItems);
    };

    fetchData();
  }, [cartItems]);

  return (
    <CheckoutSummaryWrapper>
      <h4 className="text-xxl font-bold text-outersapce">Tóm tắt đơn hàng</h4>
      <div className="order-list grid">
        {orderDetails?.map((order) => {
          console.log(order);
          return (
            <div className="order-item grid" key={order.id}>
              <div className="order-item-img">
                <img
                  src={`https://api.yody.lokid.xyz${order.img}`}
                  className="object-fit-cover"
                  alt=""
                />
              </div>
              <div className="order-item-info flex justify-between">
                <div className="order-item-info-l">
                  <p className="text-base font-bold text-outerspace">
                    {order.product.Product.name}&nbsp;
                    <span className="text-gray">x{order.quantity}</span>
                  </p>
                  <p className="text-base font-bold text-outerspaace">
                    Màu: &nbsp;
                    <span className="text-gray font-normal">
                      {order.color.name}
                    </span>
                  </p>
                </div>
                <div className="order-item-info-r text-gray font-bold text-base">
                  {order.product.Product.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ul className="order-info">
        <li className="flex items-center justify-between">
          <span className="text-outerspace font-bold text-lg">
            Tạm tính{" "}
            <span className="text-gray font-semibold">(3 sản phẩm)</span>
          </span>
          <span className="text-outerspace font-bold text-lg">
            {subtotal.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        </li>

        <li className="flex items-center justify-between">
          <span className="text-outerspace font-bold text-lg">
            Phí vận chuyển
          </span>
          <span className="text-outerspace font-bold text-lg">
            {shippingCost.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        </li>

        <li className="list-separator"></li>
        <li className="flex items-center justify-between">
          <span className="text-outerspace font-bold text-lg">Tổng cộng</span>
          <span className="text-outerspace font-bold text-lg">
            {grandTotal.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        </li>
      </ul>
    </CheckoutSummaryWrapper>
  );
};

export default CheckoutSummary;
