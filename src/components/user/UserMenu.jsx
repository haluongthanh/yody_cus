import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Title from "../common/Title";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/userSlice";

const NavMenuWrapper = styled.nav`
  margin-top: 32px;

  .nav-menu-list {
    row-gap: 8px;

    @media (max-width: ${breakpoints.md}) {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
  }

  .nav-menu-item {
    border-radius: 4px;

    @media (max-width: ${breakpoints.sm}) {
      flex: 1 1 0;
    }
  }

  .nav-menu-link {
    padding-left: 36px;
    width: 100%;
    height: 40px;
    column-gap: 12px;
    border: 1px solid transparent;

    &:hover {
      background-color: ${defaultTheme.color_whitesmoke};
    }

    .nav-link-text {
      color: ${defaultTheme.color_gray};
    }

    &.active {
      border-left: 2px solid ${defaultTheme.color_gray};
      background-color: ${defaultTheme.color_whitesmoke};

      @media (max-width: ${breakpoints.md}) {
        border-bottom: 2px solid ${defaultTheme.color_gray};
        border-left: 0;
        background-color: transparent;
      }
    }

    @media (max-width: ${breakpoints.md}) {
      padding-left: 16px;
      padding-right: 16px;
    }

    @media (max-width: ${breakpoints.sm}) {
      padding-left: 8px;
      padding-right: 8px;
      column-gap: 8px;
    }
  }
`;

const UserMenu = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout()); // Gọi action logout
    navigate("/sign_in");
  };

  return (
    <div>
      <Title titleText={`Xin chào`} />
      <p className="text-base font-light italic">
        Chào mừng bạn đến với cửa hàng của chúng tôi
      </p>

      <NavMenuWrapper>
        <ul className="nav-menu-list grid">
          <li className="nav-menu-item">
            <Link
              to="/order"
              className={`nav-menu-link flex items-center ${
                location.pathname === "/order" ||
                location.pathname === "/order_detail"
                  ? "active"
                  : ""
              }`}
            >
              <span className="nav-link-icon flex items-center justify-center">
                <img src="./assets/icons/ac_orders.svg" alt="" />
              </span>
              <span className="text-base font-semibold nav-link-text no-wrap">
                Đơn hàng
              </span>
            </Link>
          </li>
          {/* <li className="nav-menu-item">
            <Link
              to="/wishlist"
              className={`nav-menu-link flex items-center ${
                location.pathname === "/wishlist" ||
                location.pathname === "/empty_wishlist"
                  ? "active"
                  : ""
              }`}
            >
              <span className="nav-link-icon flex items-center justify-center">
                <img src="./assets/icons/ac_heart.svg" alt="" />
              </span>
              <span className="text-base font-semibold nav-link-text no-wrap">
                Danh sách yêu thích
              </span>
            </Link>
          </li> */}
          <li className="nav-menu-item">
            <Link
              to="/account"
              className={`nav-menu-link flex items-center ${
                location.pathname === "/account" ||
                location.pathname === "/account/add"
                  ? "active"
                  : ""
              }`}
            >
              <span className="nav-link-icon flex items-center justify-center">
                <img src="./assets/icons/ac_user.svg" alt="" />
              </span>
              <span className="text-base font-semibold nav-link-text no-wrap">
                Tài khoản của tôi
              </span>
            </Link>
          </li>
          <li className="nav-menu-item">
            <button
              className={`nav-menu-link flex items-center`}
              onClick={handleLogout}
            >
              <span className="nav-link-icon flex items-center justify-center">
                <img src="./assets/icons/ac_sign_out.svg" alt="" />
              </span>
              <span className="text-base font-semibold nav-link-text no-wrap">
                Đăng xuất
              </span>
            </button>
          </li>
        </ul>
      </NavMenuWrapper>
    </div>
  );
};

export default UserMenu;
