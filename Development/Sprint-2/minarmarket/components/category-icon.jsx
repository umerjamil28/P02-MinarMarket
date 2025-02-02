import Image from "next/image"
import Link from "next/link"



export function CategoryIcon({ label, href, icon }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2">
      <div className="relative h-16 w-16 rounded-full bg-muted p-3">
        <Image
          src={icon || "/placeholder.svg"}
          alt={label}
          fill
          className="object-cover"
        />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}

