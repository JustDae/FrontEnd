import "@testing-library/jest-dom";
// @ts-ignore
import * as util from "util";

Object.defineProperty(globalThis, "TextEncoder", { 
  value: (util as any).TextEncoder 
});

Object.defineProperty(globalThis, "TextDecoder", { 
  value: (util as any).TextDecoder 
});

Object.defineProperty(globalThis, "import", {
  value: {
    meta: {
      env: {
        VITE_API_URL: "https://restaurante-app.nael.live"
      }
    }
  }
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false
  })
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, "ResizeObserver", {
  value: ResizeObserverMock
});

window.scrollTo = () => undefined;