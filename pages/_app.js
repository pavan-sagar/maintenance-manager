import "tailwindcss/tailwind.css";

import Navbar from "../components/Navbar";
import { store } from "../store";
import { Provider } from "react-redux";

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <div className="container w-full">
      <Navbar />
      <Component {...pageProps} />
      </div>
    </Provider>
  );
}
