import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const RegisterScreen = ({ navigation }) => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // //codigo del back: POST /api/user/register
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 24 }}>Registrarse</Text>
      <CustomInput label="Nombre" value={first_name} onChangeText={setFirstName} />
      <CustomInput label="Apellido" value={last_name} onChangeText={setLastName} />
      <CustomInput label="Email" value={username} onChangeText={setUsername} />
      <CustomInput label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <CustomButton onPress={handleRegister}>Registrarse</CustomButton>
      <CustomButton mode="text" onPress={() => navigation.goBack()}>Volver</CustomButton>
    </View>
  );
};

export default RegisterScreen;