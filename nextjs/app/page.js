'use client'

import DarkModeToggle from '@/components/DarkModeToggle'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="absolute top-8 right-8">
        <DarkModeToggle />
      </div>
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">RTM Portal</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Welcome to Radio Televisyen Malaysia</p>
      </div>
    </main>
  )
}
