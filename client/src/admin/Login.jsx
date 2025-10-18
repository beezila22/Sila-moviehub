import React, { useState } from 'react'

export default function Login({ onAuth }) {
  const [key, setKey] = useState('')
  function submit(e) {
    e.preventDefault()
    onAuth(key)
  }
  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={submit} className="flex gap-2">
        <input value={key} onChange={e => setKey(e.target.value)} placeholder="Admin key" className="flex-1 p-2 rounded bg-gray-700" />
        <button className="bg-green-500 px-3 rounded">Enter</button>
      </form>
    </div>
  )
}
