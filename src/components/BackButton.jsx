export default function BackButton({ onClick, label = '← رجوع' }) {
  return (
    <button type="button" className="back-btn" onClick={onClick}>
      {label}
    </button>
  )
}
