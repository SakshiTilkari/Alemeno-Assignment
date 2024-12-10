import React, { useState, useEffect, useRef  } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import SignatureComponent from "./SignatureComponent";
import DatePickerModal from "./DatePickerModal";
import { useNavigation } from "@react-navigation/native";

const FormComponent = ({
  xmlContent,
  onInputChange,
  userInput,
  isFormSubmitted,
}) => {
  const [date, setDate] = useState(userInput.dateOfBirth || null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [signature, setSignature] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const navigation = useNavigation();
  const signatureRef = useRef();

  useEffect(() => {
    const allFieldsFilled = xmlContent.Form.Field.every((field) => {
      if (field.type === "text") {
        return !!formData[field.label];
      } else if (field.type === "datetime") {
        return !!date;
      } else if (field.type === "radio") {
        return !!selectedOptions[field.label];
      } 
      return true;
    });

    setIsSubmitEnabled(allFieldsFilled);
  }, [formData, date, selectedOptions, signature, xmlContent]);

  const handleInputChange = (fieldId, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldId]: value,
    }));
  };

  const handleOptionSelect = (fieldLabel, selectedOption) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [fieldLabel]: selectedOption,
    }));
    handleInputChange(fieldLabel, selectedOption.value || selectedOption);
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    handleInputChange("dateOfBirth", selectedDate);
  };

  const handleTextChange = (fieldLabel, value) => {
    handleInputChange(fieldLabel, value);
  };

  const handleSubmit = () => {
    if (isSubmitEnabled) {
      console.log("Form data submitted:", formData);
      onInputChange(formData); 
      navigation.navigate("UserProvidedForm", {formData});
    }
  };

  if (!xmlContent || !xmlContent.Form || !xmlContent.Form.Field) {
    return <Text>No form data available.</Text>;
  }

  return (
    <View style={{ padding: 20, backgroundColor: "white" }}>
      {xmlContent.Form.Field.map((field, index) => {
        if (field.type === "text") {
          return (
            <View key={index} style={{ marginBottom: 15 }}>
              <Text style={{ marginBottom: 5 }}>{field.label}</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  padding: 10,
                  fontSize: 16,
                }}
                placeholder={`Enter ${field.label}`}
                value={formData[field.label] || ""}
                onChangeText={(value) => handleTextChange(field.label, value)}
                editable={!isFormSubmitted}
              />
            </View>
          );
        } else if (field.type === "datetime") {
          return (
            <View key={index} style={{ marginBottom: 15 }}>
              <Text style={{ marginBottom: 5 }}>{field.label}</Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  padding: 10,
                  justifyContent: "center",
                }}
                onPress={() => !isFormSubmitted && setShowDatePicker(true)}
                disabled={isFormSubmitted}
              >
                <Text style={{ fontSize: 16 }}>
                  {date ? date.toLocaleDateString() : "Select a date"}
                </Text>
              </TouchableOpacity>

              <DatePickerModal
                isVisible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onDateChange={handleDateChange}
              />
            </View>
          );
        } else if (field.type === "radio") {
          return (
            <View key={index} style={{ marginBottom: 15 }}>
              <Text style={{ marginBottom: 5 }}>{field.label}</Text>
              {field.options.map((option, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.optionContainer,
                    selectedOptions[field.label]?.value === option.value
                      ? styles.selectedOption
                      : styles.defaultOption,
                    isFormSubmitted && styles.disabledOption,
                  ]}
                  onPress={() =>
                    !isFormSubmitted && handleOptionSelect(field.label, option)
                  }
                  disabled={isFormSubmitted}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedOptions[field.label]?.value === option.value &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {option.label || option.value || option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        } else if (field.type === "drawing") {
          return (
            <View key={index} style={{ marginBottom: 15 }}>
              <Text style={{ marginBottom: 5 }}>{field.label}</Text>
              <SignatureComponent onSignatureCaptured={setSignature} />
            </View>
          );
        }
        return null;
      })}
      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: isSubmitEnabled ? "#628AFF" : "#ccc" },
        ]}
        onPress={handleSubmit}
        disabled={!isSubmitEnabled}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  defaultOption: {
    backgroundColor: "#ffffff", // Default background
  },
  selectedOption: {
    backgroundColor: "#628AFF", // Selected background
  },
  disabledOption: {
    backgroundColor: "#f0f0f0", // Disabled background
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: "#ffffff", // Selected text color
  },
  submitButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    color: "#ffffff",
  },
});

export default FormComponent;
