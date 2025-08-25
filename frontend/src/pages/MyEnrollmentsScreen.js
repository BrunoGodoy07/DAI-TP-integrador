import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Text, Surface, Card, Title, Paragraph, Button, FAB, Chip } from 'react-native-paper';
import { getAllEvents, unenrollFromEvent } from '../utils/events';
import { isAuthenticated } from '../utils/auth';
import theme from '../utils/theme';

const MyEnrollmentsScreen = ({ navigation }) => {
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigation.replace('Login');
      return;
    }
    loadEnrolledEvents();
  }, []);

  const loadEnrolledEvents = async () => {
    try {
      setLoading(true);
      // Por ahora cargamos todos los eventos, pero en el backend se debería filtrar
      // solo los eventos en los que el usuario está inscrito
      const response = await getAllEvents(1, 100);
      // Aquí se debería filtrar por eventos inscritos
      setEnrolledEvents(response.data || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las inscripciones');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEnrolledEvents();
    setRefreshing(false);
  };

  const handleUnenroll = (event) => {
    Alert.alert(
      'Confirmar desinscripción',
      `¿Estás seguro de que quieres desinscribirte del evento "${event.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desinscribirme',
          style: 'destructive',
          onPress: async () => {
            try {
              await unenrollFromEvent(event.id);
              Alert.alert('Éxito', 'Te has desinscrito del evento correctamente');
              loadEnrolledEvents();
            } catch (error) {
              Alert.alert('Error', error.message || 'No se pudo desinscribir del evento');
            }
          },
        },
      ]
    );
  };

  const handleViewEventDetails = (event) => {
    navigation.navigate('EventDetail', { eventId: event.id });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (event) => {
    const now = new Date();
    const eventDate = new Date(event.start_date);
    
    if (eventDate < now) return theme.colors.error;
    if (eventDate.toDateString() === now.toDateString()) return theme.colors.warning;
    return theme.colors.success;
  };

  const getStatusText = (event) => {
    const now = new Date();
    const eventDate = new Date(event.start_date);
    
    if (eventDate < now) return 'Finalizado';
    if (eventDate.toDateString() === now.toDateString()) return 'Hoy';
    return 'Próximo';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando inscripciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Surface style={styles.header}>
          <Title style={styles.title}>Mis Inscripciones</Title>
          <Paragraph style={styles.subtitle}>
            Eventos en los que estás registrado
          </Paragraph>
        </Surface>

        {enrolledEvents.length === 0 ? (
          <Surface style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No estás inscrito en ningún evento
            </Text>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('EventList')}
              style={styles.exploreButton}
            >
              Explorar eventos
            </Button>
          </Surface>
        ) : (
          <View style={styles.eventsContainer}>
            {enrolledEvents.map((event) => (
              <Card key={event.id} style={styles.eventCard}>
                <Card.Content>
                  <View style={styles.eventHeader}>
                    <Title style={styles.eventTitle}>{event.name}</Title>
                    <Chip 
                      mode="outlined"
                      textStyle={{ color: getStatusColor(event) }}
                      style={[styles.statusChip, { borderColor: getStatusColor(event) }]}
                    >
                      {getStatusText(event)}
                    </Chip>
                  </View>
                  
                  <Paragraph style={styles.eventDescription}>
                    {event.description}
                  </Paragraph>
                  
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventDetail}>
                      📅 {formatDate(event.start_date)}
                    </Text>
                    <Text style={styles.eventDetail}>
                      ⏱️ {event.duration_in_minutes} minutos
                    </Text>
                    <Text style={styles.eventDetail}>
                      💰 ${event.price}
                    </Text>
                    <Text style={styles.eventDetail}>
                      👥 {event.max_assistance} personas
                    </Text>
                    {event.event_location && (
                      <Text style={styles.eventDetail}>
                        📍 {event.event_location.location.name}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.eventActions}>
                    <Button 
                      mode="outlined" 
                      onPress={() => handleViewEventDetails(event)}
                      style={styles.actionButton}
                      textColor={theme.colors.info}
                    >
                      Ver detalles
                    </Button>
                    <Button 
                      mode="outlined" 
                      onPress={() => handleUnenroll(event)}
                      style={styles.actionButton}
                      textColor={theme.colors.error}
                    >
                      Desinscribirme
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <FAB
        icon="search"
        style={styles.fab}
        onPress={() => navigation.navigate('EventList')}
        label="Explorar eventos"
      />
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
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  title: {
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  loadingText: {
    color: theme.colors.text,
    textAlign: 'center',
    fontSize: 18,
    marginTop: theme.spacing.xxl,
  },
  emptyState: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  emptyStateText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    fontSize: 16,
  },
  exploreButton: {
    backgroundColor: theme.colors.primary,
  },
  eventsContainer: {
    marginBottom: theme.spacing.lg,
  },
  eventCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  eventTitle: {
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  statusChip: {
    backgroundColor: 'transparent',
  },
  eventDescription: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  eventDetails: {
    marginBottom: theme.spacing.md,
  },
  eventDetail: {
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    borderColor: theme.colors.border,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.info,
  },
});

export default MyEnrollmentsScreen;
