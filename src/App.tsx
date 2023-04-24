import React from "react";
import "./App.css";

import { Container, Space } from "@mantine/core";

import Home from "./pages/Home";

export default function App() {
  return (
    <Container fluid>
      <Space h="md" />
      <Home />
    </Container>
  );
}
