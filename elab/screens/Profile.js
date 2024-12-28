import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { auth, firestore } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

const Profile = () => {
  const [patientNumber, setPatientNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) {
        Alert.alert('Hata', 'Oturum açmış bir kullanıcı bulunamadı.');
        setLoading(false);
        return;
      }

      // E-posta ile hastayı al
      const patientsCollection = collection(firestore, 'patients');
      const q = query(patientsCollection, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Hata', 'E-posta adresinizle eşleşen bir hasta bulunamadı.');
        setLoading(false);
        return;
      }

      // Hasta bilgilerini al
      const patientData = querySnapshot.docs[0].data();
      setPatientNumber(patientData.patientNumber || '');
      setFirstName(patientData.firstName || '');
      setLastName(patientData.lastName || '');
      setEmail(patientData.email || '');
      setAge(patientData.age || '');
    } catch (error) {
      Alert.alert('Hata', 'Profil verileri yüklenirken bir sorun oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Hata', 'Ad ve soyad alanları boş bırakılamaz.');
      return;
    }

    setLoading(true);
    try {
      // Hasta numarası ile belge referansı oluştur
      const patientDocRef = doc(firestore, 'patients', patientNumber);

      // Güncelleme işlemi
      await updateDoc(patientDocRef, {
        firstName,
        lastName,
      });

      Alert.alert('Başarılı', 'Profil bilgileri güncellendi.');
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenirken bir sorun oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Yönetimi</Text>
      <TextInput
        style={styles.input}
        value={patientNumber}
        editable={false} // Hasta numarası değiştirilemez
        placeholder="Hasta Numarası"
      />
      <TextInput
        style={styles.input}
        value={age}
        editable={false} // Yaş değiştirilemez
        placeholder="Yaş"
      />
      <TextInput
        style={styles.input}
        value={email}
        editable={false} // E-posta değiştirilemez
        placeholder="E-posta"
      />
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Ad"
      />
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Soyad"
      />
      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Kaydet
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#80CBC4',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00796B',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#00796B',
    marginTop: 10,
  },
  buttonContent: {
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Profile;
