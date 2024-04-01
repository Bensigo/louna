import { BottomTabBar, type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCustomTabbar } from "../../context/useCustomTabbar";

export const CustomTabBar: React.FC<BottomTabBarProps> = (props:BottomTabBarProps ) => {
  const { isTabBarVisible } = useCustomTabbar()

  if (!isTabBarVisible){
    return null;
  }

    return  <BottomTabBar {...props} />
}