import styled from "styled-components";
import { FormGridWrapper, FormTitle } from "../../styles/form_grid";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";
import { FormElement, Input } from "../../styles/form";
import { BaseButtonBlack } from "../../styles/button";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/apiService"; 
import { useState } from "react";
import { toast } from "react-toastify";

const ResetScreenWrapper = styled.section``;

const ResetScreen = () => {
  const [email, setEmail] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Vui lòng nhập địa chỉ email hợp lệ."); 
      return;
    }

    setIsSubmitting(true); 
    try {
      const response = await forgotPassword(email);

      if (response.code === 20001) {
        toast.success(response.data); 
      } else {
        toast.error(response.msg || "Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại."); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ResetScreenWrapper>
      <FormGridWrapper>
        <Container>
          <div className="form-grid-content">
            <div className="form-grid-left">
              <img src={staticImages.form_img3} className="object-fit-cover" alt="Reset Password" />
            </div>
            <div className="form-grid-right">
              <FormTitle>
                <h3>Đặt lại mật khẩu của bạn</h3>
                <p>Nhập email của bạn, chúng tôi sẽ gửi lại mật khẩu mới cho bạn.</p>
                <p>Vui lòng kiểm tra email.</p>
              </FormTitle>

              <form onSubmit={handleSubmit}>
                <FormElement>
                  <label htmlFor="email" className="form-elem-label">
                    Email
                  </label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-elem-control"
                    disabled={isSubmitting}
                  />
                </FormElement>
                <BaseButtonBlack type="submit" className="form-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Đang gửi..." : "Gửi"}
                </BaseButtonBlack>
              </form>
              <p className="flex flex-wrap account-rel-text">
                <Link to="/sign_in" className="font-medium">
                  Quay lại đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </FormGridWrapper>
    </ResetScreenWrapper>
  );
};

export default ResetScreen;
