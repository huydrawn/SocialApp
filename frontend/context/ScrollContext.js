import React, { createContext, useContext } from "react";
import { useSharedValue } from "react-native-reanimated";

// Tạo Context
const ScrollYContext = createContext();

// Tạo Provider để cung cấp shared value
export const ScrollYProvider = ({ children }) => {
  const scrollY = useSharedValue(0); // Giá trị shared value

  return (
    <ScrollYContext.Provider value={scrollY}>
      {children}
    </ScrollYContext.Provider>
  );
};

// Custom hook để truy cập giá trị
export const useScrollY = () => {
  const context = useContext(ScrollYContext);
  if (!context) {
    throw new Error("useScrollY must be used within a ScrollYProvider");
  }
  return context;
};