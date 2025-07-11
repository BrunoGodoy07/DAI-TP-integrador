import React from 'react';
import { TextInput } from 'react-native-paper';

const CustomInput = ({ label, value, onChangeText, ...props }) => (
  <TextInput
    label={label}
    value={value}
    onChangeText={onChangeText}
    mode="outlined"
    style={{ marginBottom: 12 }}
    {...props}
  />
);

export default CustomInput;