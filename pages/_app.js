import "tailwindcss/tailwind.css";
import Navbar from "../components/Navbar";

import { Provider } from 'react-redux'
import { useStore } from "../store";
import { initialState } from "../store";

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={useStore(pageProps.initialReduxState)}>
      <Navbar />
      <Component {...pageProps} />
    </Provider>
  );
}

