import React from "react";
import { ClipLoader } from "react-spinners";

interface LoaderProps {
  loading?: boolean;
  size?: number;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({
  loading = true,
  size = 50,
  color = "#4f46e5",
}) => {
  return <ClipLoader color={color} loading={loading} size={size} />;
};

export default Loader;
