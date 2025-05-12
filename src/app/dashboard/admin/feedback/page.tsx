'use client'

import { useEffect, useState } from 'react'

export default function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<string[]>([])

  useEffect(() => {
    // Fetch feedback data from the server (replace with actual API call)
    const fetchFeedback = async () => {
      const mockFeedback = [
        'Great platform!',
        'Please add more courses.',
        'The UI could be improved.'
      ]
      setFeedbackList(mockFeedback)
    }
    fetchFeedback()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Feedback</h1>
      <ul className="space-y-2">
        {feedbackList.map((feedback, index) => (
          <li key={index} className="p-4 border rounded bg-gray-100">
            {feedback}
          </li>
        ))}
      </ul>
    </div>
  )
}