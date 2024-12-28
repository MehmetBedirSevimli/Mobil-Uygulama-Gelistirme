import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
} from "react-native";
import { TextInput, Button, Avatar } from "react-native-paper";
import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";

const AddGuide = () => {
  const [guideName, setGuideName] = useState(""); // Kılavuz adı
  const initialIgValues = {
    maxGeoMean: "",
    max: "",
    maxConfidence: "",
    maxMean: "",
    min: "",
    minConfidence: "",
    minGeoMean: "",
    minMean: "",
    yasMax: "",
    yasMin: "",
    cinsiyet: "",
  };
  const [igValues, setIgValues] = useState({
    IgA: { ...initialIgValues },
    IgM: { ...initialIgValues },
    IgG: { ...initialIgValues },
    IgG1: { ...initialIgValues },
    IgG2: { ...initialIgValues },
    IgG3: { ...initialIgValues },
    IgG4: { ...initialIgValues },
  });

  const handleInputChange = (igKey, field, value) => {
    setIgValues((prevState) => ({
      ...prevState,
      [igKey]: { ...prevState[igKey], [field]: value },
    }));
  };

  const handleAddGuide = async () => {
    if (!guideName.trim()) {
      Alert.alert("Hata", "Lütfen kılavuz adını doldurun.");
      return;
    }

    const guideData = {
      name: guideName.trim(),
      values: Object.fromEntries(
        Object.entries(igValues).map(([key, values]) => [
          key,
          Object.fromEntries(
            Object.entries(values).map(([field, value]) => [
              field,
              value === "" ? null : Number(value) || value,
            ])
          ),
        ])
      ),
    };

    console.log("Guide Data to Firestore:", guideData);

    try {
      const guidesCollection = collection(firestore, "guides");
      const guideRef = doc(guidesCollection, guideName.trim());
      await setDoc(guideRef, guideData);

      Alert.alert("Başarılı", "Kılavuz başarıyla kaydedildi.");
      setGuideName(""); // Form sıfırlama
      setIgValues({
        IgA: { ...initialIgValues },
        IgM: { ...initialIgValues },
        IgG: { ...initialIgValues },
        IgG1: { ...initialIgValues },
        IgG2: { ...initialIgValues },
        IgG3: { ...initialIgValues },
        IgG4: { ...initialIgValues },
      });
    } catch (error) {
      console.error("Hata:", error.message);
      Alert.alert("Hata", "Kılavuz eklenirken bir sorun oluştu: " + error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <Avatar.Icon size={100} icon="book-plus" style={styles.avatar} />
        </View>
        <TextInput
          mode="outlined"
          label="Kılavuz Adı"
          value={guideName}
          onChangeText={setGuideName}
          style={styles.input}
        />
        {Object.keys(igValues).map((igKey) => (
          <View key={igKey} style={styles.card}>
            <Text style={styles.igHeader}>{igKey}</Text>
            <TextInput
              mode="outlined"
              label="Yas Min"
              value={igValues[igKey].yasMin}
              onChangeText={(value) => handleInputChange(igKey, "yasMin", value)}
              style={styles.input}
              keyboardType="numeric"
            />
            
            <TextInput
              mode="outlined"
              label="Yas Max"
              value={igValues[igKey].yasMax}
              onChangeText={(value) => handleInputChange(igKey, "yasMax", value)}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              mode="outlined"
              label="Min GeoMean"
              value={igValues[igKey].minGeoMean}
              onChangeText={(value) => handleInputChange(igKey, "minGeoMean", value)}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              mode="outlined"
              label="Max GeoMean"
              value={igValues[igKey].maxGeoMean}
              onChangeText={(value) => handleInputChange(igKey, "maxGeoMean", value)}
              style={styles.input}
              keyboardType="numeric"
            />
             
            <TextInput
              mode="outlined"
              label="Min Mean"
              value={igValues[igKey].minMean}
              onChangeText={(value) => handleInputChange(igKey, "minMean", value)}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              mode="outlined"
              label="Max Mean"
              value={igValues[igKey].maxMean}
              onChangeText={(value) => handleInputChange(igKey, "maxMean", value)}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              mode="outlined"
              label="Min"
              value={igValues[igKey].min}
              onChangeText={(value) => handleInputChange(igKey, "min", value)}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              mode="outlined"
              label="Max"
              value={igValues[igKey].max}
              onChangeText={(value) => handleInputChange(igKey, "max", value)}
              style={styles.input}
              keyboardType="numeric"
            />
           
           
          <TextInput
              mode="outlined"
              label="Min Confidence"
              value={igValues[igKey].minConfidence}
              onChangeText={(value) =>
                handleInputChange(igKey, "minConfidence", value)
              }
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              mode="outlined"
              label="Max Confidence"
              value={igValues[igKey].maxConfidence}
              onChangeText={(value) =>
                handleInputChange(igKey, "maxConfidence", value)
              }
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              mode="outlined"
              label="Cinsiyet"
              value={igValues[igKey].cinsiyet}
              onChangeText={(value) => handleInputChange(igKey, "cinsiyet", value)}
              style={styles.input}
            />
          </View>
        ))}
        <Button mode="contained" onPress={handleAddGuide} style={styles.button}>
          Kılavuz Ekle
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#80CBC4", // Sayfa arka plan rengi
  },
  scrollContent: {
    padding: 20,
  },
  avatar: {
    backgroundColor: "#B71C1C", // Avatar arka plan rengi
    marginBottom: 20,
    alignSelf: "center", // Avatarı ortalamak için
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff", // Form alanı arka planı
  },
  card: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff", // Kart arka planı
    borderWidth: 1,
    borderColor: "#B71C1C", // Kart kenar rengi
    borderRadius: 5,
  },
  igHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#00796B", // Başlık rengi
    textAlign: "center", // Başlığı ortalamak için
  },
  button: {
    backgroundColor: "#00796B", // Buton rengi
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff", // Buton metin rengi
    textAlign: "center",
  },
});


export default AddGuide;

