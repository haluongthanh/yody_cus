import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import CartTable from "../../components/cart/CartTable";
import { breakpoints } from "../../styles/themes/default";
import CartSummary from "../../components/cart/CartSummary";
import {
  getShoppingCart,
  getVariant,
  getProductById,
} from "../../services/apiService";
import { useEffect, useState } from "react";

const CartPageWrapper = styled.main`
  padding: 48px 0;

  .breadcrumb-nav {
    margin-bottom: 20px;
  }
`;

const CartContent = styled.div`
  margin-top: 40px;
  grid-template-columns: 2fr 1fr;
  gap: 40px;

  @media (max-width: ${breakpoints.xl}) {
    grid-template-columns: 100%;
  }

  @media (max-width: ${breakpoints.sm}) {
    margin-top: 24px;
  }

  .cart-list {
    @media (max-width: ${breakpoints.lg}) {
      overflow-x: scroll;
    }
  }

  .cart-content-right {
    gap: 24px;

    @media (max-width: ${breakpoints.xl}) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: ${breakpoints.md}) {
      grid-template-columns: 100%;
    }
  }
`;

const CartScreen = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getShoppingCart();
        setCart(data.data);
      } catch (error) {
        console.error("Error fetching shopping cart:", error);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const fetchProductPrices = async () => {
      const variantPromises = cart?.map((item) =>
        getVariant(item.product_variant_id)
      ); // Lấy dữ liệu variant
      const variants = await Promise.all(variantPromises); // Đợi tất cả promise hoàn thành

      const productPromises = variants.map((variant) =>
        getProductById(variant.data.product_id)
      ); // Lấy chi tiết sản phẩm
      const products = await Promise.all(productPromises); // Đợi chi tiết sản phẩm

      // Tính toán subtotal
      const total = products.reduce((acc, product, index) => {
        const price = product.data.Product.price; // Lấy giá của sản phẩm
        const quantity = cart[index].quantity; // Lấy số lượng từ cart
        return acc + price * quantity; // Cộng vào tổng
      }, 0);

      setSubtotal(total); // Cập nhật subtotal
    };

    fetchProductPrices(); // Chỉ gọi hàm nếu cart không rỗng
  }, [cart]);

  const handleQuantityChange = (id, newQuantity) => {
    const updatedCart = cart?.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  const handleItemDelete = async (id) => {
    try {
      setCart(cart.filter((item) => item.id !== id)); // Cập nhật giỏ hàng
    } catch (error) {
      console.error("Error deleting product from cart:", error);
    }
  };

  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Giỏ hàng", link: "/cart" },
  ];

  return (
    <CartPageWrapper>
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <CartContent className="grid items-start">
          <div className="cart-content-left">
            <CartTable
              cartItems={cart}
              onQuantityChange={handleQuantityChange}
              onItemDelete={handleItemDelete}
            />
          </div>
          <div className="grid cart-content-right">
            <CartSummary subtotal={subtotal} shippingCost={0} />
          </div>
        </CartContent>
      </Container>
    </CartPageWrapper>
  );
};

export default CartScreen;
