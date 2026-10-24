import { useEffect, useState } from 'react'

const ciudades = [
  { nombre: 'Zacapa', lat: 14.97, lon: -89.53 },
  { nombre: 'Ciudad de Guatemala', lat: 14.63, lon: -90.51 },
]

function descripcion(codigo) {
  if (codigo === 0) return 'Despejado'
  if (codigo <= 3) return 'Algo nublado'
  if (codigo >= 95) return 'Tormenta'
  if (codigo >= 51) return 'Lluvia'
  return 'Nublado'
}

function App() {
  const [ciudad, setCiudad] = useState('Zacapa')
  const [clima, setClima] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  async function consultarClima() {
    const lugar = ciudades.find(c => c.nombre === ciudad)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lugar.lat}&longitude=${lugar.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=America%2FGuatemala`

    setCargando(true)
    setError('')

    try {
      const respuesta = await fetch(url)
      if (!respuesta.ok) throw new Error('No se pudo consultar el clima')
      const datos = await respuesta.json()
      setClima(datos.current)
    } catch {
      setError('No se pudo obtener el clima. Revisa tu conexión.')
      setClima(null)
    }

    setCargando(false)
  }

  useEffect(() => {
    consultarClima()
  }, [ciudad])

  return (
    <main className="tarjeta">
      <h1>Clima</h1>

      <label htmlFor="ciudad">Selecciona una ciudad</label>
      <select id="ciudad" value={ciudad} onChange={e => setCiudad(e.target.value)}>
        {ciudades.map(c => <option key={c.nombre}>{c.nombre}</option>)}
      </select>

      {cargando && <p>Consultando el clima...</p>}
      {error && <p className="error">{error}</p>}

      {clima && !cargando && (
        <section className="resultado">
          <h2>{ciudad}</h2>
          <div className="temperatura">{Math.round(clima.temperature_2m)} °C</div>
          <p className="estado">{descripcion(clima.weather_code)}</p>
          <div className="detalles">
            <p>Humedad: {clima.relative_humidity_2m}%</p>
            <p>Viento: {clima.wind_speed_10m} km/h</p>
            <p>Sensación: {Math.round(clima.apparent_temperature)} °C</p>
          </div>
        </section>
      )}

      <button onClick={consultarClima} disabled={cargando}>Actualizar clima</button>
    </main>
  )
}

export default App
