import styled from "styled-components";
import PropTypes from "prop-types";
import { BaseLinkGreen } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import {
  getVariant,
  getColor,
  getSize,
  getProductById,
} from "../../services/apiService";
import { useEffect, useState } from "react";

const OrderItemWrapper = styled.div`
  margin: 30px 0;
  border-bottom: 1px solid ${defaultTheme.color_anti_flash_white};

  .order-item-title {
    margin-bottom: 12px;
  }

  .order-item-details {
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 24px 32px;
    border-radius: 8px;

    @media (max-width: ${breakpoints.sm}) {
      padding: 20px 24px;
    }

    @media (max-width: ${breakpoints.xs}) {
      padding: 12px 16px;
    }
  }

  .order-info-group {
    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
    }
  }

  .order-info-item {
    width: 50%;

    span {
      &:nth-child(2) {
        margin-left: 4px;
      }
    }

    &:nth-child(even) {
      text-align: right;
      @media (max-width: ${breakpoints.lg}) {
        text-align: left;
      }
    }

    @media (max-width: ${breakpoints.sm}) {
      width: 100%;
      margin: 2px 0;
    }
  }

  .order-overview {
    margin: 28px 0;
    gap: 12px;
    flex-wrap: wrap;

    @media (max-width: ${breakpoints.lg}) {
      margin: 20px 0;
    }

    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
    }

    &-img {
      width: 100px;
      height: 100px;
      border-radius: 6px;
      overflow: hidden;
    }

    &-content {
      grid-template-columns: 100px auto;
      gap: 18px;
    }

    &-info {
      ul {
        span {
          &:nth-child(2) {
            margin-left: 4px;
          }
        }
      }
    }
  }
`;

const OrderItem = ({ order }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const productPromises = order.order_detail.map(async (detail) => {
        const product = await getProductById(detail.product_id);
        const variant = await getVariant(detail.product_variant_id);
        const colors = await getColor();
        const sizes = await getSize();

        const getImgProduct = product.data.Images.filter(
          (image) => image.color_id === variant.data.color_id
        );

        return {
          img: getImgProduct[0]?.link,
          product: product.data,
          color: colors.data.find(
            (color) => color.id === variant.data.color_id
          ),
          size: sizes.data.find((size) => size.id === variant.data.size_id),
          detail,
        };
      });

      const fetchedProducts = await Promise.all(productPromises);
      setProducts(fetchedProducts);
    };

    fetchData();
  }, [order]);

  return (
    <OrderItemWrapper>
      <div className="order-item-details">
        <h3 className="text-x order-item-title">Mã đơn hàng: #{order.id}</h3>
        <div className="order-info-group flex flex-wrap">
          <div className="order-info-item">
            <span className="text-gray font-semibold">Thời gian đặt hàng:</span>
            <span className="text-silver">
              {new Date(order.order_date).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <div className="order-info-item">
            <span className="text-gray font-semibold">
              Trạng thái đơn hàng:
            </span>
            <span className="text-silver">
              {order.status === "pending"
                ? "Đang xử lý"
                : order.status === "shipping"
                ? "Đang vận chuyển"
                : order.status === "success"
                ? "Đã giao hàng"
                : order.status === "cancel"
                ? "Đã hủy"
                : order.status === "refund"
                ? "Đã hoàn tiền"
                : ""}
            </span>
          </div>
          <div className="order-info-item">
            <span className="text-gray font-semibold">
              Phương thức thanh toán:
            </span>
            <span className="text-silver">Chuyển khoản VNPay</span>
          </div>
        </div>
      </div>
      <div className="order-overview flex justify-between">
        <div className="flex flex-col" style={{ gap: 20 }}>
          {products.map(({ img, product, color, size, detail }) => (
            <div key={detail.id} className="order-overview-content grid">
              <div className="order-overview-img">
                <img
                  src={`https://api.yody.lokid.xyz${img}`}
                  alt={product?.Product?.name}
                  className="object-fit-cover"
                />
              </div>
              <div className="order-overview-info">
                <ul>
                  <li className="font-semibold text-base">
                    <span>Tên sản phẩm:</span>
                    <span className="text-silver">
                      {product?.Product?.name}
                    </span>
                  </li>
                  <li className="font-semibold text-base">
                    <span>Màu sắc:</span>
                    <span className="text-silver">{color?.name}</span>
                  </li>
                  <li className="font-semibold text-base">
                    <span>Kích thước:</span>
                    <span className="text-silver">{size?.name}</span>
                  </li>
                  <li className="font-semibold text-base">
                    <span>Số lượng:</span>
                    <span className="text-silver">{detail?.quantity}</span>
                  </li>
                  <li className="font-semibold text-base">
                    <span>Tổng:</span>
                    <span className="text-silver">
                      {(detail.price * detail.quantity).toLocaleString(
                        "vi-VN",
                        {
                          style: "currency",
                          currency: "VND",
                        }
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
        <BaseLinkGreen to={`/order_detail/${order.id}`}>
          Xem Chi Tiết
        </BaseLinkGreen>
      </div>
    </OrderItemWrapper>
  );
};

export default OrderItem;

OrderItem.propTypes = {
  order: PropTypes.object,
};
