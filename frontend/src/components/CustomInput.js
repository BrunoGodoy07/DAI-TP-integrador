import React from 'react';
import { TextInput } from 'react-native-paper';
import theme from '../utils/theme';

const CustomInput = ({ label, value, onChangeText, style, ...props }) => (
  <TextInput
    label={label}
    value={value}
    onChangeText={onChangeText}
    mode="outlined"
    style={[styles.input, style]}
    theme={{
      colors: {
        primary: theme.colors.primary,
        onSurface: theme.colors.text,
        surface: theme.colors.surface,
        outline: theme.colors.border,
      },
    }}
    {...props}
  />
);

const styles = {
  input: {
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
  },
};

export default CustomInput;