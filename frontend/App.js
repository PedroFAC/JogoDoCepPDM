import React from "react";
import AppRoutes from "./src/routes/AppRoutes";
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <PaperProvider>
      <AppRoutes />
    </PaperProvider>
  );
}
