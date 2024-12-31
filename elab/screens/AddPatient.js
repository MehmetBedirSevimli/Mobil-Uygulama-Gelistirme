import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Avatar, Menu, Divider, Provider } from 'react-native-paper';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddPatient = () => {
  const [patientNumber, setPatientNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(null); // Doğum Tarihi
  const [gender, setGender] = useState(''); // Cinsiyet
  const [menuVisible, setMenuVisible] = useState(false); // Menü görünürlüğü kontrolü
  const [showDatePicker, setShowDatePicker] = useState(false);

  const genderOptions = ['Erkek', 'Kadın'];

  const calculateTotalMonths = (birthDate) => {
    const now = new Date();
    const birth = new Date(birthDate);

    // Yıl ve ay farkını hesaplarken
    const yearsDifference = now.getFullYear() - birth.getFullYear();
    const monthsDifference = now.getMonth() - birth.getMonth();

    // Toplam ayları hesapla
    const totalMonths = yearsDifference * 12 + monthsDifference;

    return totalMonths;
  };

  const handleAddPatient = async () => {
    if (!patientNumber || !firstName || !lastName || !email || !birthDate || !gender) {
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

      const totalMonths = calculateTotalMonths(birthDate);

      await setDoc(patientDocRef, {
        patientNumber,
        firstName,
        lastName,
        email,
        birthDate: birthDate.toISOString(),
        gender,
        age: totalMonths, // Toplam ay olarak kaydediliyor
      });

      Alert.alert('Başarılı', 'Hasta bilgileri başarıyla kaydedildi.');
      setPatientNumber('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setBirthDate(null);
      setGender('');
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
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.input}
        >
          {birthDate ? birthDate.toDateString() : 'Doğum Tarihi Seçin'}
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={birthDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setBirthDate(selectedDate);
            }}
          />
        )}
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
                {gender || 'Cinsiyet Seçin'}
              </Button>
            }
          >
            {genderOptions.map((option, index) => (
              <Menu.Item
                key={index}
                onPress={() => {
                  setGender(option);
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
