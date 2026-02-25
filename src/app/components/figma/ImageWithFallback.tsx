import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

const PLACEHOLDER_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2U1ZTVlNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZTwvdGV4dD48L3N2Zz4='

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoad?: () => void;
  maxRetries?: number;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = props.maxRetries ?? 2

  const handleError = () => {
    if (retryCount < maxRetries) {
      console.log(`Retrying image load (${retryCount + 1}/${maxRetries}):`, props.src)
      setRetryCount(prev => prev + 1)
      // Force reload by adding timestamp
      const img = document.createElement('img')
      img.src = props.src + (props.src?.includes('?') ? '&' : '?') + `retry=${retryCount + 1}`
      img.onload = () => {
        setDidError(false)
        setIsLoading(false)
        props.onLoad?.()
      }
      img.onerror = () => {
        if (retryCount + 1 >= maxRetries) {
          console.error('Image failed to load after retries:', props.src)
          setDidError(true)
          setIsLoading(false)
        }
      }
    } else {
      console.error('Image failed to load:', props.src)
      setDidError(true)
      setIsLoading(false)
    }
  }

  const handleLoad = () => {
    console.log('Image loaded successfully:', props.src)
    setIsLoading(false)
    setDidError(false)
    props.onLoad?.()
  }

  const handleRetry = () => {
    setDidError(false)
    setIsLoading(true)
    setRetryCount(0)
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
          <span className="text-[10px] text-gray-500 mb-2">
            Failed to load image
          </span>
          <button 
            onClick={handleRetry}
            className="text-[10px] px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Add retry parameter to URL if retrying
  const imageSrc = retryCount > 0 
    ? (src + (src?.includes('?') ? '&' : '?') + `retry=${retryCount}`)
    : src

  return (
    <div className={`relative ${className ?? ''}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse w-8 h-8 bg-gray-300 rounded"></div>
        </div>
      )}
      <img 
        src={imageSrc} 
        alt={alt} 
        className={`${className ?? ''} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={style}
        {...rest} 
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  )
}
