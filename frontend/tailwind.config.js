/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1A202C',  // Dark blue-gray for primary color
        secondary: '#2D3748', // Slightly lighter gray
        accent: '#4FD1C5',    // Cool accent color (teal)
        background: '#F7FAFC', // Light background color for modern design
        card: 'rgba(255, 255, 255, 0.2)', // Glass effect card background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],  // Modern sans-serif font
      },
      borderRadius: {
        'xl': '1.5rem',  // Large rounded corners for buttons/cards
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)', // Soft shadow for glass effect
      },
      spacing: {
        '72': '18rem',  // Custom spacing (used for margins, paddings, etc.)
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),      // For improved form styling
    require('@tailwindcss/typography'), // For better text styling
    require('@tailwindcss/aspect-ratio'), // To manage aspect ratios (useful for images and videos)
  ],
};
