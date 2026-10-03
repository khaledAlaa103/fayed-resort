import { useState } from 'react'
import { api } from '../api.js'

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const unlockField = (event) => {
    event.currentTarget.removeAttribute('readOnly')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.login(username, password)
      sessionStorage.setItem('isLoggedIn', 'true')
      onSuccess()
    } catch (err) {
      setError(err.message || 'خطأ في البيانات!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <img className="login-logo" src="/logo.png" alt="Fayed Resort" />
        <h2>Fayed Resort</h2>
        {error ? <p className="login-error">{error}</p> : null}
        <input
          type="text"
          name="username"
          placeholder="اسم المستخدم"
          value={username}
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="fayed-password"
          placeholder="كلمة المرور"
          value={password}
          readOnly
          autoComplete="new-password"
          onFocus={unlockField}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
      </form>
    </div>
  )
}
