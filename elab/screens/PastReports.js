import { auth, firestore } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';

const PastReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatientReports();
  }, []);

  const fetchPatientReports = async () => {
    setLoading(true);
    try {
      // Giriş yapan kullanıcının e-posta adresini al
      const userEmail = auth.currentUser?.email;
      if (!userEmail) {
        Alert.alert('Hata', 'Oturum açmış bir kullanıcı bulunamadı.');
        setLoading(false);
        return;
      }

      // Hastanın e-posta adresine göre hasta bilgilerini al
      const patientsRef = collection(firestore, 'patients');
      const q = query(patientsRef, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Hata', 'E-posta adresinizle eşleşen bir hasta bulunamadı.');
        setLoading(false);
        return;
      }

      // Hasta numarasını al
      const patientData = querySnapshot.docs[0].data();
      const patientNumber = patientData.patientNumber;

      // Hasta numarasına bağlı tahlilleri getir
      const reportsRef = collection(firestore, 'patients', patientNumber, 'reports');
      const reportsQuery = query(reportsRef, orderBy('date', 'desc'));
      const reportsSnapshot = await getDocs(reportsQuery);

      const reportsList = reportsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReports(reportsList);
    } catch (error) {
      console.error('Hata:', error.message);
      Alert.alert('Hata', 'Tahlil bilgileri alınırken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const renderReport = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`Tarih: ${new Date(item.date).toLocaleDateString()}`}
        subtitle={`Durum: ${item.status || 'Bilinmiyor'}`}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon="file-document"
            style={styles.avatar}
          />
        )}
      />
      <Card.Content>
        <Text>IgA: {item.IgA ?? 'Boş'}</Text>
        <Text>IgM: {item.IgM ?? 'Boş'}</Text>
        <Text>IgG: {item.IgG ?? 'Boş'}</Text>
        <Text>IgG1: {item.IgG1 ?? 'Boş'}</Text>
        <Text>IgG2: {item.IgG2 ?? 'Boş'}</Text>
        <Text>IgG3: {item.IgG3 ?? 'Boş'}</Text>
        <Text>IgG4: {item.IgG4 ?? 'Boş'}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geçmiş Tahliller</Text>
      {loading ? (
        <Text>Yükleniyor...</Text>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReport}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
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
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
  },
  avatar: {
    backgroundColor: '#00796B',
  },
});

export default PastReports;
