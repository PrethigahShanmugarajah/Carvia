import { Toaster } from "react-hot-toast";

const AppToaster = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2000,
        style: {
          padding: "12px 16px",
          borderRadius: "8px",
          color: "#fff",
          fontWeight: "500",
          fontSize: "14px",
        },

        success: {
          style: {
            background: "#22c55e",
            color: "#fff",
          },
          icon: null,
        },

        error: {
          style: {
            background: "#ef4444",
            color: "#fff",
          },
          icon: null,
        },

        warning: {
          style: {
            background: "#f97316",
            color: "#fff",
          },
          icon: null,
        },

        info: {
          style: {
            background: "#3b82f6",
            color: "#fff",
          },
          icon: null,
        },
      }}
    />
  );
};

export default AppToaster;
