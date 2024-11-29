import styled from "styled-components";
import { FormGridWrapper, FormTitle } from "../../styles/form_grid";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";
import { FormElement, Input } from "../../styles/form";
import PasswordInput from "../../components/auth/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { BaseButtonBlack } from "../../styles/button";
import { postRegister } from "../../services/apiService";
import { useState } from "react";

const SignUpScreenWrapper = styled.section`
  form {
    margin-top: 40px;
    .form-elem-text {
      margin-top: -16px;
      display: block;
    }
  }

  .text-space {
    margin: 0 4px;
  }
`;

const SignUpScreen = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.email.trim()) tempErrors.email = "Email không được để trống";
    if (!formData.fullName.trim())
      tempErrors.fullName = "Họ tên không được để trống";
    if (!formData.password.trim())
      tempErrors.password = "Mật khẩu không được để trống";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    try {
      let data = await postRegister(formData);

      if (data.code === 20001) {
        navigate("/sign_in");
      } else {
        setErrors({ api: data.msg });
      }
    } catch (err) {
      setErrors({ api: "Đăng ký thất bại, vui lòng thử lại" });
    }
  };

  return (
    <SignUpScreenWrapper>
      <FormGridWrapper>
        <Container>
          <div className="form-grid-content">
            <div className="form-grid-left">
              <img
                src={staticImages.form_img2}
                className="object-fit-cover"
                alt=""
              />
            </div>
            <div className="form-grid-right">
              <FormTitle>
                <h3>Đăng ký</h3>
                <p className="text-base">
                  Đăng ký miễn phí để truy cập vào bất kỳ sản phẩm nào của chúng
                  tôi
                </p>
              </FormTitle>
              <form onSubmit={handleSubmit}>
                <FormElement>
                  <label htmlFor="fullName" className="forme-elem-label">
                    Họ và tên
                  </label>
                  <Input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-elem-control"
                  />
                  {errors.fullName && (
                    <span className="error-message form-elem-error">
                      {errors.fullName}
                    </span>
                  )}
                </FormElement>

                <FormElement>
                  <label htmlFor="email" className="forme-elem-label">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-elem-control"
                  />
                  {errors.email && (
                    <span className="error-message form-elem-error">
                      {errors.email}
                    </span>
                  )}
                </FormElement>

                <PasswordInput
                  fieldName="Mật khẩu"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  errorMsg={errors.password}
                />
                {errors.api && (
                  <span
                    style={{ color: "#f00" }}
                    className="error-message form-elem-error"
                  >
                    {errors.api}
                  </span>
                )}

                <BaseButtonBlack type="submit" className="form-submit-btn">
                  Đăng ký
                </BaseButtonBlack>
              </form>
              <p className="flex flex-wrap account-rel-text">
                Bạn đã có tài khoản?
                <Link to="/sign_in" className="font-medium">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </FormGridWrapper>
    </SignUpScreenWrapper>
  );
};

export default SignUpScreen;
