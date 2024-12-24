import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Card, Text, Avatar } from 'react-native-paper';

const SearchReports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const sampleReports = [
    { id: '1', name: 'Kan Tahlili', status: 'high' },
    { id: '2', name: 'Şeker Testi', status: 'normal' },
    { id: '3', name: 'Kolesterol Testi', status: 'low' },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      setResults(sampleReports.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())));
    } else {
      setResults([]);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.name}
        left={(props) => <Avatar.Icon {...props} icon="magnify" style={styles.avatar} />}
        right={() => <Text style={[styles.status, { color: item.status === 'high' ? '#B71C1C' : item.status === 'low' ? '#FF8C00' : '#00796B' }]}>{item.status === 'high' ? '↑' : item.status === 'low' ? '↓' : '↔'}</Text>}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Tahlil Ara"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#80CBC4',
    padding: 10,
  },
  searchbar: {
    marginVertical: 10,
  },
  card: {
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  avatar: {
    backgroundColor: '#00796B',
  },
  status: {
    fontSize: 18,
    marginRight: 10,
  },
});

export default SearchReports;
