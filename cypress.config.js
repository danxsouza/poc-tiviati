const {defineConfig} = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://serverest.dev',
        setupNodeEvents(on, config) {
        },
        env: {
            frontBaseUrl: 'https://front.serverest.dev',
        }
    },
});
