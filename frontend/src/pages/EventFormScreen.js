import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Surface, TextInput, Button, Divider } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { createEvent, updateEvent, getEventById } from '../utils/events';
import { getUserLocations } from '../utils/locations';
import { isAuthenticated } from '../utils/auth';
import theme from '../utils/theme';

const EventFormScreen = ({ route, navigation }) => {
  const { event: eventToEdit, isEditing } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  
  // Campos del formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [maxAssistance, setMaxAssistance] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigation.replace('Login');
      return;
    }
    
    loadLocations();
    
    if (eventToEdit && isEditing) {
      loadEventData();
    }
  }, []);

  const loadLocations = async () => {
    try {
      const response = await getUserLocations(1, 100);
      setLocations(response.data || []);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const loadEventData = async () => {
    try {
      const eventData = await getEventById(eventToEdit.id);
      setName(eventData.name || '');
      setDescription(eventData.description || '');
      setStartDate(eventData.start_date ? new Date(eventData.start_date).toISOString().slice(0, 16) : '');
      setDuration(eventData.duration_in_minutes?.toString() || '');
      setPrice(eventData.price?.toString() || '');
      setMaxAssistance(eventData.max_assistance?.toString() || '');
      setSelectedLocationId(eventData.id_event_location?.toString() || '');
      setTags(eventData.tags ? JSON.stringify(eventData.tags) : '');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información del evento');
    }
  };

  const validateForm = () => {
    if (!name.trim() || name.length < 3) {
      Alert.alert('Error', 'El nombre debe tener al menos 3 caracteres');
      return false;
    }
    if (!description.trim() || description.length < 3) {
      Alert.alert('Error', 'La descripción debe tener al menos 3 caracteres');
      return false;
    }
    if (!startDate) {
      Alert.alert('Error', 'La fecha de inicio es requerida');
      return false;
    }
    if (!duration || parseInt(duration) <= 0) {
      Alert.alert('Error', 'La duración debe ser mayor a 0');
      return false;
    }
    if (!price || parseFloat(price) < 0) {
      Alert.alert('Error', 'El precio no puede ser negativo');
      return false;
    }
    if (!maxAssistance || parseInt(maxAssistance) <= 0) {
      Alert.alert('Error', 'La asistencia máxima debe ser mayor a 0');
      return false;
    }
    if (!selectedLocationId) {
      Alert.alert('Error', 'Debes seleccionar una ubicación');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const eventData = {
        name: name.trim(),
        description: description.trim(),
        start_date: startDate,
        duration_in_minutes: parseInt(duration),
        price: parseFloat(price),
        max_assistance: parseInt(maxAssistance),
        id_event_location: parseInt(selectedLocationId),
        tags: tags.trim() ? JSON.parse(tags) : [],
      };

      let result;
      if (isEditing && eventToEdit) {
        result = await updateEvent(eventToEdit.id, eventData);
        Alert.alert('Éxito', 'Evento actualizado correctamente');
      } else {
        result = await createEvent(eventData);
        Alert.alert('Éxito', 'Evento creado correctamente');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo procesar el evento');
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.formContainer}>
          <Text variant="headlineMedium" style={styles.title}>
            {isEditing ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </Text>

          <CustomInput
            label="Nombre del evento"
            value={name}
            onChangeText={setName}
            placeholder="Ingresa el nombre del evento"
          />

          <CustomInput
            label="Descripción"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe tu evento"
            multiline
            numberOfLines={3}
          />

          <CustomInput
            label="Fecha y hora de inicio"
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DDTHH:MM"
          />

          <CustomInput
            label="Duración (minutos)"
            value={duration}
            onChangeText={setDuration}
            placeholder="120"
            keyboardType="numeric"
          />

          <CustomInput
            label="Precio"
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            keyboardType="numeric"
          />

          <CustomInput
            label="Asistencia máxima"
            value={maxAssistance}
            onChangeText={setMaxAssistance}
            placeholder="100"
            keyboardType="numeric"
          />

          <View style={styles.locationContainer}>
            <Text style={styles.label}>Ubicación</Text>
            <View style={styles.locationButtons}>
              {locations.map((location) => (
                <Button
                  key={location.id}
                  mode={selectedLocationId === location.id.toString() ? 'contained' : 'outlined'}
                  onPress={() => setSelectedLocationId(location.id.toString())}
                  style={styles.locationButton}
                  textColor={selectedLocationId === location.id.toString() ? theme.colors.text : theme.colors.primary}
                >
                  {location.location.name}
                </Button>
              ))}
            </View>
            {locations.length === 0 && (
              <Text style={styles.noLocationsText}>
                No tienes ubicaciones creadas. Crea una ubicación primero.
              </Text>
            )}
          </View>

          <CustomInput
            label="Tags (opcional)"
            value={tags}
            onChangeText={setTags}
            placeholder='["conferencia", "tecnología"]'
            multiline
            numberOfLines={2}
          />

          <Divider style={styles.divider} />

          <View style={styles.buttonContainer}>
            <CustomButton
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              textColor={theme.colors.error}
            >
              Cancelar
            </CustomButton>
            
            <CustomButton
              onPress={handleSubmit}
              loading={loading}
              disabled={loading || locations.length === 0}
              style={styles.submitButton}
            >
              {loading ? 'Procesando...' : (isEditing ? 'Actualizar Evento' : 'Crear Evento')}
            </CustomButton>
          </View>

          {locations.length === 0 && (
            <Button
              mode="text"
              onPress={() => navigation.navigate('LocationForm')}
              style={styles.createLocationButton}
              textColor={theme.colors.primary}
            >
              Crear nueva ubicación
            </Button>
          )}
        </Surface>
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
  formContainer: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  title: {
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  locationContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
  locationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  locationButton: {
    marginBottom: theme.spacing.sm,
  },
  noLocationsText: {
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    marginTop: theme.spacing.sm,
  },
  divider: {
    marginVertical: theme.spacing.lg,
    backgroundColor: theme.colors.border,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  cancelButton: {
    borderColor: theme.colors.error,
    flex: 1,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    flex: 1,
  },
  createLocationButton: {
    marginTop: theme.spacing.md,
  },
});

export default EventFormScreen;