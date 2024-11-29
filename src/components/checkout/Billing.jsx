import styled from "styled-components";
import { Input } from "../../styles/form";
import { BaseButtonGreen } from "../../styles/button";
import CheckoutSummary from "./CheckoutSummary";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import {
  updateProfile,
  getUserInfo,
  getShoppingCart,
  vnpayPayment,
} from "../../services/apiService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addOrder } from "../../redux/slices/orderSlice";

const BillingOrderWrapper = styled.div`
  gap: 60px;
  grid-template-columns: 2fr 1fr;

  @media (max-width: ${breakpoints.xl}) {
    gap: 40px;
  }
  @media (max-width: ${breakpoints.lg}) {
    gap: 30px;
    grid-template-columns: 100%;
  }
`;

const BillingDetailsWrapper = styled.div`
  @media (max-width: ${breakpoints.lg}) {
    order: 2;
  }

  .checkout-form {
    margin-top: 24px;

    .input-elem {
      margin-bottom: 16px;

      @media (max-width: ${breakpoints.xs}) {
        margin-bottom: 10px;
      }

      label {
        margin-bottom: 8px;
        display: block;
      }

      input,
      select {
        height: 40px;
        border-radius: 4px;
        background: ${defaultTheme.color_whitesmoke};
        padding-left: 12px;
        padding-right: 12px;
        width: 100%;
        border: 1px solid ${defaultTheme.color_platinum};
        font-size: 12px;

        &::placeholder {
          font-size: 12px;
        }
      }
    }

    .elem-col-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 24px;

      @media (max-width: ${breakpoints.lg}) {
        column-gap: 12px;
      }
      @media (max-width: ${breakpoints.sm}) {
        grid-template-columns: 100%;
      }
    }

    .elem-col-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 24px;

      @media (max-width: ${breakpoints.lg}) {
        column-gap: 12px;
      }
      @media (max-width: ${breakpoints.sm}) {
        grid-template-columns: 100%;
      }
    }

    .input-check-group {
      column-gap: 10px;
      margin-top: 16px;
    }
    .contd-delivery-btn {
      margin-top: 20px;

      @media (max-width: ${breakpoints.sm}) {
        width: 100%;
      }
    }
  }
`;

const Billing = () => {
  const dispatch = useDispatch();

  const customer = useSelector((state) => state.user.customer);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo(customer.id);
        setName(data.data.full_name);
        setEmail(data.data.email);
        setPhoneNumber(data.data.phone_number);
        setAddress(data.data.address);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCart = async () => {
      try {
        const data = await getShoppingCart();
        setCart(data.data);
      } catch (error) {
        console.error("Error fetching shopping cart:", error);
      }
    };

    fetchCart();
    fetchUserInfo();
  }, [customer.id]);

  useEffect(() => {
    const fetchProductPrices = async () => {
      // Tính toán subtotal
      const total = cart.reduce((acc, product) => {
        const price = product.price; // Lấy giá của sản phẩm
        const quantity = product.quantity; // Lấy số lượng từ cart

        // Kiểm tra số lượng để tránh tính toán sai
        if (quantity > 0) {
          return acc + price * quantity; // Cộng vào tổng
        }
        return acc; // Nếu số lượng là 0, không cộng vào tổng
      }, 0);

      setSubtotal(total); // Cập nhật subtotal
    };

    if (cart?.length > 0) {
      fetchProductPrices(); // Chỉ gọi hàm nếu cart không rỗng
    }
  }, [cart]);

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!name || !phoneNumber || !address) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const items = cart?.map((item) => ({
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
      price: item.price,
    }));

    dispatch(
      addOrder({
        items,
        shipping_address: address,
        total_amount: subtotal,
      })
    );

    const data = await vnpayPayment(subtotal);
    window.location.href = data.data;
  };

  return (
    <BillingOrderWrapper className="billing-and-order grid items-start">
      <BillingDetailsWrapper>
        <h4 className="text-xxl font-bold text-outerspace">
          Chi tiết thanh toán
        </h4>
        <form className="checkout-form">
          <div className="input-elem-group elem-col-2">
            <div className="input-elem">
              <label
                htmlFor=""
                className="text-base text-outerspace font-semibold"
              >
                Họ và tên*
              </label>
              <Input
                type="text"
                placeholder="Họ và tên"
                value={name}
                onChange={(e) => {
                  updateProfile({
                    id: customer.id,
                    field: "full_name",
                    value: e.target.value,
                  });

                  setName(e.target.value);
                }}
              />
            </div>
            <div className="input-elem">
              <label
                htmlFor=""
                className="text-base text-outerspace font-semibold"
              >
                Email
              </label>
              <Input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  updateProfile({
                    id: customer.id,
                    field: "email",
                    value: e.target.value,
                  });

                  setEmail(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="input-elem-group elem-col-2">
            <div className="input-elem">
              <label
                htmlFor=""
                className="text-base text-outerspace font-semibold"
              >
                Số điện thoại*
              </label>
              <Input
                type="text"
                placeholder="Số điện thoại"
                value={phoneNumber}
                onChange={(e) => {
                  updateProfile({
                    id: customer.id,
                    field: "phone_number",
                    value: e.target.value,
                  });

                  setPhoneNumber(e.target.value);
                }}
              />
            </div>
            <div className="input-elem">
              <label
                htmlFor=""
                className="text-base text-outerspace font-semibold"
              >
                Địa chỉ nhận hàng*
              </label>
              <Input
                type="text"
                placeholder="Địa chỉ nhận hàng"
                value={address}
                onChange={(e) => {
                  updateProfile({
                    id: customer.id,
                    field: "address",
                    value: e.target.value,
                  });

                  setAddress(e.target.value);
                }}
              />
            </div>
          </div>
          <BaseButtonGreen
            type="submit"
            className="contd-delivery-btn"
            onClick={handleCheckout}
          >
            Thanh toán
          </BaseButtonGreen>
        </form>
      </BillingDetailsWrapper>
      <CheckoutSummary cartItems={cart} subtotal={subtotal} />
    </BillingOrderWrapper>
  );
};

export default Billing;
