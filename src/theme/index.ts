import {createTheme} from '@rneui/themed';
import '@rneui/themed';
import {Dimensions, PixelRatio, Platform} from 'react-native';

const {width, height} = Dimensions.get('window');

export const HEIGHT = height;
export const WIDTH = width;
export const baseWidth = 375;
// based on iphone 5s's scale
const scale = width / baseWidth;

type FontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | undefined;

declare module '@rneui/themed' {
  export interface ThemeColors {
    PRIMARY: string;
    PRIMARY_OPACITY: string;
    SELECTED_CONTAINER: string;
    BACKDROP_CONTAINER: string;
    PRIMARY_OPACITY_DARK: string;
    SECONDARY: string;
    WHITE: string;
    WHITE_OPACITY: string;
    LIGHT_WHITE_OPACITY: string;
    OFFWHITE: string;
    BLACK: string;
    GRAY: string;
    TEXT_BLACK: string;
    TEXT_COLOR_WHITE: string;
    TEXT_COLOR: string;
    TEXT_COLOR_PLACEHOLDER: string;
    TEXT_GRAY: string;
    TEXT_GRAY_LIGHT: string;
    BORDER_GRAY: string;
    BACKGROUND: string; //old F5F5F5
    DARK_BACKGROUND: string;
    ERROR: string;
    LIGHT_GRAY: string;
    LIGHT_GRAY_OPACITY: string;
    BORDER_COLOR: string;
    LIGHT_BLUE: string;
    ASH_GRAY: string;
    CHARCOAL_GRAY: string;
    NEUTRAL_GRAY: string;
    NEUTRAL_GRAY_OPACITY: string;
    PALE_GRAY: string;
    MEDIUM_GRAY: string;
    SILVER_GRAY: string;
    ORANGE: string;
    GREEN: string;
    GREEN_OPACITY: string;
    PEACH: string;
    PEACH_PUFF: string;
    LIGHT_SKY_BLUE: string;
    PASTEL_GREEN: string;
    MINT_GREEN: string;
    DISABLED_SWITCH: string;
    RED: string;
    RED_OPACITY: string;
    DARK_GRAY: string;
    CHAT_BACKGROUND: string;
    CHAT_HEADER_BACKGROUND: string;
    REVIEW_REPLY_BACKGROUND: string;
    GRAYISH_BLUE: string;
    PURPLE: string;
    LIGHT_PURPLE: string;
    PALE_BLUE: string;
    CHAT_BUBBLE_RECEIVER: string;
    SLATE_GRAY: string;
    COUPON_BG: string;
    COUPON_CODE_BG: string;
    BLOCK_COLOR: string;
    TEXT_FIELD_BACKGROUND: string;
    SECONDARY_BUTTON_BACKGROUND: string;
  }

  export interface FontSizes {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  }
  export interface fontNames {
    InterBold: string;
    InterLight: string;
    InterMedium: string;
    InterRegular: string;
    InterSemiBold: string;
  }

  export interface FontWeights {
    normal: FontWeight;
    bold: FontWeight;
    semiBold: FontWeight;
    extraBold: FontWeight;
  }

  export interface Theme {
    fontSizes: FontSizes;
    fontWeights: FontWeights;
    COLORS: ThemeColors;
    fontFamily: fontNames;
  }
}

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const COLORS = {
  PRIMARY: '#160E25',
  SECONDARY: '#570AB5',
  GRAY: '#B8B8B8',
  WHITE: '#FFFFFF',
};
export const theme = createTheme({
  mode: 'light',
  lightColors: {
    primary: '#76BC3F',
    secondary: '#6c757d',
    grey0: '#838383',
  },
  COLORS,
  darkColors: {},
  components: {
    Button: {
      buttonStyle: {
        borderRadius: SPACING.xs,
      },
      size: 'sm',
    },
  },

  spacing: SPACING,
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  },
  fontWeights: {
    normal: '400',
    semiBold: '500',
    bold: '700',
    extraBold: '900',
  },

  fontFamily: {
    InterBold: 'InterBold',
    InterLight: 'InterLight',
    InterMedium: 'InterMedium',
    InterRegular: 'InterRegular',
    InterSemiBold: 'InterSemiBold',
  },
});

/**
 * Normalize the size of the component based on the screen size.
 * @param size - size of the component
 * @returns size
 */
export function n(size: number) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2; // Adjust for Android if needed
  }
}
