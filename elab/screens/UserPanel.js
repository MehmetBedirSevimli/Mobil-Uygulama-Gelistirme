import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

const UserPanel = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kullanıcı Paneli</Text>
      <Button
        mode="contained"
        onPress={() =>
          navigation.navigate('PastReports') // Burada PastReports ekranına geçiş yapılıyor
        }
        style={styles.button}
      >
        Geçmiş Tahliller
      </Button>
      <Button
        mode="contained"
        onPress={() =>
          navigation.navigate('SearchReports') // Tahlil Ara ekranına geçiş
        }
        style={styles.button}
      >
        Tahlil Ara
      </Button>
      <Button
        mode="contained"
        onPress={() =>
          navigation.navigate('Profile') // Profil Yönetimi ekranına geçiş
        }
        style={styles.button}
      >
        Profil Yönetimi
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#00796B',
    padding: 10,
    width: '80%',
  },
});

export default UserPanel;
