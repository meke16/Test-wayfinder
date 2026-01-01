import * as React from "react";

interface ProgressBarProps {
  percentage: number;
  color: string;
  label: string;
  value: string | number;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color,
  label,
  value,
  height = 8,
}) => {
  return (
    <div className="mb-3">

      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-600">{label} - </span>
        <span className="text-sm font-semibold text-gray-900"> {value} </span>
      </div>


      <div
        className="bg-gray-200 rounded overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className="rounded transition-all duration-300"
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};
