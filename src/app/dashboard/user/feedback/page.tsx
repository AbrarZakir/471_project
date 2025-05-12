'use client'

import { useState } from 'react'

export default function UserFeedbackPage() {
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Placeholder for feedback submission logic (e.g., API call)
      console.log('Feedback submitted:', feedback)

      // Clear the input after submission
      setFeedback('')
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Submit Feedback</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your feedback here..."
          className="w-full p-2 border rounded"
          rows={5}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  )
}
