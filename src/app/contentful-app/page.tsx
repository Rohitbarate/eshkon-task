"use client";

import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../../store";
import PageBuilder from "../../components/contentful-app/PageBuilder";
import { LayoutComponent } from "../../types/contentful";
import { loadLayoutConfig } from "../../lib/layoutConfigLoader";

const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      flexDirection: "column",
      gap: "1rem",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "4px solid #f3f4f6",
        borderTop: "4px solid #2563eb",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <div>Loading Page Builder...</div>
    <style jsx>{`
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);

const ContentfulApp: React.FC = () => {
  const [initialComponents, setInitialComponents] = useState<LayoutComponent[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // const layoutConfig = await loadLayoutConfig('page-1');

        // const layoutConfig: never[] = [];

        // if (layoutConfig && layoutConfig.components) {
        //   console.log("Loaded initial components:", layoutConfig.components);
        //   setInitialComponents(layoutConfig.components);
        // } else {
        //   console.log(
        //     "No existing layout found, starting with empty components"
        //   );
        setInitialComponents([]);
        // }
      } catch (error) {
        console.error("Error loading initial data:", error);
        setError("Failed to load initial data");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          flexDirection: "column",
          gap: "1rem",
          color: "#dc2626",
        }}
      >
        <div>Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "0.5rem 1rem",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <PageBuilder initialComponents={initialComponents} />
      </PersistGate>
    </Provider>
  );
};

export default ContentfulApp;
