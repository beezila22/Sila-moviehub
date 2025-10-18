import React, { useEffect, useState } from 'react'
import axios from 'axios'
import MovieForm from '../components/MovieForm'

export default function Admin({ adminKey }) {
  const [movies, setMovies] = useState([])
  const [editing, setEditing] = useState(null)

  useEffect(() => { fetchMovies() }, [])
  function fetchMovies() {
    axios.get('/api/movies').then(r => setMovies(r.data)).catch(()=>setMovies([]))
  }

  function create(movie) {
    axios.post('/api/admin/movies', movie, { headers: { 'x-admin-key': adminKey } }).then(r => {
      setMovies(m => [r.data, ...m])
    }).catch(e=> alert('Unauthorized or error'))
  }

  function update(id, payload) {
    axios.put(`/api/admin/movies/${id}`, payload, { headers: { 'x-admin-key': adminKey } }).then(r => {
      setMovies(ms => ms.map(m => m.id === id ? r.data : m))
      setEditing(null)
    }).catch(()=>alert('Error'))
  }

  function remove(id) {
    if (!confirm('Delete movie?')) return
    axios.delete(`/api/admin/movies/${id}`, { headers: { 'x-admin-key': adminKey } }).then(() => {
      setMovies(ms => ms.filter(m => m.id !== id))
    }).catch(()=>alert('Error'))
  }

  return (
    <div className="p-4 min-h-screen bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <div className="mb-4">
        <MovieForm onSubmit={create} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {movies.map(m => (
          <div key={m.id} className="bg-gray-800 p-3 rounded">
            <div className="flex items-start gap-3">
              <img src={m.thumb} className="w-20 h-28 object-cover rounded" alt="thumb" />
              <div className="flex-1">
                <h3 className="font-semibold">{m.title}</h3>
                <p className="text-sm text-gray-300">{m.category} • {m.upload || ''}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => setEditing(m)} className="px-2 py-1 bg-gray-700 rounded">Edit</button>
                  <button onClick={() => remove(m.id)} className="px-2 py-1 bg-red-600 rounded">Delete</button>
                </div>
              </div>
            </div>
            {editing && editing.id === m.id && (
              <div className="mt-3">
                <MovieForm initial={m} onSubmit={(payload) => update(m.id, payload)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
