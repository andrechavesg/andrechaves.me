import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  href?: string
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-ember text-forge font-medium hover:brightness-110 shadow-[0_0_24px_rgb(255_106_0_/_0.25)]',
  secondary: 'glass glass-warm text-white',
  ghost: 'text-steel hover:text-white underline-offset-4 hover:underline bg-transparent',
}

export function GlassButton({
  variant = 'primary',
  href,
  children,
  className = '',
  ...rest
}: Props) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm transition-colors duration-200 ${variants[variant]} ${className}`

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  )
}
