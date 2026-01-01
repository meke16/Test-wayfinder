import * as React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  text?: string; 
}

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  color = "#3b82f6",
  text,
}) => {
  const spinnerSize = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={`animate-spin rounded-full border-t-transparent border-solid border-blue-500 ${spinnerSize}`}
        style={{ borderColor: `${color} ${color} ${color} transparent` }}
      />
      {text && <span className="text-gray-600 text-sm">{text}</span>}
    </div>
  );
};
