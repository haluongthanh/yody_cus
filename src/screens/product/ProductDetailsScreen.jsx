import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import ProductPreview from "../../components/product/ProductPreview";
import { useParams } from "react-router-dom";
import { BaseLinkGreen } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import ProductDescriptionTab from "../../components/product/ProductDescriptionTab";
import ProductServices from "../../components/product/ProductServices";
import {
  getProductById,
  getSize,
  getColor,
  getCategories,
} from "../../services/apiService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import { useSelector } from "react-redux";

const DetailsScreenWrapper = styled.main`
  margin: 40px 0;
`;

const DetailsContent = styled.div`
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;

  @media (max-width: ${breakpoints.xl}) {
    gap: 24px;
    grid-template-columns: 3fr 2fr;
  }

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 100%;
  }
`;

const ProductDetailsWrapper = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 24px;

  @media (max-width: ${breakpoints.sm}) {
    padding: 16px;
  }

  @media (max-width: ${breakpoints.xs}) {
    padding: 12px;
  }

  .prod-title {
    margin-bottom: 10px;
  }
  .rating-and-comments {
    column-gap: 16px;
    margin-bottom: 20px;
  }
  .prod-cate {
    column-gap: 10px;
  }

  .prod-cate span {
    background-color: ${defaultTheme.color_whitesmoke};
    padding: 4px 8px;
    border-radius: 4px;
  }

  .prod-comments {
    column-gap: 10px;
  }
  .prod-add-btn {
    min-width: 160px;
    column-gap: 8px;
    &-text {
      margin-top: 2px;
    }
  }

  .btn-and-price {
    margin-top: 36px;
    column-gap: 16px;
    row-gap: 10px;

    @media (max-width: ${breakpoints.sm}) {
      margin-top: 24px;
    }
  }
`;

const ProductSizeWrapper = styled.div`
  .prod-size-top {
    gap: 20px;
  }
  .prod-size-list {
    gap: 12px;
    margin-top: 16px;
    @media (max-width: ${breakpoints.sm}) {
      gap: 8px;
    }
  }

  .prod-size-item {
    position: relative;
    height: 38px;
    width: 38px;
    cursor: pointer;

    @media (max-width: ${breakpoints.sm}) {
      width: 32px;
      height: 32px;
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 38px;
      height: 38px;
      opacity: 0;
      cursor: pointer;

      @media (max-width: ${breakpoints.sm}) {
        width: 32px;
        height: 32px;
      }

      &:checked + span {
        color: ${defaultTheme.color_white};
        background-color: ${defaultTheme.color_outerspace};
        border-color: ${defaultTheme.color_outerspace};
      }
    }

    span {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      border: 1.5px solid ${defaultTheme.color_silver};
      text-transform: uppercase;

      @media (max-width: ${breakpoints.sm}) {
        width: 32px;
        height: 32px;
      }
    }
  }

  .prod-size-chip_disabled_box {
    position: absolute;
    top: 0;
    left: 0;
    width: 38px;
    height: 38px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: ${breakpoints.sm}) {
      width: 32px;
      height: 32px;
    }

    /* Create diagonal lines for the 'X' */
    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 1px; /* Adjust thickness of the lines */
      background-color: rgba(0, 0, 0, 0.5); /* Color of the cross */
    }

    &::after {
      transform: rotate(-45deg); /* Second line rotated */
    }
  }
`;

const ProductColorWrapper = styled.div`
  margin-top: 32px;

  @media (max-width: ${breakpoints.sm}) {
    margin-top: 24px;
  }

  .prod-colors-top {
    margin-bottom: 16px;
  }

  .prod-colors-list {
    column-gap: 12px;
  }

  .prod-colors-item {
    position: relative;
    width: 22px;
    height: 22px;
    transition: ${defaultTheme.default_transition};

    &:hover {
      scale: 0.9;
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 22px;
      height: 22px;
      opacity: 0;
      cursor: pointer;

      &:checked + span {
        outline: 1px solid ${defaultTheme.color_gray};
        outline-offset: 3px;
      }
    }

    .prod-colorbox {
      border-radius: 100%;
      width: 22px;
      height: 22px;
      display: inline-block;
    }
  }
`;

const ProductDetailsScreen = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const { id } = useParams();
  const { addToCart } = useCart();

  const [catagories, setCatagories] = useState([]);
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableSizesForSelectedColor, setAvailableSizesForSelectedColor] =
    useState([]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data.data.Product);
        setImages(data.data.Images);
        setVariants(data.data.Variants);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    const fetchSize = async () => {
      try {
        const data = await getSize();
        setSizes(data.data);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    const fetchColor = async () => {
      try {
        const data = await getColor();
        setColors(data.data);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCatagories(data.data);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    fetchProduct();
    fetchSize();
    fetchColor();
    fetchCategories();
  }, [id]);

  useEffect(() => {
    if (variants.length > 0) {
      variants.sort((a, b) => a.color_id - b.color_id);

      setSelectedColor(variants[0].color_id);
    }
  }, [variants]);

  const availableColorIds = Array.from(
    new Set(variants?.map((variant) => variant.color_id))
  );

  const availableColors = colors.filter((color) =>
    availableColorIds.includes(color.id)
  );

  useEffect(() => {
    const availableSizeIdsForSelectedColor = selectedColor
      ? variants
          .filter((variant) => variant.color_id === selectedColor)
          .map((variant) => variant.size_id)
      : [];

    const updatedAvailableSizes = sizes?.map((size) => ({
      ...size,
      disabled: !availableSizeIdsForSelectedColor.includes(size.id),
    }));

    setAvailableSizesForSelectedColor(updatedAvailableSizes);

    if (
      selectedSize &&
      (updatedAvailableSizes.find((size) => size.id === selectedSize)
        ?.disabled ||
        !availableSizeIdsForSelectedColor.includes(selectedSize))
    ) {
      setSelectedSize(null);
    }
  }, [selectedColor, sizes, variants, selectedSize]);

  const filteredImages = selectedColor
    ? images.filter((image) => image.color_id === selectedColor)
    : images;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      window.location.href = "/sign_in";
      return;
    }

    if (selectedColor === null || selectedSize === null) {
      toast.error("Vui lòng chọn màu và kích thước!");
      return;
    }

    const selectedVariant = variants.find(
      (v) => v.color_id === selectedColor && v.size_id === selectedSize
    );

    try {
      const result = await addToCart(selectedVariant.id);
      if (result) {
        toast.success("Thêm vào giỏ hàng thành công!");
      } else {
        toast.error("Thêm vào giỏ hàng thất bại!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Sản phẩm", link: "/product" },
    { label: "Chi tiết", link: "" },
  ];

  return (
    <DetailsScreenWrapper>
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <DetailsContent className="grid">
          <ProductPreview previewImages={filteredImages} />
          <ProductDetailsWrapper>
            <h2 className="prod-title">{product.name}</h2>
            <div className="flex items-center rating-and-comments flex-wrap">
              <div className="prod-cate flex items-center text-gray text-xs">
                {catagories?.map((catagory) => (
                  <span key={catagory.Id}>{catagory.Name}</span>
                ))}
              </div>
              <div className="prod-comments flex items-start">
                <span className="prod-comment-text text-sm text-gray">
                  Còn hàng: {variants.reduce((sum, v) => sum + v.stock, 0)} sản
                  phẩm
                </span>
              </div>
            </div>

            <ProductSizeWrapper>
              <div className="prod-size-top flex items-center flex-wrap">
                <p className="text-lg font-semibold text-outerspace">
                  Chọn kích thước:{" "}
                  {sizes.filter((s) => s.id === selectedSize)[0]?.name}
                </p>
              </div>
              <div className="prod-size-list flex items-center">
                {availableSizesForSelectedColor?.map((size, index) => (
                  <div
                    className="prod-size-item"
                    key={index}
                    style={{
                      cursor: size.disabled ? "not-allowed" : "pointer",
                      opacity: size.disabled ? 0.5 : 1,
                    }}
                  >
                    <div
                      style={{
                        pointerEvents: size.disabled ? "none" : "auto",
                      }}
                    >
                      <input
                        type="radio"
                        name="size"
                        onChange={() => setSelectedSize(size.id)}
                        checked={selectedSize === size.id}
                      />
                      <span className="flex items-center justify-center font-medium text-outerspace text-sm">
                        {size.name}
                      </span>
                      {size.disabled && (
                        <div className="prod-size-chip_disabled_box"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ProductSizeWrapper>
            <ProductColorWrapper>
              <div className="prod-colors-top flex items-center flex-wrap">
                <p className="text-lg font-semibold text-outerspace">
                  Màu sắc:{" "}
                  {colors.filter((c) => c.id === selectedColor)[0]?.name}
                </p>
              </div>
              <div className="prod-colors-list flex items-center">
                {availableColors?.map((color, index) => (
                  <div className="prod-colors-item" key={index}>
                    <input
                      type="radio"
                      name="colors"
                      onChange={() => {
                        setSelectedColor(color.id);
                      }}
                      checked={selectedColor === color.id}
                    />
                    <span
                      className="prod-colorbox"
                      style={{ background: `${color.hex_code}` }}
                    ></span>
                  </div>
                ))}
              </div>
            </ProductColorWrapper>
            <div className="btn-and-price flex items-center flex-wrap">
              <BaseLinkGreen
                as={BaseLinkGreen}
                className="prod-add-btn"
                onClick={handleAddToCart}
              >
                <span className="prod-add-btn-icon">
                  <i className="bi bi-cart2"></i>
                </span>
                <span className="prod-add-btn-text">Thêm vào giỏ</span>
              </BaseLinkGreen>
              <span className="prod-price text-xl font-bold text-outerspace">
                {product && product.price !== undefined
                  ? product.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                  : "Giá chưa có"}
              </span>
            </div>
            <ProductServices />
          </ProductDetailsWrapper>
        </DetailsContent>
        <ProductDescriptionTab description={product.description} />
      </Container>
    </DetailsScreenWrapper>
  );
};

export default ProductDetailsScreen;
