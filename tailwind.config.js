module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            transformStyle: {
                '3d': 'preserve-3d',
            },
            backfaceVisibility: {
                hidden: 'hidden',
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};