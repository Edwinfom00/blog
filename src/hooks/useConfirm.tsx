'use client'

import { useState, useCallback, useRef } from 'react'

interface ConfirmOptions {
  title?: string
  message: string
  confirmLabel?: string
  danger?: boolean
}

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState | null>(null)

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setState({ ...options, resolve })
    })
  }, [])

  const handleConfirm = () => {
    state?.resolve(true)
    setState(null)
  }

  const handleCancel = () => {
    state?.resolve(false)
    setState(null)
  }

  const ConfirmDialog = state ? (
    <div className="confirm-overlay" onClick={handleCancel}>
      <div className="confirm-dialog" onClick={e => e.stopPropagation()} role="alertdialog" aria-modal>
        {state.title && <h2 className="confirm-title">{state.title}</h2>}
        <p className="confirm-message">{state.message}</p>
        <div className="confirm-actions">
          <button onClick={handleCancel} className="dash-btn-ghost">
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className={state.danger ? 'confirm-btn-danger' : 'dash-btn-primary'}
            autoFocus
          >
            {state.confirmLabel ?? 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  ) : null

  return { confirm, ConfirmDialog }
}
