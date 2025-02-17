import React from "react";
import { ChartGradientColor } from "./types";

const GraphColors = () => (
  <svg style={{ width: 0, height: 0, display: "block" }}>
    <defs>
      <linearGradient id={ChartGradientColor.Red} x1="1%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor={"rgba(18, 20, 39, 0)"} />
        <stop offset="50%" stopColor={"rgba(21, 21, 57, 0.5)"} />
        <stop offset="100%" stopColor={"rgba(86, 36, 108, 1)"} />
      </linearGradient>

      <linearGradient id={ChartGradientColor.Green} x1="1%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor={"rgba(17, 27, 47, 0)"} />
        <stop offset="50%" stopColor={"rgba(22, 41, 67, 0.5)"} />
        <stop offset="100%" stopColor={"rgba(39, 110, 107, 1)"} />
      </linearGradient>
    </defs>
  </svg>
);

export default GraphColors;
