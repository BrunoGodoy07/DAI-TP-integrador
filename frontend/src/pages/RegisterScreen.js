import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { registerUser } from '../utils/auth';
import theme from '../utils/theme';

const RegisterScreen = ({ navigation }) => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!first_name || !last_name || !username || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await registerUser({
        first_name,
        last_name,
        username,
        password
      });
      
      if (result.success) {
        Alert.alert('Éxito', 'Usuario registrado correctamente', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <Text variant="headlineMedium" style={styles.title}>
          Registrarse
        </Text>
        
        <CustomInput 
          label="Nombre" 
          value={first_name} 
          onChangeText={setFirstName}
          autoCapitalize="words"
        />
        
        <CustomInput 
          label="Apellido" 
          value={last_name} 
          onChangeText={setLastName}
          autoCapitalize="words"
        />
        
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
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.registerButton}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </CustomButton>
        
        <CustomButton 
          mode="text" 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Volver
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
  registerButton: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
  backButton: {
    marginTop: theme.spacing.sm,
  },
});

export default RegisterScreen;