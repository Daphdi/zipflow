type ToastType = "success" | "error" | "info" | "warning"

export const showToast = (message: string, type: ToastType = "info") => {
  // Buat elemen toast
  const toast = document.createElement("div")
  toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`

  // Styling berdasarkan type dengan sky blue theme
  const styles = {
    success: "bg-emerald-600 text-white border border-emerald-500/30",
    error: "bg-red-600 text-white border border-red-500/30",
    warning: "bg-amber-600 text-white border border-amber-500/30",
    info: "bg-sky-600 text-white border border-sky-500/30",
  }

  toast.className += ` ${styles[type]}`

  // Icon berdasarkan type
  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  }

  toast.innerHTML = `
    <div class="flex items-center space-x-2">
      <span class="text-lg">${icons[type]}</span>
      <span class="font-medium">${message}</span>
    </div>
  `

  document.body.appendChild(toast)

  // Animasi masuk
  setTimeout(() => {
    toast.classList.remove("translate-x-full")
    toast.classList.add("translate-x-0")
  }, 100)

  // Auto remove setelah 3 detik
  setTimeout(() => {
    toast.classList.remove("translate-x-0")
    toast.classList.add("translate-x-full")
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 3000)
}
