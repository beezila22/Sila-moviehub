import React, { useState } from 'react'

export default function MovieForm({ onSubmit, initial }) {
  const [form, setForm] = useState(initial || { title: '', category: 'Drama', thumb: '/poster1.jpg', link: '' })

  function submit(e) {
    e.preventDefault()
    onSubmit(form)
    if (!initial) setForm({ title: '', category: 'Drama', thumb: '/poster1.jpg', link: '' })
  }

  return (
    <form onSubmit={submit} className="grid gap-2">
      <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="p-2 rounded bg-gray-700" />
      <input value={form.thumb} onChange={e => setForm({ ...form, thumb: e.target.value })} placeholder="Thumb URL (or /public/pic.jpg)" className="p-2 rounded bg-gray-700" />
      <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="Playback link (Google Drive / CDN)" className="p-2 rounded bg-gray-700" />
      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="p-2 rounded bg-gray-700">
        <option>Drama</option>
        <option>Action</option>
        <option>Adventure</option>
        <option>Animation</option>
        <option>K-Drama</option>
      </select>
      <div className="flex gap-2">
        <button className="bg-green-500 px-3 py-2 rounded">Save</button>
      </div>
    </form>
  )
}
