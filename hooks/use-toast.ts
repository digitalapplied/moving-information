"use client"

import { useState, useEffect } from "react"

type ToastType = "success" | "error" | "info"

interface ToastState {
  open: boolean
  type: ToastType
  title: string
  description?: string
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    type: "info",
    title: "",
    description: "",
  })

  useEffect(() => {
    if (toast.open) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, open: false }))
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [toast.open])

  const showToast = (type: ToastType, title: string, description?: string) => {
    setToast({
      open: true,
      type,
      title,
      description,
    })
  }

  const dismissToast = () => {
    setToast((prev) => ({ ...prev, open: false }))
  }

  return {
    toast,
    showToast,
    dismissToast,
  }
}
