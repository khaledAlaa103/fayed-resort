import { useState } from 'react'

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (username === 'admin' && password === 'fayed') {
      sessionStorage.setItem('isLoggedIn', 'true')
      onSuccess()
      return
    }
    setError('خطأ في البيانات!')
  }

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Fayed Resort</h2>
        {error ? <p className="login-error">{error}</p> : null}
        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit" className="save-btn">دخول</button>
      </form>
    </div>
  )
}
