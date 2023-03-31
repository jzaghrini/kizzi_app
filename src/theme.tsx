import {
  extendTheme,
  ThemeConfig,
  withDefaultColorScheme,
} from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const colors = {
  brand: {
    50: '#FFF2E4',
    100: '#fee5c8',
    200: '#E4CFB7',
    300: '#C9BAA7',
    400: '#AFA496',
    500: '#958E85',
    600: '#7A7874',
    700: '#606364',
    800: '#454D53',
    900: '#2b3742',
    950: '#161C21',
  },
}
const theme = extendTheme(
  { config, colors },
  withDefaultColorScheme({ colorScheme: 'messenger' })
)
export default theme
