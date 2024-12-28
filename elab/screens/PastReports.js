import { auth, firestore } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';

const ageGroupMinMax = {
  '0-1 Ay': {
    IgG: [49.2, 119.0],
    IgA: [0.5, 0.58],
    IgM: [1.73, 2.96],
    IgG1: [43.0, 89.7],
    IgG2: [8.7, 26.3],
    IgG3: [1.8, 7.8],
    IgG4: [1.7, 8.1],
  },
  '1-5 Ay': {
    IgG: [27.0, 79.2],
    IgA: [0.58, 5.8],
    IgM: [1.84, 14.5],
    IgG1: [16.0, 57.4],
    IgG2: [3.2, 10.8],
    IgG3: [1.3, 5.3],
    IgG4: [0.2, 4.8],
  },
  '6-8 Ay': {
    IgG: [26.8, 89.8],
    IgA: [0.58, 8.58],
    IgM: [2.64, 14.6],
    IgG1: [27.9, 82.0],
    IgG2: [3.6, 14.6],
    IgG3: [1.4, 10.0],
    IgG4: [0.2, 5.2],
  },
  '9-12 Ay': {
    IgG: [42.1, 110.0],
    IgA: [1.84, 15.4],
    IgM: [2.35, 18.0],
    IgG1: [32.8, 125.0],
    IgG2: [2.5, 16.1],
    IgG3: [1.8, 11.0],
    IgG4: [0.2, 2.0],
  },
  '13-24 Ay': {
    IgG: [36.5, 120.0],
    IgA: [1.15, 9.43],
    IgM: [2.56, 20.1],
    IgG1: [34.4, 143.5],
    IgG2: [3.1, 26.4],
    IgG3: [1.6, 13.2],
    IgG4: [0.2, 9.9],
  },
  '25-36 Ay': {
    IgG: [43.0, 129.0],
    IgA: [2.3, 13.0],
    IgM: [3.6, 19.9],
    IgG1: [34.0, 147.0],
    IgG2: [4.3, 38.0],
    IgG3: [1.4, 12.5],
    IgG4: [0.2, 17.1],
  },
  '37-48 Ay': {
    IgG: [53.9, 129.0],
    IgA: [4.07, 11.5],
    IgM: [2.61, 18.8],
    IgG1: [43.9, 133.3],
    IgG2: [6.0, 41.0],
    IgG3: [1.5, 12.0],
    IgG4: [0.4, 18.5],
  },
  '4-6 Yaş': {
    IgG: [52.8, 149.0],
    IgA: [2.3, 20.51],
    IgM: [3.33, 20.7],
    IgG1: [46.8, 133.3],
    IgG2: [8.5, 44.0],
    IgG3: [1.5, 10.7],
    IgG4: [0.8, 22.7],
  },
  '6-8 Yaş': {
    IgG: [52.7, 159.0],
    IgA: [3.61, 26.8],
    IgM: [3.05, 22.0],
    IgG1: [42.0, 147.0],
    IgG2: [6.7, 46.0],
    IgG3: [2.1, 18.6],
    IgG4: [0.2, 19.8],
  },
  '9-10 Yaş': {
    IgG: [64.6, 162.0],
    IgA: [5.4, 26.8],
    IgM: [3.37, 25.7],
    IgG1: [38.0, 184.0],
    IgG2: [7.0, 54.3],
    IgG3: [2.0, 18.6],
    IgG4: [0.5, 20.2],
  },
  '11-12 Yaş': {
    IgG: [57.9, 161.0],
    IgA: [2.7, 19.8],
    IgM: [3.0, 18.7],
    IgG1: [59.9, 156.0],
    IgG2: [11.1, 51.5],
    IgG3: [2.9, 20.0],
    IgG4: [0.4, 16.0],
  },
  '13-14 Yaş': {
    IgG: [74.1, 165.0],
    IgA: [5.24, 22.5],
    IgM: [4.4, 20.6],
    IgG1: [49.0, 156.0],
    IgG2: [10.0, 57.3],
    IgG3: [2.8, 22.3],
    IgG4: [1.0, 14.4],
  },
  '15-16 Yaş': {
    IgG: [66.6, 137.0],
    IgA: [4.8, 15.8],
    IgM: [3.3, 20.5],
    IgG1: [49.8, 146.0],
    IgG2: [11.0, 39.8],
    IgG3: [3.0, 12.0],
    IgG4: [0.9, 18.7],
  },
  '16+ Yaş': {
    IgG: [83.0, 182.0],
    IgA: [4.65, 22.1],
    IgM: [7.5, 19.85],
    IgG1: [52.8, 138.4],
    IgG2: [14.7, 61.0],
    IgG3: [2.1, 15.2],
    IgG4: [1.5, 20.2],
  },
};


const PastReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ageGroup, setAgeGroup] = useState('');

  useEffect(() => {
    fetchPatientReports();
  }, []);

  const fetchPatientReports = async () => {
    setLoading(true);
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) {
        Alert.alert('Hata', 'Oturum açmış bir kullanıcı bulunamadı.');
        setLoading(false);
        return;
      }

      const patientsRef = collection(firestore, 'patients');
      const q = query(patientsRef, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Hata', 'E-posta adresinizle eşleşen bir hasta bulunamadı.');
        setLoading(false);
        return;
      }

      const patientData = querySnapshot.docs[0].data();
      setAgeGroup(patientData.age);
      const patientNumber = patientData.patientNumber;

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

  const checkTestResults = (testName, value) => {
    if (!ageGroup || !value) return { status: 'Bilinmiyor', color: 'gray', range: '' };

    const [min, max] = ageGroupMinMax[ageGroup]?.[testName] || [null, null];
    if (min === null || max === null) return { status: 'Bilinmiyor', color: 'gray', range: '' };

    if (value < min) return { status: 'Düşük', color: 'red', range: `${min} - ${max}` };
    if (value > max) return { status: 'Yüksek', color: 'green', range: `${min} - ${max}` };
    return { status: 'Normal', color: 'blue', range: `${min} - ${max}` };
  };

  const renderReport = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`Tarih: ${new Date(item.date).toLocaleDateString()}`}
        left={(props) => <Avatar.Icon {...props} icon="file-document" style={styles.avatar} />}
      />
      <Card.Content>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Tahlil</Text>
            <Text style={styles.tableHeaderCell}>Değer</Text>
            <Text style={styles.tableHeaderCell}>Durum</Text>
            <Text style={styles.tableHeaderCell}>Aralık</Text>
          </View>
          {['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'].map((test) => {
            const result = checkTestResults(test, item[test]);
            return (
              <View key={test} style={styles.tableRow}>
                <Text style={styles.tableCell}>{test}</Text>
                <Text style={[styles.tableCell, { color: result.color }]}>{item[test] ?? 'Boş'}</Text>
                <Text style={[styles.tableCell, { color: result.color }]}>{result.status}</Text>
                <Text style={styles.tableCell}>{result.range}</Text>
              </View>
            );
          })}
        </View>
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
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default PastReports;