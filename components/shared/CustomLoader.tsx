import type React from "react"

interface EducationalLoaderProps {
  size?: number
  color?: string
}

const CustomLoader: React.FC<EducationalLoaderProps> = ({ size = 100, color = "#4A90E2" }) => {
  return (
    <div className="fixed left-0 right-0 bottom-0 top-0 flex items-center justify-center bg-opacity-50 bg-gray-500 w-full h-full">
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className="educational-loader"
      >
        {/* Book cover */}
        <rect x="10" y="20" width="80" height="60" fill={color} rx="5" ry="5" />

        {/* Left page */}
        <path
          className="page left-page origin-right animate-page-turn"
          d="M15 25 Q 50 25 50 80 L 15 80 Z"
          fill="#fff"
        />

        {/* Right page */}
        <path
          className="page right-page origin-right animate-page-turn-delayed"
          d="M85 25 Q 50 25 50 80 L 85 80 Z"
          fill="#fff"
        />

        {/* Book title */}
        <text x="50" y="55" fontSize="12" textAnchor="middle" fill="#fff">
          Learning
        </text>
      </svg>
      <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 font-sans text-sm text-blue-500 animate-pulse">
        Loading...
      </div>
    </div>
  )
}

export default CustomLoader

