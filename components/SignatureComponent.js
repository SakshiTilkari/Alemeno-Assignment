import React, { useState } from "react";
import { View, Button } from "react-native";
import SignatureCanvas from "react-native-signature-canvas";

const SignatureComponent = ({ onSignatureCaptured }) => {
  let signatureRef = null;

  const handleSignature = (signature) => {
    console.log("Signature captured:", signature);
    if (onSignatureCaptured) {
      onSignatureCaptured(signature);
    }
  };

  const handleOK = () => {
    if (signatureRef) {
      console.log("Attempting to read signature...");
      signatureRef.read(); // Triggering the read function manually
    }
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <SignatureCanvas
        ref={(ref) => {
          signatureRef = ref;
        }}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          height: 200,
        }}
        onOK={handleSignature}
        onEmpty={() => console.log("Canvas is empty")}
      />
    </View>
  );
};

export default SignatureComponent;
