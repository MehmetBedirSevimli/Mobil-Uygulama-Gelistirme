import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { TextInput, Button, Avatar } from "react-native-paper";
import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";

const AddGuide = () => {
  const [guideName, setGuideName] = useState(""); // Kılavuz adı
  const [igValues, setIgValues] = useState({
    IgA: {
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
    },
  });

  const handleInputChange = (field, value) => {
    setIgValues((prevState) => ({
      ...prevState,
      IgA: { ...prevState.IgA, [field]: value },
    }));
  };

  const handleAddGuide = async () => {
    if (!guideName.trim()) {
      Alert.alert("Hata", "Lütfen kılavuz adını doldurun.");
      return;
    }

    const guideData = {
      name: guideName.trim(),
      values: {
        IgA: {
          maxGeoMean: Number(igValues.IgA.maxGeoMean) || null,
          max: Number(igValues.IgA.max) || null,
          maxConfidence: Number(igValues.IgA.maxConfidence) || null,
          maxMean: Number(igValues.IgA.maxMean) || null,
          min: Number(igValues.IgA.min) || null,
          minConfidence: Number(igValues.IgA.minConfidence) || null,
          minGeoMean: Number(igValues.IgA.minGeoMean) || null,
          minMean: Number(igValues.IgA.minMean) || null,
          yasMax: Number(igValues.IgA.yasMax) || null,
          yasMin: Number(igValues.IgA.yasMin) || null,
          cinsiyet: igValues.IgA.cinsiyet || "Her İkisi",
        },
      },
    };

    console.log("Guide Data to Firestore:", guideData);

    try {
      const guidesCollection = collection(firestore, "guides");
      const guideRef = doc(guidesCollection, guideName.trim());
      await setDoc(guideRef, guideData);

      Alert.alert("Başarılı", "Kılavuz başarıyla kaydedildi.");
      setGuideName(""); // Form sıfırlama
      setIgValues({
        IgA: {
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
        },
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
        <View style={styles.card}>
          <TextInput
            mode="outlined"
            label="Max GeoMean"
            value={igValues.IgA.maxGeoMean}
            onChangeText={(value) => handleInputChange("maxGeoMean", value)}
            style={styles.input}
            keyboardType="numeric"
          />
          {/* Diğer alanlar aynı şekilde devam eder */}
        </View>
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
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
  },
  avatar: {
    backgroundColor: "#B71C1C",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  card: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#00796B",
  },
});

export default AddGuide;
