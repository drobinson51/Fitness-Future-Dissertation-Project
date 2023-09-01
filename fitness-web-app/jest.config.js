module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: [
        "@testing-library/jest-dom/extend-expect",
        "<rootDir>/setupJest.js"
    ],
    transform: {
        "\\.[jt]sx?$": "babel-jest"
    },
    moduleFileExtensions: [
        "js",
        "jsx",
        "ts",
        "tsx"
    ],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        // axios: 'axios/dist/node/axios.cjs'
    }
};
