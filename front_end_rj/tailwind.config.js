/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,jsx}'],
    theme: {
        extend: {
            colors: {
                'primary-color': '#f7f7ff',
                'secondary-color': '#7a7f9a',
                'third-color': '#F7F7FF',
                'fourth-color': '#F5F7FB',
                'fifth-color': '#E6EBF5',
                'current-color': '#7269EF',
                'current-color-hover': '#E3E1FC',
                'current-color-hover-2': '#5146f1',
                ...require('tailwindcss/colors'),
            },
        },
    },
    plugins: [],
};
