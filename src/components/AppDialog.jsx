import { useEffect, useState } from 'react'
import { registerDialogHost } from '../utils/dialogs.js'

export default function AppDialog() {
  const [dialog, setDialog] = useState(null)

  useEffect(() => {
    registerDialogHost((next) => new Promise((resolve) => {
      setDialog({ ...next, resolve })
    }))
  }, [])

  if (!dialog) return null

  const isConfirm = dialog.type === 'confirm'

  const close = (value) => {
    const { resolve } = dialog
    setDialog(null)
    resolve(value)
  }

  return (
    <div
      className="app-dialog-backdrop"
      onClick={() => close(isConfirm ? false : undefined)}
    >
      <div
        className="app-dialog"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="app-dialog-message">{dialog.message}</p>
        <div className="app-dialog-actions">
          {isConfirm ? (
            <>
              <button type="button" className="app-dialog-cancel" onClick={() => close(false)}>
                إلغاء
              </button>
              <button type="button" className="app-dialog-ok" onClick={() => close(true)}>
                تأكيد
              </button>
            </>
          ) : (
            <button type="button" className="app-dialog-ok" onClick={() => close()}>
              موافق
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
