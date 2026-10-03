let host = null
const queue = []
let busy = false

export function registerDialogHost(nextHost) {
  host = nextHost
  if (host) flushQueue()
}

function flushQueue() {
  if (busy || !host || queue.length === 0) return
  busy = true
  const item = queue.shift()
  host(item.dialog).then((result) => {
    item.resolve(result)
  }).finally(() => {
    busy = false
    flushQueue()
  })
}

function enqueue(dialog) {
  return new Promise((resolve) => {
    queue.push({ dialog, resolve })
    flushQueue()
  })
}

export function appAlert(message) {
  return enqueue({ type: 'alert', message: String(message ?? '') })
}

export function appConfirm(message) {
  return enqueue({ type: 'confirm', message: String(message ?? '') })
}
