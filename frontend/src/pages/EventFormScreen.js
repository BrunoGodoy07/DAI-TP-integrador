import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const EventFormScreen = ({ route, navigation }) => {
  const event = route.params?.event;
  const [name, setName] = useState(event?.name || '');
  const [description, setDescription] = useState(event?.description || '');
  // ...otros campos...

  const handleSubmit = () => {
    if (event) {
      // //codigo del back: PUT /api/event/
    } else {
      // //codigo del back: POST /api/event/
    }
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <CustomInput label="Nombre" value={name} onChangeText={setName} />
      <CustomInput label="Descripción" value={description} onChangeText={setDescription} multiline />
      {/* Otros campos: fecha, duración, precio, ubicación, tags, etc */}
      <CustomButton onPress={handleSubmit}>{event ? 'Actualizar' : 'Crear'}</CustomButton>
    </ScrollView>
  );
};

export default EventFormScreen;