import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BottomTabBar } from "@react-navigation/bottom-tabs";

import { useCustomTabbar } from "./hooks";

export const CustomTabBar: React.FC<BottomTabBarProps> = (
  props: BottomTabBarProps,
) => {
  const { isTabBarVisible } = useCustomTabbar();

  if (!isTabBarVisible) {
    return null;
  }

  return <BottomTabBar {...props} />;
};
