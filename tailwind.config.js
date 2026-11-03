/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy silver colors (preserved for compatibility)
        silver: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#80868b',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
        },
        // NEW Professional Color System
        primary: {
          50: '#f0f4f8',
          100: '#d9e6f2',
          200: '#b3cde0',
          300: '#6b9bc8',
          400: '#4a7ba7',
          500: '#2c5f8d',
          600: '#1e4976',
          700: '#163761',
          800: '#0f2746',
          900: '#0a1929',
        },
        accent: {
          50: '#fef8f0',
          100: '#fdefd9',
          200: '#fbd9a6',
          300: '#f8c373',
          400: '#f5ad40',
          500: '#f29c1f',
          600: '#d68712',
          700: '#a86a0e',
          800: '#7a4d0a',
          900: '#4c3007',
        },
        success: {
          50: '#f0f8f4',
          100: '#d4ede1',
          200: '#a8dbc3',
          300: '#7dc9a5',
          400: '#51b787',
          500: '#3d9970',
          600: '#2d7a58',
          700: '#1f5b40',
          800: '#143c2a',
          900: '#0a1e15',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        background: {
          cream: '#fefdfb',
          white: '#ffffff',
          lightGray: '#f8f9fa',
        }
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',    // 4px
        'DEFAULT': '0.5rem', // 8px
        'md': '0.625rem',    // 10px
        'lg': '0.75rem',     // 12px
        'xl': '1rem',        // 16px - Use sparingly
        '2xl': '1rem',       // 16px - Redirected from 24px for professional look
        '3xl': '1rem',       // 16px - Redirected from 32px for professional look
        'full': '9999px'     // Reserved for avatars/pills only
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'float-slow': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}