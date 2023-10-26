import { IconProps } from "@/types/icons";

const Close = ({ width = 24, height = 24 }: IconProps) => {
  return (
    <svg height={height} width={width} fill="currentColor" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
      <path d="M256-227.692 227.692-256l224-224-224-224L256-732.308l224 224 224-224L732.308-704l-224 224 224 224L704-227.692l-224-224-224 224Z" />
    </svg>
  );
};

export default Close;
