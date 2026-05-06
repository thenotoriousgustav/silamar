"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { CoverLetterBuilderData } from "./schema";

// Register custom fonts (matching Resume)
Font.register({
  family: "Times New Roman",
  src: "/fonts/times.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: "Times New Roman",
    color: "#000000",
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 30,
    textAlign: "right",
  },
  senderName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  senderInfo: {
    fontSize: 9,
    color: "#4b5563",
    lineHeight: 1.4,
  },
  date: {
    fontSize: 9,
    color: "#4b5563",
    marginBottom: 15,
  },
  recipientSection: {
    marginBottom: 20,
  },
  recipientName: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  recipientInfo: {
    fontSize: 9,
    color: "#4b5563",
    lineHeight: 1.4,
  },
  subject: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 20,
  },
  content: {
    fontSize: 10,
    color: "#1f2937",
    textAlign: "justify",
    lineHeight: 1.6,
  },
  signatureSection: {
    marginTop: 40,
    textAlign: "right",
  },
  signatureLabel: {
    fontSize: 10,
    color: "#4b5563",
    marginBottom: 40,
  },
  signatureName: {
    fontSize: 10,
    fontWeight: "bold",
  },
});

interface CoverLetterTemplateProps {
  data: Partial<CoverLetterBuilderData>;
}

export function CoverLetterTemplate({ data }: CoverLetterTemplateProps) {
  const {
    fullName,
    phone,
    email,
    address,
    cityAndPostal,
    recipientName,
    companyName,
    department,
    recipientAddress,
    recipientCityAndPostal,
    subject,
    content,
  } = data;

  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sender Header */}
        <View style={styles.header}>
          <Text style={styles.senderName}>{fullName || "NAMA ANDA"}</Text>
          <View style={styles.senderInfo}>
            {address && <Text>{address}</Text>}
            {cityAndPostal && <Text>{cityAndPostal}</Text>}
            {email && <Text>{email}</Text>}
            {phone && <Text>{phone}</Text>}
          </View>
        </View>

        {/* Date and Recipient */}
        <Text style={styles.date}>{today}</Text>

        <View style={styles.recipientSection}>
          <Text style={styles.recipientName}>
            {recipientName || "Nama Penerima"}
          </Text>
          <View style={styles.recipientInfo}>
            {department && <Text>{department}</Text>}
            {companyName && <Text>{companyName}</Text>}
            {recipientAddress && <Text>{recipientAddress}</Text>}
            {recipientCityAndPostal && <Text>{recipientCityAndPostal}</Text>}
          </View>
        </View>

        {/* Subject */}
        {subject && <Text style={styles.subject}>Perihal: {subject}</Text>}

        {/* Main Content */}
        <Text style={styles.content}>
          {content || "Tulis isi surat lamaran Anda di sini..."}
        </Text>

        {/* Signature */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureLabel}>Hormat saya,</Text>
          <Text style={styles.signatureName}>{fullName || "Nama Anda"}</Text>
        </View>
      </Page>
    </Document>
  );
}
