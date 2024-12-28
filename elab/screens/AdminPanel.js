import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Avatar } from 'react-native-paper';

const AdminPanel = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Avatar.Icon size={100} icon="account-cog" style={styles.avatar} />
      <Text style={styles.title}>Admin Panel</Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('AddPatient')}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Hasta Ekle
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('AddReport')}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Tahlil Ekle
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('ListReport')}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Tahlil Listele
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Diagnosis')}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Tanı Koy
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('AddGuide')}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Kılavuz Ekle
      </Button>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#80CBC4', // Açık zümrüt yeşili arka plan
  },
  avatar: {
    backgroundColor: '#B71C1C', // Kırmızı avatar rengi
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#00796B', // Koyu zümrüt yeşili başlık
    fontFamily: 'fantasy', // Yazı fontu
  },
  button: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#00796B', // Buton rengi
  },
  buttonContent: {
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'fantasy',
  },
});

export default AdminPanel;
