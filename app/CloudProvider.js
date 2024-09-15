'use client'; // Mark this as a client component

import { Provider } from 'react-redux';
import { store } from 'app/store/index'; // Adjust the import path

export default function ClientProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
