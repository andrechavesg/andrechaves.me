import { useRef, type HTMLAttributes, type ReactNode, type PointerEvent } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  as?: 'div' | 'article' | 'section'
  /** Spring-tilt on fine pointers (desktop). Disabled on coarse / reduced-motion via CSS. */
  magnetic?: boolean
}

export function GlassCard({
  children,
  className = '',
  as: Tag = 'div',
  magnetic = true,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!magnetic || !ref.current) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    ref.current.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`
  }

  const onPointerLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <Tag
      ref={ref as never}
      className={`glass rounded-sm p-6 md:p-8 transition-transform duration-300 ease-out will-change-transform ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...rest}
    >
      {children}
    </Tag>
  )
}
