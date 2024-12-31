import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Avatar, TextInput, Button, Provider } from 'react-native-paper';
import { auth, firestore } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const SearchReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReportsByTestName = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Hata', 'Lütfen bir tahlil adı girin.');
      return;
    }

    setLoading(true);
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) {
        Alert.alert('Hata', 'Oturum açmış bir kullanıcı bulunamadı.');
        setLoading(false);
        return;
      }

      // Kullanıcı bilgilerini al
      const patientsRef = collection(firestore, 'patients');
      const patientQuery = query(patientsRef, where('email', '==', userEmail));
      const patientSnapshot = await getDocs(patientQuery);

      if (patientSnapshot.empty) {
        Alert.alert('Hata', 'E-posta adresinizle eşleşen bir hasta bulunamadı.');
        setLoading(false);
        return;
      }

      const patient = patientSnapshot.docs[0].data();
      const patientNumber = patient.patientNumber;

      // Raporları al (tahlil adına göre)
      const reportsRef = collection(firestore, 'patients', patientNumber, 'reports');
      const reportsQuery = query(reportsRef, orderBy('testRequestTime', 'desc'));
      const reportsSnapshot = await getDocs(reportsQuery);

      const reportsList = reportsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          testRequestTime: data.testRequestTime ? data.testRequestTime.toDate() : null, // Tarih objesine çevir
        };
      });

      // Sadece girilen tahlil adına sahip raporları filtrele
      const filteredReports = reportsList.filter(
        (report) => report[searchQuery] !== undefined && report[searchQuery] !== null
      );

      if (filteredReports.length === 0) {
        Alert.alert('Bilgi', 'Girilen tahlil adına ait geçmiş rapor bulunamadı.');
      }

      setReports(filteredReports);
    } catch (error) {
      console.error('Hata:', error.message);
      Alert.alert('Hata', 'Raporlar alınırken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (current, previous) => {
    if (previous === undefined || previous === null || current === undefined || current === null)
      return null;
    if (current > previous) return { icon: '↑', color: 'green' };
    if (current < previous) return { icon: '↓', color: 'red' };
    return { icon: '↔', color: 'blue' };
  };

  const renderReportCard = ({ item, index }) => {
    const previousReport = index < reports.length - 1 ? reports[index + 1] : null; // Bir önceki raporu al
    const trend =
      previousReport && previousReport[searchQuery] !== undefined
        ? getTrendIcon(item[searchQuery], previousReport[searchQuery])
        : null;

    return (
      <Card style={styles.card}>
        <Card.Title
          title={`Rapor Tarihi: ${
            item.testRequestTime
              ? new Date(item.testRequestTime).toLocaleDateString()
              : 'Tarih Yok'
          }`}
          left={(props) => <Avatar.Icon {...props} icon="file-document" style={styles.avatar} />}
        />
        <Card.Content>
          <Text style={styles.testValue}>
            {searchQuery}: {item[searchQuery] ?? 'Boş'}
          </Text>
          {trend && (
            <Text style={{ color: trend.color, fontWeight: 'bold', fontSize: 16 }}>
              {trend.icon}
            </Text>
          )}
          <Text>Numune Türü: {item.sampleType}</Text>
          <Text>Rapor Grubu: {item.reportGroup}</Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Tahlil Arama</Text>
        <TextInput
          label="Tahlil Adı"
          mode="outlined"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
          placeholder="Örn: IgA"
        />
        <Button mode="contained" onPress={fetchReportsByTestName} style={styles.button}>
          Ara
        </Button>

        {loading ? (
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        ) : reports.length > 0 ? (
          <FlatList
            data={reports}
            renderItem={renderReportCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        ) : (
          <Text style={styles.noDataText}>Henüz bir arama yapılmadı.</Text>
        )}
      </View>
    </Provider>
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
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#00796B',
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
  testValue: {
    fontSize: 16,
    color: '#00796B',
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#00796B',
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#B71C1C',
    marginTop: 20,
  },
});

export default SearchReports;

