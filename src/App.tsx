import React, { useEffect, useState } from "react";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { About } from "./pages/About";
import { DisclaimerModal } from "./components/DisclaimerModal";
import { Header } from "./components/ui/Header";

export function App() {
  // Disclaimer modal state
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(
    () => localStorage.getItem("medentify_disclaimer_accepted") === "true"
  );

  useEffect(() => {
    if (disclaimerAccepted) {
      localStorage.setItem("medentify_disclaimer_accepted", "true");
    }
  }, [disclaimerAccepted]);

  // Routing logic
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  let Page = Home;
  if (path.startsWith("/search")) Page = Search;
  if (path.startsWith("/about")) Page = About;

  function handleNavigate(newPath: string) {
    window.history.pushState({}, "", newPath);
    setPath(newPath);
  }

  return (
    <>
      <DisclaimerModal open={!disclaimerAccepted} onAccept={() => setDisclaimerAccepted(true)} />
      {disclaimerAccepted && (
        <>
          <Header onNavigate={handleNavigate} />
          <main>
            <Page />
          </main>
        </>
      )}
    </>
  );
}
