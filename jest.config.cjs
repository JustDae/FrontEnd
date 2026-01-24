module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest"
  },

  // CSS modules / estilos
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },

  // setup global (jest-dom + mocks de browser)
  setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.ts"],

  // tests en cualquier carpeta: *.test.ts(x)
  testMatch: ["<rootDir>/src/**/*.test.(ts|tsx)"],

  // mejora logs
  clearMocks: true,
  restoreMocks: true
};