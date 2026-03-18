import { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  glass?: boolean
}

export default function Card({ glass = false, className = '', ...props }: Props) {
  const base = glass
    ? 'bg-white/10 backdrop-blur-sm border border-white/20'
    : 'bg-white border border-gray-200'
  return (
    <div
      {...props}
      className={`rounded-xl shadow-md ${base} ${className}`}
    />
  )
}
