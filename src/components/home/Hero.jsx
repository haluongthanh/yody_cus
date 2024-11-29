import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { bannerData } from "../../data/data";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import CustomNextArrow from "../common/CustomNextArrow";
import CustomPrevArrow from "../common/CustomPrevArrow";

const SectionHeroWrapper = styled.section`
  background-color: #f2f2f2;
`;

const HeroSliderWrapper = styled.div`
  .custom-prev-arrow {
    left: 30px !important;
    background-color: ${defaultTheme.color_white};
    svg {
      color: ${defaultTheme.color_outerspace};
    }

    @media (max-width: ${breakpoints.md}) {
      left: 16px !important;
    }
  }

  .custom-next-arrow {
    right: 30px !important;
    background-color: ${defaultTheme.color_white};
    svg {
      color: ${defaultTheme.color_outerspace};
    }

    @media (max-width: ${breakpoints.md}) {
      right: 16px !important;
    }
  }
`;

const HeroSliderItemWrapper = styled.div`
  position: relative;
  height: 600px;
  overflow: hidden;

  img {
    display: block;
  }
`;

const Hero = () => {
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <SectionHeroWrapper>
      <HeroSliderWrapper>
        <Slider
          nextArrow={<CustomNextArrow />}
          prevArrow={<CustomPrevArrow />}
          {...settings}
        >
          {bannerData?.map((banner) => {
            return (
              <HeroSliderItemWrapper key={banner.id}>
                <img src={banner.imgSource} style={{ objectFit: "contain" }} />
              </HeroSliderItemWrapper>
            );
          })}
        </Slider>
      </HeroSliderWrapper>
    </SectionHeroWrapper>
  );
};

export default Hero;
