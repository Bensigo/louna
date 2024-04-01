/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { type ReactNode } from "react";
import {
  Box,
  CloseButton,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  type BoxProps,
  type FlexProps,
  useDisclosure,
  HStack,
  Avatar,
  Image,
  IconButton,
  useColorMode,
  Skeleton,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
} from "@chakra-ui/react";
import { type IconType } from "react-icons";
import { type ReactText } from "react";
import MobileNavigation from "./components/MobileNav";

import {
  BiBook,
  BiCalendar,
  BiHome,
  BiLogOut,
  BiMale,
  BiMoon,
  BiSun,

} from "react-icons/bi";
import { useRouter } from "next/router";
import { useCustomAuth } from "~/context/authContext";



interface LinkItemProps {
  name: string;
  icon: IconType;
}
export const navItems: Array<LinkItemProps> = [
  { name: "Home", icon: BiHome },
  { name: "My Calender",  icon: BiCalendar },
  { name: "Classes", icon: BiBook },
  { name: "Profile", icon: BiMale },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useCustomAuth()
  const { isOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const sidebarBg = useColorModeValue('gray.100', 'gray.900');


  const handleSignout = async () => {
     
  };



  return (
    <Box minH="100vh" bg={sidebarBg} overflowY="scroll">
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        styleConfig={{
          border: 0,
          shadow: 'none',
        }}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNavigation />
     {user && <Box ml={{ base: 0, md: 60 }} py="6" px={{ md: '12', base: 6 }}>
        <Flex justifyContent={'flex-end'} align="center" flexWrap={{ base: 'wrap', md: 'nowrap' }}>
  
            <HStack spacing={3} >
              <IconButton
                onClick={toggleColorMode}
                aria-label="color-mode"
                size="md"
                icon={colorMode === 'light' ? <BiMoon /> : <BiSun />}
                color="sage.500"
              />
              <Skeleton isLoaded={!isLoading}  >
                <Text display={{ base: 'none', md: 'inherit' }} fontWeight={700} color="sage.500">
                  Welcome, {user?.firstname}
                </Text>
              </Skeleton>
              <Menu>
                <MenuButton
                  as={Avatar}
                  size="sm"
                  name={user.firstname || ''}
                  src={user?.imageUrl || ''}
                />
                <MenuList py={4} px={2}>
                  <MenuItem icon={<BiLogOut />} onClick={() => void handleSignout()}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
        
        </Flex>
        {children}
      </Box>}
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      borderRightWidth={{ base: 0, md: 2}}
      bg={useColorModeValue("gray.100", "gray.900")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image height={'auto'} width={'120px'} alt= "logo" src="/partner/solu.svg" />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {navItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          path={link.name.toLocaleLowerCase() === "home" ? "" : link.name}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  path: string;
}

const NavItem = ({ path, icon, children, ...rest }: NavItemProps) => {
  const router = useRouter();

  const getRoute = (() => {
    const transformPath = path.toLowerCase().replace(" ", "-");
    return `/dashboard/${transformPath}`;
  })();

  const isActive = (() => {

    const isPath = router.pathname.match(new RegExp(`^${getRoute}(\\/.*)?$`));
    if (isPath) {
      return true;
    }
    return false;
  })();

  return (
    <Link
      href={getRoute}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex

        align="center"
        p="4"
        mx={4}
        my={3}
        borderRadius="lg"
        color={isActive ? "white" : "gray.500"}
        role="group"
        fontWeight={700}
        cursor="pointer"
        bg={isActive ? "black" : "inherit"}
        _hover={{
          bg: "gray.200",
          color: "gray.500",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            color={isActive ? "sage.500" : "gray.500"}
            fontSize="16"
            _groupHover={{
              color: "gray.500",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};