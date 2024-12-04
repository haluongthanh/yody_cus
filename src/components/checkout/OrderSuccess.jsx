/* eslint-disable react/prop-types */
import styled from "styled-components";
import { getProductById, getVariant } from "../../services/apiService";
import { useEffect, useState } from "react";

const SuccessWrapper = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;

  h1 {
    color: #10b9b0;
    font-size: 24px;
    margin-bottom: 8px;
  }

  .order-code {
    color: #666;
    font-size: 16px;
  }
`;

const OrderSection = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 4px;

  h2 {
    font-size: 18px;
    margin-bottom: 16px;
    color: #333;
  }
`;

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  .info-item {
    span:first-child {
      color: #666;
      margin-right: 8px;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 16px;
  background: ${(props) =>
    props.status === "pending" ? "#fff3cd" : "#d4edda"};
  color: ${(props) => (props.status === "pending" ? "#856404" : "#155724")};
  font-size: 14px;
`;

// Component usage
const OrderSuccess = ({ orderData }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      const productDetailsPromises = orderData?.order_detail?.map(
        async (item) => {
          const product = await getProductById(item.product_id);
          const variant = await getVariant(item.product_variant_id);

          const getImgProduct = product.data.Images.filter(
            (image) => image.color_id === variant.data.color_id
          );

          return {
            orderDetailId: item.id,
            data: product.data,
            img: getImgProduct[0]?.link,
          };
        }
      );

      const productDetails = await Promise.all(productDetailsPromises);
      const productsObj = productDetails.reduce(
        (acc, { orderDetailId, data, img }) => {
          acc[orderDetailId] = { data, img };
          return acc;
        },
        {}
      );
      setProducts(productsObj);
      setLoading(false);
    };

    fetchProducts();
  }, [orderData]);

  
  

  return (
    <SuccessWrapper>
      <Header>
        <h1>Đặt hàng thành công!</h1>
        <span className="order-code">Mã đơn hàng: {orderData?.order_code}</span>
      </Header>

      <OrderSection>
        <h2>Thông tin đơn hàng</h2>
        <OrderInfo>
          <div className="info-item">
            <span>Khách hàng:</span>
            <span>{orderData?.customer_name}</span>
          </div>
          <div className="info-item">
            <span>Ngày đặt:</span>
            <span>
              {new Date(orderData?.order_date).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="info-item">
            <span>Địa chỉ:</span>
            <span>{orderData?.shipping_address}</span>
          </div>
          <div className="info-item">
            <span>Trạng thái:</span>
            <StatusBadge status={orderData?.status}>
              {orderData?.status === "pending" ? "Chờ xử lý" : "Đã xác nhận"}
            </StatusBadge>
          </div>
        </OrderInfo>
      </OrderSection>

      <OrderSection>
        <h2>Chi tiết đơn hàng</h2>
        {orderData?.order_detail.map((item, index) => {
          const productData = products[item.id]?.data?.Product;
          const productImage = products[item.id]?.img;

          return (
            <div key={index} className="order-item">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    padding: "12px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <img
                    src={`https://api.yody.lokid.xyz${productImage}`}
                    alt={products[item.product_id]?.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>
                      {productData?.name}
                    </h3>
                    <div style={{ color: "#666" }}>
                      Số lượng: {item.quantity}
                    </div>
                    <div style={{ color: "#10b9b0", fontWeight: "bold" }}>
                      Giá: {item.price.toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div
          style={{
            marginTop: "16px",
            paddingTop: "16px",
            textAlign: "right",
            fontWeight: "bold",
          }}
        >
          Tổng tiền: {orderData?.total_amount.toLocaleString("vi-VN")}đ
        </div>
      </OrderSection>
    </SuccessWrapper>
  );
};

export default OrderSuccess;
