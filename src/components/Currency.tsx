import "./style.scss";

interface IProps {
  tag?: string;
  value: number;
  className?: string;
}

export default function CurrencyDisplay(props: IProps) {
  const { tag = "Currency", value } = props;
  return (
    <>
      <div
        className={`currency-display fs-5 px-3 d-flex justify-content-between align-items-center fw-bold ${props.className}`}
      >
        <span className="text-white">{tag}</span>
        <span className="gradient-content">{value.toLocaleString()}</span>
      </div>
    </>
  );
}
