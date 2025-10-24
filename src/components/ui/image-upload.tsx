'use client'

import * as React from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string | null
  onChange: (value: string | null) => void
  disabled?: boolean
  maxSize?: number // in MB
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  maxSize = 2, // 2MB default
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(value || null)
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setPreview(value || null)
  }, [value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSize) {
      setError(`Image size must be less than ${maxSize}MB`)
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setPreview(base64String)
      onChange(base64String)
      setError(null)
    }
    reader.onerror = () => {
      setError('Failed to read file')
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <div className="bg-muted relative aspect-square w-full overflow-hidden rounded-lg">
            <img src={preview} alt="Product preview" className="h-full w-full object-cover" />
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon-sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            'bg-muted hover:bg-muted/80 flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors',
            disabled && 'cursor-not-allowed opacity-50',
            !disabled && 'cursor-pointer'
          )}
        >
          <ImageIcon className="text-muted-foreground h-12 w-12" />
          <div className="text-center">
            <p className="text-sm font-medium">Click to upload image</p>
            <p className="text-muted-foreground text-xs">Max size: {maxSize}MB</p>
          </div>
          <Upload className="text-muted-foreground h-5 w-5" />
        </button>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}
