import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { Toaster } from "sonner";
import * as React from "react";
import { AlbumProvider } from './context/AlbumContext';
import { AudioProvider } from './context/AudioContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AudioProvider>
        <AlbumProvider>
          <RouterProvider router={router} />
          <Toaster position="bottom-right" toastOptions={{
            style: {
              borderRadius: 0,
              background: "black",
              color: "white",
              border: "none",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase"
            }
          }} />
        </AlbumProvider>
      </AudioProvider>
    </ErrorBoundary>
  );
}

export default App;
