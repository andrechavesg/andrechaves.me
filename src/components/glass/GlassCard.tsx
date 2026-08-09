import type { HTMLAttributes, ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  as?: 'div' | 'article' | 'section'
}

export function GlassCard({ children, className = '', as: Tag = 'div', ...rest }: Props) {
  return (
    <Tag className={`glass rounded-sm p-6 md:p-8 ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
