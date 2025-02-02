"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Cloud, Loader2 } from "lucide-react"

export function ImageUpload({ onFilesSelected, uploading, setUploading }) {
  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length > 5) {
        alert("Maximum 5 files allowed")
        return
      }

      setUploading(true)
      try {
        const files = acceptedFiles.map((file) => ({
          file: file,
          preview: URL.createObjectURL(file),
          name: file.name,
        }))
        onFilesSelected(files)
      } catch (error) {
        console.error("Error processing files:", error)
      } finally {
        setUploading(false)
      }
    },
    [onFilesSelected, setUploading]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: true,
    maxFiles: 5,
  })

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <Cloud className="h-10 w-10 text-muted-foreground/50" />
        {uploading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {isDragActive ? "Drop files here" : "Drag & drop files or Browse"}
            </p>
            <p className="text-xs text-muted-foreground">Supported formats: JPEG, PNG</p>
          </>
        )}
      </div>
    </div>
  )
}

