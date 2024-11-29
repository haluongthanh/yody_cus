import styled from "styled-components";
import { FormElement, Input } from "../../styles/form";
import { PropTypes } from "prop-types";
import { useState } from "react";

const PasswordToggleButton = styled.button`
  position: absolute;
  bottom: 100%;
  right: 0;

  .pwd-toggle-text {
    padding-left: 5px;
  }
`;

const PasswordInput = ({ fieldName, name, value, onChange, errorMsg = "" }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormElement>
      <label htmlFor="" className="form-elem-label">
        {fieldName}
      </label>
      <div className="form-elem-block">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder=""
          name={name}
          value={value}
          onChange={onChange}
          className="form-elem-control"
        />

        <PasswordToggleButton
          type="button"
          className="pwd-value-toggle flex items-center"
          onClick={togglePassword}
        >
          {showPassword ? (
            <>
              <i className="bi bi-eye-fill"></i>
              <span className="pwd-toggle-text text-sm">Ẩn</span>
            </>
          ) : (
            <>
              <i className="bi bi-eye-slash-fill"></i>
              <span className="pwd-toggle-text text-sm">Hiện</span>
            </>
          )}
        </PasswordToggleButton>
      </div>
      <span className="form-elem-error text-end font-medium">{errorMsg}</span>
    </FormElement>
  );
};

export default PasswordInput;

PasswordInput.propTypes = {
  fieldName: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  errorMsg: PropTypes.string,
};
