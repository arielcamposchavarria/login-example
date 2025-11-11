import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

interface LoginResponse {
  token?: string;
  user?: {
    id: number;
    email: string;
    nombre?: string;
  };
  message?: string;
}

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [apiUrl, setApiUrl] = useState('http://localhost')

  const apiOptions = [
    { value: 'https://backendhotelt.onrender.com', label: '🌐 Producción (Render)' },
    { value: 'http://localhost', label: '💻 Local (Docker - Puerto 80)' },
    { value: 'http://localhost:8000', label: '💻 Local (Artisan - Puerto 8000)' },
    { value: 'http://127.0.0.1', label: '💻 Local (127.0.0.1 - Puerto 80)' },
  ]

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    setResponse(null)

    const url = `${apiUrl}/api/auth/login`

    console.log('🚀 Enviando request a:', url)
    console.log('📦 Body:', { email, password: '***' })

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // NO usar credentials para autenticación con tokens
        // Si tu backend usa Sanctum stateful (cookies), descomenta la siguiente línea:
        // credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const responseHeaders: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      console.log('📨 Response status:', res.status)
      console.log('📨 Response headers:', responseHeaders)

      const data: LoginResponse | ApiError = await res.json()

      console.log('📨 Response data:', data)

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        data,
      })

      if (res.ok) {
        const loginData = data as LoginResponse
        setSuccess(`✅ Login exitoso! ${loginData.token ? 'Token recibido' : ''}`)

        // Guardar token en localStorage
        if (loginData.token) {
          localStorage.setItem('auth_token', loginData.token)
          console.log('💾 Token guardado en localStorage')
        }

        // Opcional: mostrar información del usuario
        if (loginData.user) {
          console.log('👤 Usuario:', loginData.user)
        }
      } else {
        const errorData = data as ApiError
        setError(`❌ Error: ${errorData.message || 'Credenciales inválidas'}`)
      }
    } catch (err: any) {
      console.error('❌ Error completo:', err)

      let errorMessage = 'Error de conexión. '

      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage += 'Posibles causas:\n'
        errorMessage += '1. El servidor no está corriendo\n'
        errorMessage += '2. Error de CORS\n'
        errorMessage += '3. URL incorrecta\n\n'
        errorMessage += 'Revisa la consola del navegador (F12) para más detalles.'
      } else {
        errorMessage += err.message
      }

      setError(errorMessage)
      setResponse({
        error: err.message,
        name: err.name,
        stack: err.stack,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🔐 Login Admin</h1>
        <p>Test CORS - BackendHotelT</p>
        <p style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>
          Ruta: /api/auth/login
        </p>
      </div>

      <div className="form-container">
        {error && (
          <div className="alert alert-error">
            {error.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <div className="api-selector">
          <label htmlFor="apiUrl">Servidor API:</label>
          <select
            id="apiUrl"
            value={apiUrl}
            onChange={(e) => {
              setApiUrl(e.target.value)
              console.log('🔄 Servidor cambiado a:', e.target.value)
            }}
          >
            {apiOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ejemplo.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Conectando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {response && (
          <div className="response-container">
            <h3>📡 Respuesta del servidor:</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}

        <div className="info-box">
          <strong>ℹ️ Información:</strong>
          <p>
            Este formulario envía requests a: <code>/api/auth/login</code>
            <br />
            Método: POST
            <br />
            Headers: Content-Type: application/json, Accept: application/json
            <br />
            <strong>NO</strong> usa credentials (cookies) - Solo tokens
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
