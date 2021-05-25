import "tailwindcss/tailwind.css";

import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Provider } from "react-redux";

import { store } from "../store";
import Navbar from "../components/Navbar";

const persistor = persistStore(store);

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <Navbar />
          <div className="container m-auto overflow-x-hidden">

          <Component {...pageProps} />
        </div>
      </PersistGate>
    </Provider>
  );
}
