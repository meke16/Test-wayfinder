import * as React from "react";
import { cn } from "@/lib/utils";

interface BannerProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  backgroundColor?: string; // optional background prop
  width?: string | number;
  height?: string | number;
  onClick?: () => void;
}

export const Banner: React.FC<BannerProps> = ({
  label,
  value,
  icon,
  color,
  backgroundColor,
  width = "240px",
  height = "140px",
  onClick,
}) => {
  const defaultBgColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
    color.slice(3, 5),
    16
  )}, ${parseInt(color.slice(5, 7), 16)}, 0.1)`;

  const borderColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
    color.slice(3, 5),
    16
  )}, ${parseInt(color.slice(5, 7), 16)}, 0.2)`;

  const iconBgColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
    color.slice(3, 5),
    16
  )}, ${parseInt(color.slice(5, 7), 16)}, 0.2)`;

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl p-5 transition-all duration-200",
        onClick ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg" : ""
      )}
      style={{
        width,
        height,
        backgroundColor: backgroundColor || defaultBgColor, // use prop if provided
        border: `1px solid ${borderColor}`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 44,
            height: 44,
            backgroundColor: iconBgColor,
            color: color,
            fontSize: 20,
          }}
        >
          {icon}
        </div>
        <div className="text-sm font-medium text-gray-500">{label}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
};
