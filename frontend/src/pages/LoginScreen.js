import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { loginUser } from '../utils/auth';
import theme from '../utils/theme';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await loginUser({ username, password });
      if (result.success) {
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
        navigation.replace('Home');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <Text variant="headlineMedium" style={styles.title}>
          Iniciar Sesión
        </Text>
        
        <CustomInput 
          label="Email" 
          value={username} 
          onChangeText={setUsername}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <CustomInput 
          label="Contraseña" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
        />
        
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
        
        <CustomButton 
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.loginButton}
        >
          {loading ? 'Iniciando...' : 'Ingresar'}
        </CustomButton>
        
        <CustomButton 
          mode="text" 
          onPress={() => navigation.navigate('Register')}
          style={styles.registerButton}
        >
          ¿No tenés cuenta? Registrate
        </CustomButton>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  surface: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  title: {
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  loginButton: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
  registerButton: {
    marginTop: theme.spacing.sm,
  },
});

export default LoginScreen;