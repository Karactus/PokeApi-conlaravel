
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [pokemones, setPokemones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [offset, setOffset] = useState(0)
  const [hayMas, setHayMas] = useState(true)

  useEffect(() => {

    fetch(`https://pokeapi-conlaravel.onrender.com/api/pokemon?offset=${offset}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los Pokémon')
        }
        return response.json()
      })
      .then(data => {
        setPokemones(data)
        setHayMas(data.length === 10)
      })
      .catch(error => {
        setError(error.message)
      })
      .finally(() => {
        setCargando(false)
      })

  }, [offset])

  const pokemonesFiltrados = pokemones.filter(pokemon =>
    pokemon.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <main className="app">

      <h1>Mi Pokédex</h1>

      <p>Pokémon obtenidos desde Laravel + PokeAPI</p>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar Pokémon..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="search-input"
      />

      {cargando && <p>Cargando Pokémon...</p>}

      {error && <p>{error}</p>}

      <div className="pokemon-grid">

        {pokemonesFiltrados.map(pokemon => (

          <article
            className={`pokemon-card tipo-${pokemon.tipos[0]}`}
            key={pokemon.nombre}
          >

            <img
              src={pokemon.imagen}
              alt={pokemon.nombre}
            />

            <h2>{pokemon.nombre}</h2>

            <div className="pokemon-types">
              {pokemon.tipos.map(tipo => (
                <span className={`type-badge tipo-${tipo}`} key={tipo}>
                  {tipo}
                </span>
              ))}
            </div>

            <p>Altura: {pokemon.altura / 10} m</p>

            <p>Peso: {pokemon.peso / 10} kg</p>

          </article>

        ))}

      </div>
      <div className="pagination">

    <button
        onClick={() => setOffset(offset - 10)}
        disabled={offset === 0 || cargando}
    >
        Anterior
    </button>

    <span>Página {Math.floor(offset / 10) + 1}</span>

    <button
        onClick={() => setOffset(offset + 10)}
        disabled={!hayMas || cargando}
    >
        Siguiente
    </button>
    </div>

    </main>
  )
}

export default App
