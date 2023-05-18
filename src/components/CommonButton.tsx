import { FC, ReactNode } from "react";
import { ButtonProps } from "react-bootstrap";
import classNmaes from "classnames";

interface CommonButtonProps extends Pick<ButtonProps, "onClick"> {
  border?: boolean;
  className?: string;
  children?: ReactNode;
}

export const CommonButton: FC<CommonButtonProps> = ({
  border,
  className,
  children,
  onClick,
}) => (
  <button
    className={classNmaes("rounded-pill p-2 fs-5 fw-semibold", className, {
      "border-button": border,
      "border-0 text-black bg-gradient-blue": !border,
    })}
    onClick={onClick}
  >
    {children}
  </button>
);
