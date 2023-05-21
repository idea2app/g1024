import { FC } from "react";
import { ButtonProps } from "react-bootstrap";
import classNmaes from "classnames";
import "./style.scss";

interface CommonButtonProps
  extends Pick<ButtonProps, "className" | "children" | "disabled" | "onClick"> {
  border?: boolean;
}

export const CommonButton: FC<CommonButtonProps> = ({
  border,
  className,
  children,
  disabled,
  onClick,
}) => (
  <button
    className={classNmaes("rounded-pill p-2 fs-5 fw-semibold", className, {
      "border-button": border,
      "border-0 text-black bg-gradient-blue": !border,
    })}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);
