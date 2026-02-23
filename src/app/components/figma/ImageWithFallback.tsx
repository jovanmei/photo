import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoad?: () => void;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    console.error('Image failed to load:', props.src)
    setDidError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    console.log('Image loaded successfully:', props.src)
    setIsLoading(false)
    props.onLoad?.()
  }

  const { src, alt, style, className, onLoad, ...rest } = props

  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex flex-col items-center justify-center w-full h-full p-4">
          <img 
            src={ERROR_IMG_SRC} 
            alt="Error loading image" 
            className="w-12 h-12 mb-2 opacity-50"
          />
          <span className="text-[10px] text-gray-500 break-all max-w-full">
            Failed to load: {src?.substring(0, 50)}...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className ?? ''}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse w-8 h-8 bg-gray-300 rounded"></div>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className={`${className ?? ''} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={style}
        {...rest} 
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  )
}
