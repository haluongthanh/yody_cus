import { PageWrapper } from "../../styles/styles";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { CartProvider } from "../../context/CartContext";
import { useEffect } from "react";

const BaseLayout = () => {
  const location = useLocation();

  useEffect(() => {
    // Xác định các đường dẫn thuộc AuthLayout (những trang không muốn lưu)
    const authPaths = [
      "/account",
      "/sign_in",
      "/sign_up",
      "/reset",
      "/change_password",
      "/check_mail",
      "/verification",
    ];

    // Kiểm tra xem đường dẫn hiện tại có thuộc AuthLayout không
    const isAuthPath = authPaths.some((path) =>
      location.pathname.startsWith(path)
    );

    // Nếu không phải là AuthLayout, lưu đường dẫn vào localStorage
    if (!isAuthPath) {
      localStorage.setItem("currentUrl", location.pathname);
    }
  }, [location]);

  return (
    <CartProvider>
      <PageWrapper>
        <Header />
        <div
          style={{
            minHeight: "calc(100vh - 545px)",
          }}
        >
          <Outlet />
        </div>
        <Footer />
      </PageWrapper>
    </CartProvider>
  );
};

export default BaseLayout;
