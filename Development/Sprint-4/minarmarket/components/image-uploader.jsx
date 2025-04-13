"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { X } from 'lucide-react';

export function ImageUploader({ onImageUpload, onRemoveImage, images = [], maxImages = 6 }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).slice(0, maxImages - images.length);
      if (newFiles.length > 0) {
        onImageUpload(newFiles);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).slice(0, maxImages - images.length);
      if (newFiles.length > 0) {
        onImageUpload(newFiles);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed p-4 rounded-md text-center cursor-pointer
                  ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  ${images.length >= maxImages ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          type="file"
          id="file-input"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={images.length >= maxImages}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <p className="text-sm text-gray-600">
            {images.length >= maxImages
              ? `Maximum ${maxImages} images allowed`
              : `Drag and drop or click to upload (${images.length}/${maxImages})`}
          </p>
        </div>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-md border">
                <Image
                  src={image instanceof File ? URL.createObjectURL(image) : image.url || image}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveImage(index);
                }}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
