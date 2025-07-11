import React from 'react';
import { Avatar } from 'react-native-paper';

const UserAvatar = ({ firstName = '', lastName = '' }) => {
  const label =
    (firstName ? firstName[0] : '') +
    (lastName ? lastName[0] : '');
  return <Avatar.Text size={36} label={label.toUpperCase()} />;
};

export default UserAvatar;