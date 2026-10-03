import { useState } from 'react'
import { api } from '../api.js'

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

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
        <div className="login-password">
          <input
            type={showPassword ? 'text' : 'password'}
            name="fayed-password"
            placeholder="كلمة المرور"
            value={password}
            readOnly
            autoComplete="new-password"
            onFocus={unlockField}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="login-password-toggle"
            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 3l18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A10.5 10.5 0 0121 12a10.5 10.5 0 01-4.1 4.8M6.1 6.1A10.5 10.5 0 003 12a10.5 10.5 0 009 5.5c.7 0 1.4-.1 2-.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>
        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
      </form>
      <p className="login-watermark" dir="ltr">
        by producer:
        {'\n'}
        pilot{'\u005c'} Khaled Alaaeldin
      </p>
    </div>
  )
}
