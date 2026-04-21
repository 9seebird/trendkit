// tailwind.config.ts 에 아래 설정을 추가해주세요:
// darkMode: 'class'  ← 이 한 줄이 핵심!

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',  // ← 추가
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
