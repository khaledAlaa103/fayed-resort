export default function Modal({ open, onClose, children }) {
  if (!open) return null

  return (
    <div className="modal open" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
  )
}
