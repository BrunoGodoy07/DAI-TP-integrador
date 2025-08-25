import React from 'react';
import { Button } from 'react-native-paper';
import theme from '../utils/theme';

const CustomButton = ({ onPress, children, mode = "contained", style, textColor, ...props }) => (
  <Button
    mode={mode}
    onPress={onPress}
    style={[styles.button, style]}
    textColor={textColor || (mode === "contained" ? theme.colors.text : theme.colors.primary)}
    theme={{
      colors: {
        primary: theme.colors.primary,
        onPrimary: theme.colors.text,
        surface: theme.colors.surface,
        onSurface: theme.colors.text,
      },
    }}
    {...props}
  >
    {children}
  </Button>
);

const styles = {
  button: {
    marginBottom: 12,
  },
};

export default CustomButton;