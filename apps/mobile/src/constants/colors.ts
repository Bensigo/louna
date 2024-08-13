const tintColorLight = "#333";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#3333",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    buttonText:'#ccc',
    button: 'black',
    tabIconSelected: tintColorLight,
    primary: "#FFEB3B",
    secondray: "#fff",
  },
  dark: {
    text: "#3333",
    background: "#fff",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    primary: "#FFEB3B",
    secondray: "#fff",
  },
};


export const colorScheme = {
  primary: {
    green: '#4CAF50', // Primary Green
    lightGreen: '#8BC34A', // Light Green
    white: '#FFFFFF', // White for text on primary buttons
  },
  secondary: {
    gray: '#9E9E9E', // Gray for secondary text and elements
    lightGray: '#F5F5F5', // Light Gray for backgrounds
    darkGray: '#616161', // Dark Gray for text
  },
  accent: {
    blue: '#2196F3', // Accent Blue for secondary buttons
    lightBlue: '#03A9F4', // Light Blue for secondary elements
    orange: '#FF9800', // Accent Orange for highlights
    red: '#F44336', // Red for delete buttons
  },
  text: {
    primary: '#4CAF50', // Primary Green for main titles
    secondary: '#9E9E9E', // Gray for subtitles
    white: '#FFFFFF', // White for text on dark backgrounds
  },
  background: {
    light: '#F5F5F5', // Light Gray for general backgrounds
    white: '#FFFFFF', // White for cards and containers
  },
  border: {
    primary: '#388E3C', // Darker Green for primary borders
    secondary: '#9E9E9E', // Gray for secondary borders
    accent: '#2196F3', // Blue for accent borders
  }
};