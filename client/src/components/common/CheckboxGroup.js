import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const CheckBoxGroup = ({
  name,
  label,
  error,
  info,
  type,
  onChange,
  disabled
}) => {
  return (
    <div className="form-check">
      <input
        type={type}
        className={classnames("form-check-input form-check-input-lg", {
          "is-invalid": error
        })}
        name={name}
        onChange={onChange}
        disabled={disabled}
      />
      <label className="form-check-label" htmlFor={name}>
        <a href="/" data-toggle="modal" data-target="#exampleModal">
          {label}
        </a>
      </label>
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

CheckBoxGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string
};

CheckBoxGroup.defaultProps = {
  type: "checkbox"
};

export default CheckBoxGroup;
