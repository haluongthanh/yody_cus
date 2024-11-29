import styled from "styled-components";
import { HeaderMainWrapper, SiteBrandWrapper } from "../../styles/header";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input, InputGroupWrapper } from "../../styles/form";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { BaseLinkGreen, BaseLinkOutlineDark } from "../../styles/button";
import { useSelector } from "react-redux";
import {
  searchProduct,
  getImgUrlBySlug,
  getUserInfo,
} from "../../services/apiService";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";

const NavigationAndSearchWrapper = styled.div`
  column-gap: 20px;

  .search-form {
    position: relative;

    @media (max-width: ${breakpoints.lg}) {
      width: 100%;
      max-width: 500px;
    }
    @media (max-width: ${breakpoints.sm}) {
      display: none;
    }

    .suggestions-dropdown {
      position: absolute;
      top: 120%;
      left: 0;
      width: 100%;
      background-color: ${defaultTheme.color_white};
      border: 1px solid ${defaultTheme.color_platinum};
      z-index: 999;
      max-height: 300px;
      overflow-y: auto;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .suggestions-list {
      margin: 0;
      list-style-type: none;
    }

    .suggestion-item {
      padding: 10px 15px;
      transition: background-color 0.3s ease;
      cursor: pointer;

      &:hover {
        background-color: #f9f9f9;
      }
    }

    .suggestion-link {
      color: #333;
      text-decoration: none;
      display: block;
      font-weight: 500;
      display: flex;
      align-items: center;
      column-gap: 10px;

      &:hover {
        color: #333;
      }
    }
  }

  .input-group {
    min-width: 320px;
    border: 1px solid transparent;
    border-radius: 4px;
    transition: all 0.2s ease;

    .input-control {
      @media (max-width: ${breakpoints.sm}) {
        display: none;
      }

      &:focus {
        outline: none;
      }
    }

    // Style for entire group when input is focused
    &:focus-within {
      border-color: #10b9b0;
      box-shadow: 0 0 0 2px rgba(16, 185, 176, 0.1);
    }

    @media (max-width: ${breakpoints.xl}) {
      min-width: 160px;
    }

    @media (max-width: ${breakpoints.sm}) {
      min-width: auto;
      grid-template-columns: 100%;
    }
  }

  @media (max-width: ${breakpoints.lg}) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const NavigationMenuWrapper = styled.nav`
  .nav-menu-list {
    margin-left: 20px;

    @media (max-width: ${breakpoints.lg}) {
      flex-direction: column;
    }
  }

  .nav-menu-item {
    margin-right: 20px;
    margin-left: 20px;

    @media (max-width: ${breakpoints.xl}) {
      margin-left: 16px;
      margin-right: 16px;
    }
  }

  .nav-menu-link {
    &.active {
      color: ${defaultTheme.color_outerspace};
      font-weight: 700;
    }

    &:hover {
      color: ${defaultTheme.color_outerspace};
    }
  }

  @media (max-width: ${breakpoints.lg}) {
    position: absolute;
    top: 0;
    right: 0;
    width: 260px;
    background: ${defaultTheme.color_white};
    height: 100%;
    z-index: 999;
    display: none;
  }
`;

const IconLinksWrapper = styled.div`
  column-gap: 18px;

  .icon-link {
    width: 36px;
    height: 36px;
    border-radius: 6px;

    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      object-fit: cover;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }

    &.active {
      background-color: #10b9b0;
      .cart-icon {
        filter: brightness(100);
      }
    }

    &:hover {
      background-color: #10b9b0;
      .cart-icon {
        filter: brightness(100);
      }
    }
  }

  @media (max-width: ${breakpoints.xl}) {
    column-gap: 8px;
  }

  @media (max-width: ${breakpoints.xl}) {
    column-gap: 6px;
  }

  .icon-cart {
    position: relative;

    .cart-badge {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 20px;
      height: 20px;
      color: #fff;
      background: #ff0000;
      border-radius: 100%;
      text-align: center;
    }
  }
`;

const ButtonGroupWrapper = styled.div`
  gap: 8px;
  @media (max-width: ${breakpoints.sm}) {
    button,
    a {
      min-width: 100px;
    }
  }
`;

const Header = () => {
  const { cartCount } = useCart();

  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const customer = useSelector((state) => state.user.customer);

  const location = useLocation();

  const [suggestions, setSuggestions] = useState([]);
  const [images, setImages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [avatar, setAvatar] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo(customer.id);
        if (data.data.avatar) {
          setAvatar(data.data.avatar);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra xem người dùng có nhấp ra ngoài dropdown không
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false); // Ẩn dropdown khi nhấp ra ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setDropdownVisible(false); // Ẩn dropdown khi chuyển trang
  }, [location.pathname]);

  // Sử dụng useEffect để gọi API khi từ khóa tìm kiếm thay đổi
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // convert searchTerm eg: "  abc  " => "abc" and "ao khoac" => "ao-khoac"
      const formattedTerm = searchTerm.trim().replace(/\s+/g, "-");
      handleSearch(formattedTerm);
    }, 300); // Gọi API sau 300ms khi người dùng ngừng gõ

    return () => clearTimeout(timeoutId); // Dọn dẹp khi component unmount hoặc từ khóa thay đổi
  }, [searchTerm]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const imagePromises = suggestions?.map(
          (product) => getImgUrlBySlug(product.slug) // Gọi API với slug của từng sản phẩm
        );

        const results = await Promise.all(imagePromises);

        // Lưu kết quả vào state theo slug
        const imagesObj = {};
        results.forEach((result, index) => {
          if (result.data) {
            imagesObj[suggestions[index].slug] = result.data;
          }
        });

        setImages(imagesObj);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    if (suggestions?.length > 0) {
      fetchImageUrls();
    }
  }, [suggestions]);

  useEffect(() => {
    // Lưu giá trị tìm kiếm vào localStorage mỗi khi searchTerm thay đổi
    if (searchTerm) {
      localStorage.setItem("searchTerm", searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    const savedSearchTerm = localStorage.getItem("searchTerm");
    if (savedSearchTerm) {
      setSearchTerm(savedSearchTerm);
    }
  }, []);

  // Xóa searchTerm khỏi localStorage nếu không có giá trị
  useEffect(() => {
    if (!searchTerm) {
      localStorage.removeItem("searchTerm");
    }
  }, [searchTerm]);

  const handleFocus = () => {
    setDropdownVisible(true); // Hiện dropdown khi input được focus
  };

  const handleSearch = async (term) => {
    if (term) {
      try {
        const data = await searchProduct(term);
        setSuggestions(data.data); // Giả sử API trả về danh sách sản phẩm tại response.data.products
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSuggestions([]); // Reset gợi ý khi không có từ khóa
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      setDropdownVisible(true); // Hiện dropdown khi có dữ liệu
    } else {
      setDropdownVisible(false); // Ẩn dropdown nếu không có dữ liệu
    }
  };

  return (
    <HeaderMainWrapper className="header flex items-center">
      <Container className="container">
        <div className="header-wrap flex items-center justify-between">
          <div className="flex items-center">
            <SiteBrandWrapper to="/" className="inline-flex">
              <div className="brand-img-wrap flex items-center justify-center">
                <img
                  className="site-brand-img"
                  src={staticImages.logo}
                  alt="site logo"
                />
              </div>
            </SiteBrandWrapper>
          </div>
          <NavigationAndSearchWrapper className="flex items-center">
            <NavigationMenuWrapper>
              <ul className="nav-menu-list flex items-center">
                <li className="nav-menu-item">
                  <Link
                    to={"/"}
                    className="nav-menu-link text-base font-medium text-gray"
                  >
                    Trang chủ
                  </Link>
                </li>

                <li className="nav-menu-item">
                  <Link
                    to={"/product"}
                    className="nav-menu-link text-base font-medium text-gray"
                  >
                    Sản phẩm
                  </Link>
                </li>
              </ul>
            </NavigationMenuWrapper>
            <form className="search-form">
              <InputGroupWrapper className="input-group">
                <span className="input-icon flex items-center justify-center text-xl text-gray">
                  <i className="bi bi-search"></i>
                </span>
                <Input
                  type="text"
                  className="input-control w-full"
                  placeholder="Tìm kiếm"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setDropdownVisible(false);
                      const slugSearch = searchTerm.trim().replace(/\s+/g, "-");
                      navigate(`/product?search=${slugSearch}`);
                      window.location.reload();
                    }
                  }}
                />
              </InputGroupWrapper>

              {dropdownVisible && suggestions?.length > 0 && (
                <div ref={dropdownRef} className="suggestions-dropdown">
                  <ul className="suggestions-list">
                    {suggestions?.map((product) => (
                      <li key={product.id} className="suggestion-item">
                        <Link
                          to={`/product/details/${product.id}`}
                          className="suggestion-link"
                        >
                          <div className="product-images">
                            {images[product.slug] &&
                            images[product.slug].length > 0 ? (
                              <img
                                src={`https://api.yody.lokid.xyz${
                                  images[product.slug][0].image_link
                                }`}
                                alt={`Image for ${product.name}`}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                }} // Cài đặt kích thước và khoảng cách giữa các ảnh
                              />
                            ) : (
                              <span>No image available</span> // Hiển thị thông báo nếu không có ảnh
                            )}
                          </div>
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </NavigationAndSearchWrapper>

          <IconLinksWrapper className="flex items-center">
            {isLoggedIn ? (
              <>
                {/* <Link
                  to="/wishlist"
                  className={`icon-link ${
                    location.pathname === "/wishlist" ? "active" : ""
                  } inline-flex items-center justify-center`}
                >
                  <img src={staticImages.heart} alt="" />
                </Link> */}

                <Link
                  to="/account"
                  className={`icon-link ${
                    location.pathname === "/account" ||
                    location.pathname === "/account/add"
                      ? "active"
                      : ""
                  } inline-flex items-center justify-center`}
                >
                  <img
                    className="avatar"
                    src={`https://api.yody.lokid.xyz${avatar}`}
                    alt=""
                  />
                </Link>

                <Link
                  to="/cart"
                  className={`icon-link icon-cart ${
                    location.pathname === "/cart" ? "active" : ""
                  } inline-flex items-center justify-center`}
                >
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                  <img className="cart-icon" src={staticImages.cart} alt="" />
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <ButtonGroupWrapper className="flex items-center">
                    <BaseLinkGreen to="/sign_in">Đăng nhập</BaseLinkGreen>
                    <BaseLinkOutlineDark to="/sign_up">
                      Đăng ký
                    </BaseLinkOutlineDark>
                  </ButtonGroupWrapper>
                </div>
              </>
            )}
          </IconLinksWrapper>
        </div>
      </Container>
    </HeaderMainWrapper>
  );
};

export default Header;
