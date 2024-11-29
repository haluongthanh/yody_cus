import styled from "styled-components";
import { BaseButtonGreen } from "../../styles/button";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addOrder } from "../../services/apiService";
import { useEffect, useState } from "react";
import {
  getCart,
  deleteProductInCart,
  getOrderByOrderCode,
} from "../../services/apiService";
import { useCart } from "../../context/CartContext";
import OrderSuccess from "../../components/checkout/OrderSuccess";

const PaymentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #f9f9f9;
  padding: 20px;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 40px;
  }

  .icon-success {
    font-size: 5rem;
    color: #28a745;
  }

  .icon-error {
    font-size: 5rem;
    color: #dc3545;
  }

  .success-message {
    color: #28a745;
    font-weight: bold;
  }

  .error-message {
    color: #dc3545;
    font-weight: bold;
  }
`;

const Payment = () => {
  const { getCartCount } = useCart();

  const order = useSelector((state) => state.order);

  const [orderData, setOrderData] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const vnp_TransactionStatus = params.get("vnp_TransactionStatus");
  const vnp_TxnRef = params.get("vnp_TxnRef");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderByOrderCode(vnp_TxnRef);
        if (data.data) {
          setOrderData(data.data);
        }
      } catch (error) {
        console.error("Error getting order:", error);
      }
    };

    const fetchAddOrder = async () => {
      if (vnp_TransactionStatus === "00") {
        try {
          const newOrder = {
            ...order,
            order_code: vnp_TxnRef,
          };
          const data = await addOrder(newOrder);
          if (data.data) {
            const data = await getCart();
            if (data.data) {
              const cartData = await getCart();
              if (cartData.data) {
                // Sử dụng Promise.all để đảm bảo tất cả sản phẩm đều được xóa
                await Promise.all(
                  cartData.data.map((cart) => deleteProductInCart(cart.id))
                );
                await getCartCount(); // Cập nhật số lượng giỏ hàng sau khi xóa
              }
              fetchOrder();
            }
          }
        } catch (error) {
          console.error("Error adding order:", error);
        }
      }
    };

    fetchAddOrder();
  }, [vnp_TxnRef]);

  return (
    <PaymentWrapper>
      {vnp_TransactionStatus === "00" ? (
        <>
          <OrderSuccess orderData={orderData} />
        </>
      ) : (
        <>
          <i className="bi bi-x-circle-fill icon-error"></i>
          <h1>Thanh toán thất bại</h1>
          <p className="error-message">
            Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
          </p>
        </>
      )}
      <Link to={"/"} className="text-white">
        <BaseButtonGreen>Quay về trang chủ</BaseButtonGreen>
      </Link>
    </PaymentWrapper>
  );
};

export default Payment;
