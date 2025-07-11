import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // //codigo del back: POST /api/user/login
    // on success, guardar token y navegar a Home
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 24 }}>Iniciar Sesión</Text>
      <CustomInput label="Email" value={username} onChangeText={setUsername} />
      <CustomInput label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <CustomButton onPress={handleLogin}>Ingresar</CustomButton>
      <CustomButton mode="text" onPress={() => navigation.navigate('Register')}>¿No tenés cuenta? Registrate</CustomButton>
    </View>
  );
};

export default LoginScreen;