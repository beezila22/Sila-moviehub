import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Admin from './admin/Admin'
import Login from './admin/Login'

const sampleMovies = [
  { id: 'm1', title: 'HELLBOUND |1-18F| Dj Mack', category: 'Drama', thumb: '/poster1.jpg', link: '' },
  { id: 'm2', title: 'Luca |2021| Animation', category: 'Adventure', thumb: '/poster2.jpg', link: '' },
  { id: 'm3', title: 'Fangs of Fortune', category: 'Action', thumb: '/poster3.jpg', link: '' },
]

function MovieCard({m}) {
  return (
    <div className="w-40 mr-4">
      <img src={m.thumb} alt={m.title} className="w-full h-56 object-cover rounded" />
      <h3 className="mt-2 text-sm font-semibold truncate">{m.title}</h3>
      <div className="text-xs text-gray-400">{m.category}</div>
    </div>
  )
}

export default function App(){
  const [movies, setMovies] = useState([])
  const [query, setQuery] = useState('')
  const [adminKey, setAdminKey] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(()=> {
    // try to load from the API; fallback to samples
    axios.get('/api/movies').then(r => setMovies(r.data)).catch(()=> setMovies(sampleMovies))
  },[])

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <header className="flex items-center gap-4 mb-4">
          <div className="font-bold text-xl">MovieHub</div>
          <div className="flex-1">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search Film" className="w-full p-2 rounded bg-gray-800" />
          </div>
          <button onClick={() => { /* show admin login */ setIsAdmin('login') }} className="ml-2 bg-green-500 px-3 py-2 rounded">Admin</button>
        </header>

        <section className="mb-6">
          <h3 className="text-lg font-bold mb-2">Populer Movie</h3>
          <div className="flex overflow-x-auto pb-2">
            {movies.map(m=> <MovieCard key={m.id} m={m} />)}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-2">Latest posts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {movies.filter(m=>m.title.toLowerCase().includes(query.toLowerCase())).map(m=>(
              <div key={m.id} className="bg-gray-800 rounded p-2">
                <img src={m.thumb} className="w-full h-40 object-cover rounded" />
                <h4 className="mt-2 font-semibold text-sm truncate">{m.title}</h4>
              </div>
            ))}
          </div>
        </section>

        {isAdmin === 'login' && <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="p-4 bg-gray-900 rounded">
            <Login onAuth={(key)=>{ setAdminKey(key); setIsAdmin(true); }} />
            <div className="mt-2 text-right"><button onClick={()=>setIsAdmin(false)} className="text-sm text-gray-400">Close</button></div>
          </div>
        </div>}
      </div>
    )
  }

  // adminKey exists: render admin panel
  return <Admin adminKey={adminKey} />
}
