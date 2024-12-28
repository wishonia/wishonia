'use client'

type GradientBlurProps = {
  variant?: 'default' | 'blue-purple'
  className?: string
  style?: React.CSSProperties
  rotationDelay?: string
}

export function GradientBlur({ 
  variant = 'default',
  className = '',
  style = {},
  rotationDelay
}: GradientBlurProps) {
  return (
    <div 
      className={`bg-gradient-blur-wrapper ${className}`}
      style={{ 
        filter: 'blur(60px)',
        opacity: 0.15,
        animation: 'rotate 20s linear infinite',
        transformOrigin: 'center center',
        animationDelay: rotationDelay,
        ...style
      }}
    >
      <div className="bg-gradient-blur-circle-3" />
      <div className={`bg-gradient-blur-circle-2 ${variant === 'blue-purple' ? 'blue' : ''}`} />
      <div className={`bg-gradient-blur-circle-1 ${variant === 'blue-purple' ? 'purple' : ''}`} />

      <style jsx global>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
} 