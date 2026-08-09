import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './App'
import './styles/index.css'

export const createRoot = ViteReactSSG(
  { routes },
  () => {
    // client boot hooks if needed
  },
)
