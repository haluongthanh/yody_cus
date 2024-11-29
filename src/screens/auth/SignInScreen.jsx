import styled from "styled-components";
import { FormGridWrapper, FormTitle } from "../../styles/form_grid";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";
import { FormElement, Input } from "../../styles/form";
import PasswordInput from "../../components/auth/PasswordInput";
import { Link } from "react-router-dom";
import { BaseButtonBlack } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { login } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { postLogin } from "../../services/apiService";
import { useDispatch } from "react-redux";
import { useState } from "react";

const SignInScreenWrapper = styled.section`
  .form-separator {
    margin: 32px 0;
    column-gap: 18px;

    @media (max-width: ${breakpoints.lg}) {
      margin: 24px 0;
    }

    .separator-text {
      border-radius: 50%;
      min-width: 36px;
      height: 36px;
      background-color: ${defaultTheme.color_purple};
      position: relative;
    }

    .separator-line {
      width: 100%;
      height: 1px;
      background-color: ${defaultTheme.color_platinum};
    }
  }

  .form-elem-text {
    margin-top: -16px;
    display: block;
  }
`;

const SignInScreen = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const currentUrl = localStorage.getItem("currentUrl");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let data = await postLogin(username, password);
      if (data.code === 20001) {
        dispatch(login(data.data)); // Gọi action login với data.data
        toast.success("Đăng nhập thành công!");
        if (currentUrl) {
          window.location.href = currentUrl;
        } else {
          window.location.href = "/";
        }
      } else if (data.code === 40001) {
        toast.error(data.data.error);
      } else if (data.code === 40004) {
        toast.error("Vui lòng nhập đầy đủ thông tin!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <SignInScreenWrapper>
      <FormGridWrapper>
        <Container>
          <div className="form-grid-content">
            <div className="form-grid-left">
              <img src={staticImages.form_img1} className="object-fit-cover" />
            </div>
            <div className="form-grid-right">
              <FormTitle>
                <h3>Đăng nhập</h3>
              </FormTitle>

              <form onSubmit={handleSubmit}>
                <FormElement>
                  <label htmlFor="" className="form-elem-label">
                    Email
                  </label>
                  <Input
                    type="text"
                    placeholder=""
                    name="username"
                    className="form-elem-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormElement>

                <PasswordInput
                  fieldName="Mật khẩu"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Link
                  to="/reset"
                  className="form-elem-text text-end font-medium"
                >
                  Quên mật khẩu?
                </Link>
                <BaseButtonBlack type="submit" className="form-submit-btn">
                  Đăng nhập
                </BaseButtonBlack>
              </form>
              <p className="flex flex-wrap account-rel-text">
                Bạn chưa có tài khoản?
                <Link to="/sign_up" className="font-medium">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </FormGridWrapper>
    </SignInScreenWrapper>
  );
};

export default SignInScreen;
