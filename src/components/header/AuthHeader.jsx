import { HeaderMainWrapper, SiteBrandWrapper } from "../../styles/header";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";

const AuthHeader = () => {
  return (
    <HeaderMainWrapper className="flex items-center">
      <Container>
        <div className="header-wrap flex items-center justify-between">
          <SiteBrandWrapper to="/" className="inline-flex">
            <div className="brand-img-wrap flex items-center justify-center">
              <img className="site-brand-img" src={staticImages.logo} alt="" />
            </div>
          </SiteBrandWrapper>
        </div>
      </Container>
    </HeaderMainWrapper>
  );
};

export default AuthHeader;
