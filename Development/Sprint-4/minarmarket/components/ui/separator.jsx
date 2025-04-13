import React from "react"
import clsx from "clsx" // optional if you want to handle class merging, else remove

export function Separator({ className = "" }) {
  return (
    <div
      className={clsx(
        "h-px w-full bg-gray-200", // default styles
        className
      )}
    />
  )
}

export default Separator
