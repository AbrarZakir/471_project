'use client'
import { useState } from 'react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import { CVDocument, CVData } from '@/lib/cvDocument'
import useAuth from '@/hooks/useAuth'

type Experience = { company:string; title:string; from:string; to:string; desc:string }
type Education  = { school:string; degree:string; from:string; to:string }

export default function CVPage() {
  const { loading } = useAuth(['user'])
  const [previewMode, setPreviewMode] = useState(false)

  // --- form state ---
  const [data, setData] = useState<CVData>({
    name: '', email: '', phone: '', address: '',
    summary: '',
    experiences: [{ company:'', title:'', from:'', to:'', desc:'' }],
    educations: [{ school:'', degree:'', from:'', to:'' }],
    skills: [], certifications: []
  })

  // Handlers omitted for brevity: add/remove/update entries...
  // For skills/certs, use comma-separated text inputs split on ','

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading…</div>
  }

  return previewMode ? (
    <div className="space-y-4">
      {/* PDF Preview */}
      <div className="h-[800px] border">
        <PDFViewer width="100%" height="800">
          {CVDocument(data)}
        </PDFViewer>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setPreviewMode(false)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to Edit
        </button>

        <PDFDownloadLink
          document={CVDocument(data)}
          fileName="resume.pdf"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
        >
          {({ loading: dlLoading }) =>
            dlLoading ? 'Preparing…' : 'Download PDF'
          }
        </PDFDownloadLink>
      </div>
    </div>
  ) : (
    <form className="space-y-4">
      <h2 className="text-xl font-bold">Create Your CV</h2>
      {/* Basic Info */}
      <input
        value={data.name}
        onChange={e => setData({ ...data, name: e.target.value })}
        placeholder="Full Name"
        className="w-full rounded border px-3 py-2"
      />
      {/* ...email, phone, address, summary... */}

      {/* Experiences (add/remove/update as shown previously) */}

      {/* Educations */}

      {/* Skills & Certifications */}
      <input
        placeholder="Skills (comma separated)"
        onChange={e => setData({ ...data, skills: e.target.value.split(',').map(s=>s.trim()) })}
        className="w-full rounded border px-3 py-2"
      />
      <input
        placeholder="Certifications / Projects (comma separated)"
        onChange={e => setData({ ...data, certifications: e.target.value.split(',').map(s=>s.trim()) })}
        className="w-full rounded border px-3 py-2"
      />

      <button
        type="button"
        onClick={() => setPreviewMode(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
      >
        Preview CV
      </button>
    </form>
  )
}
