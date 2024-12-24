import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';

// Örnek tahlil verileri
const sampleReports = [
  { id: '1', name: 'Kan Testi', date: '2024-12-20', status: 'düşük' },
  { id: '2', name: 'Şeker Testi', date: '2024-12-15', status: 'normal' },
  { id: '3', name: 'Kolesterol Testi', date: '2024-12-10', status: 'yüksek' },
];

const PastReports = () => {
  // Tahlil durumlarına göre renk seçimi
  const getStatusColor = (status) => {
    switch (status) {
      case 'düşük':
        return '#00796B'; // Koyu zümrüt yeşili
      case 'normal':
        return '#80CBC4'; // Açık zümrüt yeşili
      case 'yüksek':
        return '#B71C1C'; // Kırmızı
      default:
        return '#9e9e9e'; // Varsayılan gri
    }
  };

  const renderReport = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.name}
        subtitle={`Tarih: ${item.date}`}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon="file-document"
            style={[styles.avatar, { backgroundColor: getStatusColor(item.status) }]}
          />
        )}
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardSubtitle}
      />
      <Card.Content>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          Durum: {item.status.toUpperCase()}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geçmiş Tahliller</Text>
      <FlatList
        data={sampleReports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#80CBC4', // Açık zümrüt yeşili arka plan
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00796B', // Koyu zümrüt yeşili başlık
    fontFamily: 'fantasy', // Yazı fontu
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 4, // Gölgeler için
  },
  avatar: {
    backgroundColor: '#00796B', // Varsayılan avatar rengi
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'fantasy', // Yazı fontu
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#9e9e9e', // Gri alt başlık
    fontFamily: 'fantasy', // Yazı fontu
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    fontFamily: 'fantasy', // Yazı fontu
  },
});

export default PastReports;
