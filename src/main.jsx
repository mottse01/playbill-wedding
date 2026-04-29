import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"

const ogBase = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/")
if (typeof window !== "undefined" && window.location.origin) {
  document.querySelectorAll("meta[property=\"og:image\"], meta[name=\"twitter:image\"]").forEach((el) => {
    const c = el.getAttribute("content") || ""
    if (!/^https?:\/\//i.test(c)) {
      const path = c.startsWith("/") ? c.slice(1) : c
      el.setAttribute("content", `${window.location.origin}${ogBase}${path}`)
    }
  })
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
