import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Alert,
  StyleSheet,
  Button,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { XMLParser } from "fast-xml-parser";
import FormComponent from "../components/FormComponent";
import { useNavigation } from "@react-navigation/native";

const PredefinedFormScreen = () => {
  const navigation = useNavigation(); 
  const [formContent, setFormContent] = useState(null);
  const [userInput, setUserInput] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    signature: null,
  });
  const [parsedForm, setParsedForm] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    const readBundledFile = async () => {
      try {
        const asset = Asset.fromModule(require("../assets/form.xml"));
        await asset.downloadAsync();
        const content = await FileSystem.readAsStringAsync(asset.localUri);
        setFormContent(content);
      } catch (error) {
        Alert.alert("Error", "Unable to read the XML file");
        console.error("Error reading the bundled XML file:", error);
      }
    };

    readBundledFile();
  }, []);

  const isSubmitEnabled = () => {
    if (!parsedForm?.Form?.Field) return false;

    return parsedForm.Form.Field.every(
      (field) =>
        userInput[field.label] !== undefined &&
        userInput[field.label] !== null &&
        userInput[field.label].toString().trim() !== ""
    );
  };

  const parseXML = (xmlString) => {
    try {
      const parser = new XMLParser();
      const result = parser.parse(xmlString);
      console.log("Raw parsed XML:", JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error("Error parsing XML:", error);
      Alert.alert("Error", "Unable to parse the XML content");
    }
  };

  // Update parsedForm when formContent is updated
  useEffect(() => {
    if (formContent) {
      const parsedData = parseXML(formContent);

      if (
        parsedData &&
        parsedData.Form &&
        Array.isArray(parsedData.Form.Field)
      ) {
        const formattedFields = parsedData.Form.Field.map((field, index) => {
          let options = null;

          if (
            field.Type === "radio" &&
            field.Options &&
            Array.isArray(field.Options.Option)
          ) {
            // Map the options directly as an array of strings
            options = field.Options.Option.map((option) => ({
              label: option, // Use the string directly as the label
              value: option, // Use the same string for the value
            }));
          }

          return {
            id: index,
            type: field.Type,
            label: field.Label,
            options: options,
          };
        });

        setParsedForm({
          ...parsedData,
          Form: { ...parsedData.Form, Field: formattedFields },
        });
      } else {
        console.error("Unexpected parsed data structure:", parsedData);
      }
    }
  }, [formContent]);

  const handleInputChange = (key, value) => {
    console.log("Input Change:", key, value);
    setUserInput((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    console.log("Current userInput:", userInput);
  }, [userInput]);

  useEffect(() => {
    console.log("Is Submit Enabled:", isSubmitEnabled());
  }, [userInput, parsedForm]);

  console.log("userInput", userInput);
  

  return (
    <ScrollView style={styles.container}>
      {parsedForm ? (
        <>
          <FormComponent
            xmlContent={parsedForm}
            onInputChange={handleInputChange}
            isFormSubmitted={isFormSubmitted}
            disabled={isFormSubmitted}
            userInput={userInput}
          />
        </>
      ) : (
        <Text>Loading form...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  resultHeader: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  fieldContainer: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  fieldValueContainer: {
    marginTop: 5,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  fieldValue: {
    fontSize: 16,
    color: "#444",
  },
});

export default PredefinedFormScreen;
