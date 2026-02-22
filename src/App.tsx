import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ArenaPage from "./pages/ArenaPage";

// Loaded only in dev — Vite replaces import.meta.env.DEV with `false` at
// build time, so Rollup tree-shakes this dynamic import entirely and the
// DesignSystem module is never included in the production bundle.
const DesignSystem = import.meta.env.DEV
    ? lazy(() => import("./pages/DesignSystem"))
    : null;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/arena" element={<ArenaPage />} />
                {import.meta.env.DEV && DesignSystem && (
                    <Route
                        path="/design-system"
                        element={
                            <Suspense fallback={null}>
                                <DesignSystem />
                            </Suspense>
                        }
                    />
                )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
