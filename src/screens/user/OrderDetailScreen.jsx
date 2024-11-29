import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../../styles/user";
import UserMenu from "../../components/user/UserMenu";
import { Link, useParams } from "react-router-dom";
import Title from "../../components/common/Title";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { getOrderDetail } from "../../services/apiService";
import { useEffect, useState } from "react";
import {
  getVariant,
  getColor,
  getSize,
  getProductById,
  trackingOrder,
} from "../../services/apiService";

const OrderDetailScreenWrapper = styled.main`
  .btn-and-title-wrapper {
    margin-bottom: 24px;
    .title {
      margin-bottom: 0;
    }

    .btn-go-back {
      margin-right: 12px;
      transition: ${defaultTheme.default_transition};

      &:hover {
        margin-right: 16px;
      }
    }
  }

  .order-d-top {
    background-color: ${defaultTheme.color_whitesmoke};
    padding: 26px 32px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.05);

    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
      row-gap: 12px;
    }
  }
`;

const OrderDetailListWrapper = styled.div`
  padding: 24px;
  margin-top: 40px;
  border: 1px solid rgba(0, 0, 0, 0.05);

  @media (max-width: ${defaultTheme.md}) {
    padding: 18px;
  }

  @media (max-width: ${defaultTheme.md}) {
    padding: 12px;
  }

  .order-d-item {
    grid-template-columns: 80px 1fr 1fr 32px;
    gap: 20px;
    padding: 12px 0;
    border-bottom: 1px solid ${defaultTheme.color_whitesmoke};
    position: relative;

    @media (max-width: ${defaultTheme.xl}) {
      grid-template-columns: 80px 3fr 2fr 32px;
      padding: 16px 0;
      gap: 16px;
    }

    @media (max-width: ${defaultTheme.sm}) {
      grid-template-columns: 50px 3fr 2fr;
      gap: 16px;
    }

    @media (max-width: ${defaultTheme.xs}) {
      grid-template-columns: 100%;
      gap: 12px;
    }

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }

    &-img {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

      @media (max-width: ${breakpoints.sm}) {
        width: 50px;
        height: 50px;
      }

      @media (max-width: ${breakpoints.sm}) {
        width: 100%;
        height: 100%;
      }
    }

    &-calc {
      p {
        display: inline-block;
        margin-right: 50px;

        @media (max-width: ${defaultTheme.lg}) {
          margin-right: 20px;
        }
      }
    }

    &-btn {
      margin-bottom: auto;
      &:hover {
        color: ${defaultTheme.color_sea_green};
      }

      @media (max-width: ${breakpoints.sm}) {
        position: absolute;
        right: 0;
        top: 10px;
      }

      @media (max-width: ${defaultTheme.xs}) {
        width: 28px;
        height: 28px;
        z-index: 5;
        background-color: ${defaultTheme.color_white};
        border-radius: 50%;
        right: 8px;
        top: 24px;
      }
    }
  }
`;

const CompactOrderTrackingWrapper = styled.div`
  padding: 16px;
  margin-top: 20px;
  background-color: ${defaultTheme.color_light_gray};
  border-radius: 8px;
  font-size: 14px;

  .tracking-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid ${defaultTheme.color_gray_light};

    &:last-child {
      border-bottom: none;
    }

    .icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: ${defaultTheme.color_primary};
      color: ${defaultTheme.color_white};
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      font-size: 12px;
    }

    .details {
      flex: 1;
      display: flex;
      flex-direction: column;
      color: ${defaultTheme.color_dark};

      .location {
        font-weight: 500;
      }

      .carrier {
        color: ${defaultTheme.color_gray};
        font-size: 13px;
      }
    }

    .time {
      font-size: 12px;
      color: #26aa99;
      white-space: nowrap;
    }
  }
`;

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Đơn hàng", link: "/order" },
  { label: "Chi tiết đơn hàng", link: "" },
];

const OrderDetailScreen = () => {
  const { id } = useParams();

  const [orderDetail, setOrderDetail] = useState(null);
  const [orderTracking, setOrderTracking] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const response = await getOrderDetail(id);
      setOrderDetail(response.data);

      if (response.data.status === "success") {
        const dataTracking = await trackingOrder(id);
        setOrderTracking(dataTracking.data);
      }
    };

    fetchOrderDetail();
  }, []);

  console.log(orderTracking);

  useEffect(() => {
    const fetchProductData = async () => {
      const productPromises = orderDetail?.order_detail.map(async (detail) => {
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
          quantity: detail.quantity,
          price: detail.price,
        };
      });

      const fetchedProducts = await Promise.all(productPromises);
      setProducts(fetchedProducts);
    };

    fetchProductData();
  }, [orderDetail]);

  return (
    <OrderDetailScreenWrapper className="page-py-spacing">
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <UserDashboardWrapper>
          <UserMenu />
          <UserContent>
            <div className="flex items-center justify-start btn-and-title-wrapper">
              <Link
                to="/order"
                className="btn-go-back inline-flex items-center justify-center text-xxl"
              >
                <i className="bi bi-chevron-left"></i>
              </Link>
              <Title titleText={"Chi tiết đơn hàng"} />
            </div>

            <div className="order-d-wrapper">
              <div className="order-d-top flex justify-between items-start">
                <div className="order-d-top-l">
                  <h4 className="text-3xl order-d-no">
                    Mã đơn hàng: #{orderDetail?.id}
                  </h4>
                  <p className="text-lg font-medium text-gray">
                    Trạng thái:{" "}
                    <span className="text-outerspace">
                      {orderDetail?.status === "pending"
                        ? "Đang xử lý"
                        : orderDetail?.status === "shipping"
                        ? "Đang vận chuyển"
                        : orderDetail?.status === "success"
                        ? "Đã giao hàng"
                        : orderDetail?.status === "cancel"
                        ? "Đã hủy"
                        : orderDetail?.status === "refund"
                        ? "Đã hoàn tiền"
                        : ""}
                    </span>
                  </p>
                  <p className="text-lg font-medium text-gray">
                    Đặt hàng vào{" "}
                    {new Date(orderDetail?.order_date).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
                <div className="order-d-top-r text-xxl text-gray font-semibold">
                  Tổng tiền:{" "}
                  <span className="text-outerspace">
                    {orderDetail?.total_amount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
              </div>

              <OrderDetailListWrapper className="order-d-list">
                {products?.map(
                  ({ img, product, color, size, quantity, price }) => {
                    return (
                      <div className="order-d-item grid" key={product.id}>
                        <div className="order-d-item-img">
                          <img
                            src={`https://api.yody.lokid.xyz${img}`}
                            alt={product?.Product?.name}
                            className="object-fit-cover"
                          />
                        </div>
                        <div className="order-d-item-info">
                          <p className="text-xl font-bold">
                            {product?.Product?.name}
                          </p>
                          <p className="text-md font-bold">
                            Màu: &nbsp;
                            <span className="font-medium text-gray">
                              {color?.name}
                            </span>
                          </p>
                          <p className="text-md font-bold">
                            Kích thước: &nbsp;
                            <span className="font-medium text-gray">
                              {size?.name}
                            </span>
                          </p>
                        </div>
                        <div className="order-d-item-calc">
                          <p className="font-bold text-lg">
                            Số lượng: &nbsp;
                            <span className="text-gray">{quantity}</span>
                          </p>
                          <p className="font-bold text-lg">
                            Giá: &nbsp;
                            <span className="text-gray">
                              {price.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                )}
              </OrderDetailListWrapper>
            </div>

            {orderDetail?.status === "success" && (
              <CompactOrderTrackingWrapper>
                <h3 className="text-xl font-semibold mb-4">
                  Theo dõi đơn hàng
                </h3>
                {orderTracking?.map((tracking, index) => (
                  <div className="tracking-item" key={index}>
                    <div className="icon">
                      <i className="bi bi-check-lg"></i>
                    </div>
                    <div className="details">
                      <p className="location">{tracking.location}</p>
                      <p className="carrier">
                        Đơn vị vận chuyển: {tracking.carrier}
                      </p>
                    </div>
                    <div className="time">
                      {new Date(tracking.create_time).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ))}
              </CompactOrderTrackingWrapper>
            )}
          </UserContent>
        </UserDashboardWrapper>
      </Container>
    </OrderDetailScreenWrapper>
  );
};

export default OrderDetailScreen;
