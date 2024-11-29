/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  FilterTitle,
  FilterWrap,
  PriceFilter,
  ProductCategoryFilter,
} from "../../styles/filter";
import { getCategories, filterProduct } from "../../services/apiService";
import styled from "styled-components";

const FilterButton = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 8px;
  background: #10b9b0;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #0e9d95;
  }
`;

const ProductFilter = ({ setProductsFiltered, setIsLoading }) => {
  const params = new URLSearchParams(window.location.search);
  const slugProduct = params.get("search");

  const removeVietnameseTones = (str) => {
    return str
      ?.normalize("NFD") // Phân tích chuỗi thành các ký tự Unicode cơ bản
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
      .replace(/đ/g, "d") // Thay thế 'đ' thành 'd'
      .replace(/Đ/g, "D"); // Thay thế 'Đ' thành 'D'
  };

  const slugProductWithoutAccent = removeVietnameseTones(slugProduct);

  const [isProductFilterOpen, setProductFilterOpen] = useState(true);
  const [isPriceFilterOpen, setPriceFilterOpen] = useState(true);

  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleFilter = (filter) => {
    switch (filter) {
      case "product":
        setProductFilterOpen(!isProductFilterOpen);
        break;
      case "price":
        setPriceFilterOpen(!isPriceFilterOpen);
        break;
      default:
        break;
    }
  };

  const [minRange, setMinRange] = useState(null);
  const [maxRange, setMaxRange] = useState(null);

  const [tempMin, setTempMin] = useState("");
  const [tempMax, setTempMax] = useState("");
  const [isPriceValid, setIsPriceValid] = useState(true); // State to track if the price range is valid
  const [priceError, setPriceError] = useState(""); // To hold error message for invalid price input

  const validatePriceInput = (value, isMin = true) => {
    if (value === "") return null; // Allow empty string for reset
    const parsedValue = parseInt(value.replace(/,/g, "")); // Remove commas if any
    if (isNaN(parsedValue) || parsedValue < 0) {
      setPriceError(isMin ? "Giá không hợp lệ" : "Giá không hợp lệ");
      return isMin ? 0 : minRange; // Invalid price, reset value
    }

    if (isMin && parsedValue > maxRange && maxRange !== null) {
      setPriceError("Giá thấp nhất không thể lớn hơn giá cao nhất");
      return maxRange; // Min can't be greater than max
    }

    if (!isMin && parsedValue < minRange && minRange !== null) {
      setPriceError("Giá cao nhất không thể nhỏ hơn giá thấp nhất");
      return minRange; // Max can't be less than min
    }

    setPriceError(""); // Clear error if value is valid
    return parsedValue;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Temporary local variables to store min/max values
    let updatedMin = name === "min" ? value : tempMin;
    let updatedMax = name === "max" ? value : tempMax;

    // Update temporary values
    if (name === "min") {
      setTempMin(value);
    } else if (name === "max") {
      setTempMax(value);
    }

    // Check if min is greater than max to disable the filter button
    if (
      updatedMin &&
      updatedMax &&
      parseInt(updatedMin) > parseInt(updatedMax)
    ) {
      setIsPriceValid(false); // Disable button
      setPriceError("Giá thấp nhất không thể lớn hơn giá cao nhất");
    } else {
      setIsPriceValid(true); // Enable button
      setPriceError(""); // Clear error
    }
  };

  const handlePriceFilter = () => {
    const validatedMin = validatePriceInput(tempMin, true);
    const validatedMax = validatePriceInput(tempMax, false);

    // Update minRange and maxRange if valid values
    if (validatedMin !== null && validatedMax !== null) {
      setMinRange(validatedMin);
      setMaxRange(validatedMax);

      // Fetch filtered products
      fetchFilteredProducts(validatedMin, validatedMax);
    } else {
      console.warn("Invalid price range selected.");
    }
  };

  const fetchFilteredProducts = async (min, max) => {
    try {
      const page = 1;
      const pageSize = 12;

      const data = await filterProduct(
        page,
        pageSize,
        selectedCategory ? selectedCategory : "",
        slugProductWithoutAccent ? slugProductWithoutAccent : "",
        min,
        max
      );

      setProductsFiltered(data.data);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts("", "");
  }, [slugProduct, selectedCategory]);

  useEffect(() => {
    if (minRange !== null && maxRange !== null) {
      fetchFilteredProducts(minRange, maxRange);
    }
  }, [slugProduct, selectedCategory, minRange, maxRange]);

  return (
    <>
      <ProductCategoryFilter>
        <FilterTitle
          className="filter-title flex items-center justify-between"
          onClick={() => toggleFilter("product")}
        >
          <p className="filter-title-text text-gray text-base font-semibold text-lg">
            Lọc
          </p>
          <span
            className={`text-gray text-xxl filter-title-icon ${
              !isProductFilterOpen ? "rotate" : ""
            }`}
          >
            <i className="bi bi-filter"></i>
          </span>
        </FilterTitle>
        <FilterWrap className={`${!isProductFilterOpen ? "hide" : "show"}`}>
          {categories?.map((category) => (
            <div key={category.Id} className="product-filter-item">
              <button
                type="button"
                className={`filter-item-head w-full flex items-center justify-between ${
                  selectedCategory === category.Id ? "selected" : ""
                }`}
                onClick={() => setSelectedCategory(category.Id)}
              >
                <span className="filter-head-title">{category.Name}</span>
              </button>
            </div>
          ))}
        </FilterWrap>
      </ProductCategoryFilter>

      <PriceFilter>
        <FilterTitle
          className="filter-title flex items-center justify-between"
          onClick={() => toggleFilter("price")}
        >
          <p className="filter-title-text text-gray text-base font-semibold text-lg">
            Giá
          </p>
          <span
            className={`text-gray text-xl filter-title-icon ${
              !isPriceFilterOpen ? "rotate" : ""
            }`}
          >
            <i className="bi bi-chevron-up"></i>
          </span>
        </FilterTitle>
        <FilterWrap
          className={`range filter-wrap ${
            !isPriceFilterOpen ? "hide" : "show"
          }`}
        >
          <p>
            Chọn khoảng giá {"("}thấp nhất - cao nhất{")"}
          </p>
          <div className="range-price w-full flex items-center">
            <input
              type="text"
              className="text-center"
              name="min"
              value={tempMin || ""}
              onChange={handleInputChange}
              placeholder="Giá thấp nhất"
            />
            <span>-</span>
            <input
              type="text"
              className="text-center"
              name="max"
              value={tempMax || ""}
              onChange={handleInputChange}
              placeholder="Giá cao nhất"
            />
          </div>
          {priceError && (
            <p className="text-sm" style={{ color: "red" }}>
              {priceError}
            </p>
          )}
          <FilterButton
            onClick={handlePriceFilter}
            disabled={!isPriceValid}
            style={{ cursor: !isPriceValid ? "not-allowed" : "pointer" }} // Sửa style conditionally
          >
            {" "}
            Lọc giá
          </FilterButton>
        </FilterWrap>
      </PriceFilter>
    </>
  );
};

export default ProductFilter;
