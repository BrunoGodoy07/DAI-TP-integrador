import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Card, Title, Paragraph, Button } from 'react-native-paper';
import CustomButton from '../components/CustomButton';
import { logoutUser } from '../utils/auth';
import theme from '../utils/theme';

const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    logoutUser();
    navigation.replace('Login');
  };

  const menuItems = [
    {
      title: 'Crear Evento',
      description: 'Crea un nuevo evento para que otros usuarios puedan inscribirse',
      icon: '🎉',
      onPress: () => navigation.navigate('EventForm'),
      color: theme.colors.primary,
    },
    {
      title: 'Mis Eventos',
      description: 'Gestiona los eventos que has creado',
      icon: '📋',
      onPress: () => navigation.navigate('MyEvents'),
      color: theme.colors.secondary,
    },
    {
      title: 'Explorar Eventos',
      description: 'Descubre eventos creados por otros usuarios',
      icon: '🔍',
      onPress: () => navigation.navigate('EventList'),
      color: theme.colors.info,
    },
    {
      title: 'Mis Inscripciones',
      description: 'Ve todos los eventos en los que estás registrado',
      icon: '✅',
      onPress: () => navigation.navigate('MyEnrollments'),
      color: theme.colors.success,
    },
    {
      title: 'Gestionar Ubicaciones',
      description: 'Crea y gestiona ubicaciones para tus eventos',
      icon: '📍',
      onPress: () => navigation.navigate('LocationList'),
      color: theme.colors.warning,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.header}>
          <Text variant="headlineMedium" style={styles.welcomeText}>
            ¡Bienvenido!
          </Text>
          <Text variant="bodyLarge" style={styles.subtitleText}>
            Gestiona y descubre eventos increíbles
          </Text>
        </Surface>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Card key={index} style={styles.menuCard} onPress={item.onPress}>
              <Card.Content style={styles.cardContent}>
                <Text style={[styles.cardIcon, { color: item.color }]}>
                  {item.icon}
                </Text>
                <Title style={styles.cardTitle}>{item.title}</Title>
                <Paragraph style={styles.cardDescription}>
                  {item.description}
                </Paragraph>
              </Card.Content>
            </Card>
          ))}
        </View>

        <CustomButton 
          mode="outlined" 
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={theme.colors.error}
        >
          Cerrar Sesión
        </CustomButton>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  welcomeText: {
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  subtitleText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  menuContainer: {
    marginBottom: theme.spacing.xl,
  },
  menuCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  cardContent: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardDescription: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  logoutButton: {
    borderColor: theme.colors.error,
    marginTop: theme.spacing.lg,
  },
});

export default HomeScreen;