import { FC } from "react";

interface InputProps {
  value?: string;
}
export const Input: FC<InputProps> = ({ value }) => (
  <div className="common-card-bg-box">
    <div className="p-3">{value}</div>
  </div>
);
