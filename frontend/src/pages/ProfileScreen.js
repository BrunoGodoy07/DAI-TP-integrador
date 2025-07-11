import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, Avatar, Button } from 'react-native-paper';
import CustomInput from '../components/CustomInput';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // //codigo del back: GET /api/user/me (o el endpoint que te den)
    // setProfile(response.data)
  }, []);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name);
      setLastName(profile.last_name);
      setUsername(profile.username);
    }
  }, [profile]);

  const handleSave = () => {
    // //codigo del back: PUT /api/user/me o similar
    setEditMode(false);
  };

  if (!profile) return <Text>Cargando...</Text>;

  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 16 }}>
      <Avatar.Text size={64} label={profile.first_name[0] + profile.last_name[0]} style={{ marginBottom: 16 }} />
      {editMode ? (
        <>
          <CustomInput label="Nombre" value={first_name} onChangeText={setFirstName} />
          <CustomInput label="Apellido" value={last_name} onChangeText={setLastName} />
          <CustomInput label="Email" value={username} onChangeText={setUsername} />
          <Button mode="contained" onPress={handleSave} style={{ marginTop: 8 }}>Guardar</Button>
        </>
      ) : (
        <>
          <Text variant="titleMedium">{profile.first_name} {profile.last_name}</Text>
          <Text>{profile.username}</Text>
          <Button mode="contained" onPress={() => setEditMode(true)} style={{ marginTop: 8 }}>Editar perfil</Button>
        </>
      )}
      <Button mode="outlined" style={{ marginTop: 16 }} onPress={() => {
        // Cerrar sesión (borrar token y navegar a Login)
      }}>Cerrar sesión</Button>
    </View>
  );
};

export default ProfileScreen;