import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import 'mapbox-gl/dist/mapbox-gl.css' // to add mapbox
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
