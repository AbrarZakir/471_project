// src/lib/cvDocument.tsx
import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

// Register a font if you want custom (optional)
// Font.register({ family: 'Roboto', src: 'https://...' })

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  header: { fontSize: 20, textAlign: 'center', marginBottom: 10 },
  section: { marginBottom: 10 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bold: { fontWeight: 'bold' },
})

type Experience = { company:string; title:string; from:string; to:string; desc:string }
type Education  = { school:string; degree:string; from:string; to:string }

export type CVData = {
  name: string
  email: string
  phone: string
  address: string
  summary: string
  experiences: Experience[]
  educations: Education[]
  skills: string[]
  certifications: string[]
}

export function CVDocument(data: CVData) {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>{data.name}</Text>
        <Text>{data.email} | {data.phone} | {data.address}</Text>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.bold}>Professional Summary</Text>
          <Text>{data.summary}</Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.bold}>Work Experience</Text>
          {data.experiences.map((e, i) => (
            <View key={i} style={{ marginTop: 4 }}>
              <View style={styles.titleRow}>
                <Text>{e.title}, {e.company}</Text>
                <Text>{e.from} – {e.to}</Text>
              </View>
              <Text>{e.desc}</Text>
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.bold}>Education</Text>
          {data.educations.map((ed, i) => (
            <View key={i} style={{ marginTop: 4 }}>
              <View style={styles.titleRow}>
                <Text>{ed.degree}, {ed.school}</Text>
                <Text>{ed.from} – {ed.to}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.bold}>Skills</Text>
          <Text>{data.skills.join(', ')}</Text>
        </View>

        {/* Certifications */}
        <View style={styles.section}>
          <Text style={styles.bold}>Certifications & Projects</Text>
          <Text>{data.certifications.join(', ')}</Text>
        </View>
      </Page>
    </Document>
  )
}
