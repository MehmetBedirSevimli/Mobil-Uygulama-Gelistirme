import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Avatar, Menu, Divider, Provider } from 'react-native-paper';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const AddPatient = () => {
  const [patientNumber, setPatientNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(''); // Yaş durumu
  const [menuVisible, setMenuVisible] = useState(false); // Menü görünürlüğü kontrolü

  const ageOptions = [
    '0-1 Ay',
    '1-5 Ay',
    '6-8 Ay',
    '9-12 Ay',
    '13-24 Ay',
    '25-36 Ay',
    '37-48 Ay',
    '4-6 Yaş',
    '6-8 Yaş',
    '9-10 Yaş',
    '11-12 Yaş',
    '13-14 Yaş',
    '15-16 Yaş',
    '16+ Yaş',
  ];

  const handleAddPatient = async () => {
    if (!patientNumber || !firstName || !lastName || !email || !age) {
      Alert.alert('Hata', 'Tüm alanları doldurun.');
      return;
    }

    try {
      const patientDocRef = doc(firestore, 'patients', patientNumber);
      const patientDoc = await getDoc(patientDocRef);
      if (patientDoc.exists()) {
        Alert.alert('Hata', 'Bu hasta numarası zaten kayıtlı.');
        return;
      }

      await setDoc(patientDocRef, {
        patientNumber,
        firstName,
        lastName,
        email,
        age,
      });

      Alert.alert('Başarılı', 'Hasta bilgileri başarıyla kaydedildi.');
      setPatientNumber('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setAge('');
    } catch (error) {
      console.error('Hata:', error.message);
      Alert.alert('Hata', 'Hasta bilgileri eklenirken bir sorun oluştu: ' + error.message);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Avatar.Icon size={100} icon="account-plus" style={styles.avatar} />
        </View>
        <Text style={styles.title}>Hasta Ekle</Text>
        <TextInput
          mode="outlined"
          label="Hasta Numarası"
          value={patientNumber}
          onChangeText={setPatientNumber}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          mode="outlined"
          label="Ad"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="Soyad"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        <View style={styles.menuContainer}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.dropdown}
              >
                {age || 'Yaş Seçin'}
              </Button>
            }
          >
            {ageOptions.map((option, index) => (
              <Menu.Item
                key={index}
                onPress={() => {
                  setAge(option);
                  setMenuVisible(false);
                }}
                title={option}
              />
            ))}
          </Menu>
        </View>
        <Button
          mode="contained"
          onPress={handleAddPatient}
          style={styles.button}
        >
          Hasta Ekle
        </Button>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#80CBC4',
    justifyContent: 'center',
  },
  avatar: {
    backgroundColor: '#B71C1C',
    marginBottom: 20,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#00796B',
  },
  input: {
    marginBottom: 15,
  },
  menuContainer: {
    marginBottom: 15,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#00796B',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#00796B',
  },
});

export default AddPatient;
