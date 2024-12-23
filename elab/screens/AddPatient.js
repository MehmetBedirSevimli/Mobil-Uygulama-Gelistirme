import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button , Avatar} from 'react-native-paper';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const AddPatient = () => {
  const [patientNumber, setPatientNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(''); // Yeni state

  const handleAddPatient = async () => {
    if (!patientNumber || !firstName || !lastName || !email || !age) {
      Alert.alert('Hata', 'Tüm alanları doldurun.');
      return;
    }

    try {
      // Hasta numarasının benzersizliğini kontrol et
      const patientDocRef = doc(firestore, 'patients', patientNumber);
      const patientDoc = await getDoc(patientDocRef);
      if (patientDoc.exists()) {
        Alert.alert('Hata', 'Bu hasta numarası zaten kayıtlı.');
        return;
      }

      // Firestore'a hasta bilgilerini ekle
      await setDoc(patientDocRef, {
        patientNumber,
        firstName,
        lastName,
        email,
        age, // Yaşı ekle
      });

      Alert.alert('Başarılı', 'Hasta bilgileri başarıyla kaydedildi.');
      // Formu temizle
      setPatientNumber('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setAge(''); // Yaşı sıfırla
    } catch (error) {
      console.error('Hata:', error.message);
      Alert.alert('Hata', 'Hasta bilgileri eklenirken bir sorun oluştu: ' + error.message);
    }
  };

  return (
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
      <TextInput
        mode="outlined"
        label="Yaş"
        value={age}
        onChangeText={setAge}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button
        mode="contained"
        onPress={handleAddPatient}
        style={styles.button}
      >
        Hasta Ekle
      </Button>
    </View>
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
  iconContainer:{
    justifyContent: 'center',
    alignItems:'center',

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
  button: {
    marginTop: 20,
    backgroundColor: '#00796B',
  },
});

export default AddPatient;
