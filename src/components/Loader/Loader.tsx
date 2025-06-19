import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";

const waveAnimation = keyframes`
  0% {
    height: 10px;
  }
  50% {
    height: 50px;
  }
  100% {
    height: 10px;
  }
`;

const Loader = () => {
  return (
    <Box
      sx={{
        width: 300,
        height: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      {[0, 0.1, 0.2, 0.3].map((delay, index) => (
        <Box
          key={index}
          sx={{
            width: 20,
            height: 10,
            marginX: 0.5,
            backgroundColor: "#3498db",
            borderRadius: 1,
            animation: `${waveAnimation} 1s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </Box>
  );
};

export default Loader;
