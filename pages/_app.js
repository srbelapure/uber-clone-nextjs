import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import 'mapbox-gl/dist/mapbox-gl.css' // to add mapbox

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
