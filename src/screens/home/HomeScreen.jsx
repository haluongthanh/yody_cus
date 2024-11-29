import styled from "styled-components";
import Hero from "../../components/home/Hero";
import Catalog from "../../components/home/Catalog";
import { getProductsByCategoryId } from "../../services/apiService";
import { useEffect, useState } from "react";

const HomeScreenWrapper = styled.main``;

const HomeScreen = () => {
  const [menCatalog, setMenCatalog] = useState([]);
  const [womenCatalog, setWomenCatalog] = useState([]);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [dataMenCatalog, dataWomenCatalog] = await Promise.all([
          getProductsByCategoryId(3),
          getProductsByCategoryId(4),
        ]);

        setMenCatalog(dataMenCatalog.data);
        setWomenCatalog(dataWomenCatalog.data);
      } catch (error) {
        console.error("Lỗi: ", error);
      }
    };

    fetchCatalogs();
  }, []);

  return (
    <HomeScreenWrapper>
      <Hero />
      <Catalog catalogTitle={"Quần áo nam"} products={menCatalog} />
      <Catalog catalogTitle={"Quần áo nữ"} products={womenCatalog} />
    </HomeScreenWrapper>
  );
};

export default HomeScreen;
