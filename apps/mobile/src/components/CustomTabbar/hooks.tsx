import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

const CustomTabBarContext = createContext({
  isTabBarVisible: true,
  hideTabBar: () => {},
  showTabBar: () => {},
});

export const useCustomTabbar = () => {
  return useContext(CustomTabBarContext);
};

export const CustomTabbarProvider = ({ children }: { children: ReactNode }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  const value = {
    isTabBarVisible,
    hideTabBar: () => setIsTabBarVisible(false),
    showTabBar: () => setIsTabBarVisible(true),
  };

  return (
    <CustomTabBarContext.Provider value={value}>
      {children}
    </CustomTabBarContext.Provider>
  );
};
