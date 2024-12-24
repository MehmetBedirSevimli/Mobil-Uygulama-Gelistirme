import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, Button } from 'react-native-paper';

const Profile = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Avatar.Icon size={100} icon="account" style={styles.avatar} />
      <Text style={styles.username}>Hoşgeldiniz, Kullanıcı</Text>
      <Button mode="contained" onPress={() => navigation.navigate('ChangePassword')} style={styles.button}>
        Şifre Değiştir
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('EditProfile')} style={styles.button}>
        Profil Bilgilerini Düzenle
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#80CBC4',
  },
  avatar: {
    backgroundColor: '#00796B',
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    fontFamily: 'fantasy',
  },
  button: {
    marginVertical: 10,
    width: '80%',
    backgroundColor: '#B71C1C',
  },
});

export default Profile;
