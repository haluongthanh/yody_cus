import styled from "styled-components";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";
import { BaseLinkGreen } from "../../styles/button";

const NotFoundScreenWrapper = styled.main`
  margin: 24px 0;
  .page-not-found-img {
    width: 240px;
    overflow: hidden;
  }
  .page-not-found-msg {
    border-radius: 6px;
    padding: 24px 0;
    margin-top: 16px;
    max-width: 400px;
    gap: 12px;
  }
`;

const NotFoundScreen = () => {
  return (
    <NotFoundScreenWrapper className="page-py-spacing">
      <Container>
        <div className="flex items-center justify-center flex-col">
          <div className="page-not-found-img flex items-center justify-center">
            <img
              src={staticImages.page_not_found}
              alt=""
              className="object-fit-cover"
            />
          </div>
          <div className="page-not-found-msg w-full flex flex-col justify-center items-center">
            <p className="text-4xl font-semibold text-outerspace">
              Trang này không tồn tại
            </p>
            <p className="text-gray text-center">
              Vui lòng kiểm tra đường dẫn của bạn hoặc quay về trang chủ
            </p>
            <BaseLinkGreen to="/">Quay về trang chủ</BaseLinkGreen>
          </div>
        </div>
      </Container>
    </NotFoundScreenWrapper>
  );
};

export default NotFoundScreen;
