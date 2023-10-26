import { IconProps } from "@/types/icons";

const Undo = ({ width, height }: IconProps) => {
  return (
    <svg height={height} width={width} fill="currentColor" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
      <path d="M296.154-240v-40h290.154q62.23 0 106.038-42.692 43.808-42.693 43.808-104.231t-43.808-103.846q-43.808-42.308-106.038-42.308H276.616l118.615 118.615-28.308 28.308L200-593.077 366.923-760l28.308 28.308-118.615 118.615h309.692q78.538 0 134.192 54.154 55.654 54.154 55.654 132T720.5-294.538Q664.846-240 586.308-240H296.154Z" />
    </svg>
  );
};

export default Undo;
