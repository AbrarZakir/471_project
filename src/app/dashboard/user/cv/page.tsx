'use client'

import dynamic from 'next/dynamic'
import { useState, useMemo } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CVDocument, CVData } from '@/lib/cvDocument'
import useAuth from '@/hooks/useAuth'

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false }
)

type Experience = {
  company: string
  title:   string
  from:    string
  to:      string
  desc:    string
}

type Education = {
  level:  'SSC' | 'HSC' | 'O-Levels' | 'A-Levels' | string
  school: string
  degree: string
  from:   string
  to:     string
}

export default function CVPage() {
  const { loading } = useAuth(['user'])
  const [previewMode, setPreviewMode] = useState(false)

  // --- form state ---
  const [data, setData] = useState<CVData>({
    name:           '',
    email:          '',
    phone:          '',
    address:        '',
    summary:        '',
    experiences:    [{ company:'', title:'', from:'', to:'', desc:'' }],
    educations:     [{ level:'', school:'', degree:'', from:'', to:'' }],
    skills:         [],
    certifications: [],
  })

  // Handlers for Experiences
  function addExperience() {
    setData({
      ...data,
      experiences: [
        ...data.experiences,
        { company:'', title:'', from:'', to:'', desc:'' },
      ],
    })
  }
  function removeExperience(idx: number) {
    const ex = [...data.experiences]
    ex.splice(idx, 1)
    setData({ ...data, experiences: ex })
  }
  function updateExperience(
    idx: number,
    field: keyof Experience,
    value: string
  ) {
    const ex = [...data.experiences]
    ex[idx] = { ...ex[idx], [field]: value }
    setData({ ...data, experiences: ex })
  }

  // Handlers for Educations
  function addEducation() {
    setData({
      ...data,
      educations: [
        ...data.educations,
        { level:'', school:'', degree:'', from:'', to:'' },
      ],
    })
  }
  function removeEducation(idx: number) {
    const ed = [...data.educations]
    ed.splice(idx, 1)
    setData({ ...data, educations: ed })
  }
  function updateEducation(
    idx: number,
    field: keyof Education,
    value: string
  ) {
    const ed = [...data.educations]
    ed[idx] = { ...ed[idx], [field]: value }
    setData({ ...data, educations: ed })
  }

  // Handlers for Skills & Certifications
  function updateSkills(value: string) {
    setData({ ...data, skills: value.split(',').map(s => s.trim()) })
  }
  function updateCerts(value: string) {
    setData({ ...data, certifications: value.split(',').map(s => s.trim()) })
  }

  // Memoize the PDFDocument for stable rendering
  const memoedDoc = useMemo(() => <CVDocument {...data} />, [data])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading…
      </div>
    )
  }

  // Preview mode
  if (previewMode) {
    return (
      <div className="space-y-6">
        {/* PDF Preview */}
        <div className="h-[800px] border">
          <PDFViewer width="100%" height="100%">
            {memoedDoc}
          </PDFViewer>
        </div>

        {/* Controls */}
        <div className="flex space-x-4">
          <button
            onClick={() => setPreviewMode(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back to Edit
          </button>

          <PDFDownloadLink
            document={memoedDoc}
            fileName="resume.pdf"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            {({ loading: dlLoading }) =>
              dlLoading ? 'Preparing…' : 'Download PDF'
            }
          </PDFDownloadLink>
        </div>
      </div>
    )
  }

  // Edit mode (form)
  return (
    <form className="space-y-6">
      <h2 className="text-xl font-bold">Create Your CV</h2>

      {/* Basic Info */}
      <input
        value={data.name}
        onChange={e => setData({ ...data, name: e.target.value })}
        placeholder="Full Name"
        className="w-full rounded border px-3 py-2"
      />
      <input
        value={data.email}
        onChange={e => setData({ ...data, email: e.target.value })}
        placeholder="Email"
        className="w-full rounded border px-3 py-2"
      />
      <input
        value={data.phone}
        onChange={e => setData({ ...data, phone: e.target.value })}
        placeholder="Phone"
        className="w-full rounded border px-3 py-2"
      />
      <input
        value={data.address}
        onChange={e => setData({ ...data, address: e.target.value })}
        placeholder="Address"
        className="w-full rounded border px-3 py-2"
      />
      <textarea
        value={data.summary}
        onChange={e => setData({ ...data, summary: e.target.value })}
        placeholder="Professional Summary"
        className="w-full rounded border px-3 py-2"
      />

      {/* Experiences */}
      <section className="space-y-4">
        <h3 className="font-semibold">Work Experience</h3>
        {data.experiences.map((exp, i) => (
          <div key={i} className="border p-4 rounded space-y-2">
            <button
              type="button"
              onClick={() => removeExperience(i)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
            <input
              value={exp.company}
              onChange={e => updateExperience(i, 'company', e.target.value)}
              placeholder="Company"
              className="w-full rounded border px-3 py-2"
            />
            <input
              value={exp.title}
              onChange={e => updateExperience(i, 'title', e.target.value)}
              placeholder="Title"
              className="w-full rounded border px-3 py-2"
            />
            <div className="flex gap-2">
              <input
                value={exp.from}
                onChange={e => updateExperience(i, 'from', e.target.value)}
                placeholder="From (e.g. Jan 2020)"
                className="w-1/2 rounded border px-3 py-2"
              />
              <input
                value={exp.to}
                onChange={e => updateExperience(i, 'to', e.target.value)}
                placeholder="To (e.g. Dec 2022 or Present)"
                className="w-1/2 rounded border px-3 py-2"
              />
            </div>
            <textarea
              value={exp.desc}
              onChange={e => updateExperience(i, 'desc', e.target.value)}
              placeholder="Description"
              className="w-full rounded border px-3 py-2"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addExperience}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          + Add Experience
        </button>
      </section>

      {/* Educations */}
      <section className="space-y-4">
        <h3 className="font-semibold">Education</h3>
        {data.educations.map((ed, i) => (
          <div key={i} className="border p-4 rounded space-y-2">
            <button
              type="button"
              onClick={() => removeEducation(i)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
            <select
              value={ed.level}
              onChange={e => updateEducation(i, 'level', e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">Select level…</option>
              <option value="SSC">SSC</option>
              <option value="HSC">HSC</option>
              <option value="O-Levels">O-Levels</option>
              <option value="A-Levels">A-Levels</option>
            </select>
            <input
              value={ed.school}
              onChange={e => updateEducation(i, 'school', e.target.value)}
              placeholder="School"
              className="w-full rounded border px-3 py-2"
            />
            <input
              value={ed.degree}
              onChange={e => updateEducation(i, 'degree', e.target.value)}
              placeholder="Degree (e.g. Science, Commerce)"
              className="w-full rounded border px-3 py-2"
            />
            <div className="flex gap-2">
              <input
                value={ed.from}
                onChange={e => updateEducation(i, 'from', e.target.value)}
                placeholder="From (e.g. 2016)"
                className="w-1/2 rounded border px-3 py-2"
              />
              <input
                value={ed.to}
                onChange={e => updateEducation(i, 'to', e.target.value)}
                placeholder="To (e.g. 2018)"
                className="w-1/2 rounded border px-3 py-2"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addEducation}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          + Add Education
        </button>
      </section>

      {/* Skills & Certifications */}
      <input
        placeholder="Skills (comma separated)"
        onChange={e => updateSkills(e.target.value)}
        className="w-full rounded border px-3 py-2"
      />
      <input
        placeholder="Certifications / Projects (comma separated)"
        onChange={e => updateCerts(e.target.value)}
        className="w-full rounded border px-3 py-2"
      />

      {/* Preview Button */}
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
