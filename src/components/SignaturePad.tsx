'use client';

import { useRef, useEffect, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface SignaturePadProps {
  onSignatureChange: (signatureData: string | null) => void;
  className?: string;
}

export default function SignaturePad({ onSignatureChange, className = '' }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match the display size exactly
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    
    // Scale the context to match the device pixel ratio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Set drawing styles
    ctx.strokeStyle = '#000000'; // Black ink for better visibility
    ctx.lineWidth = 3; // Good line thickness
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent default touch behavior to stop page scrolling on mobile
    e.preventDefault();
    
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    const x = e.type.includes('mouse') 
      ? (e as React.MouseEvent).clientX - rect.left
      : (e as React.TouchEvent).touches[0].clientX - rect.left;
    const y = e.type.includes('mouse')
      ? (e as React.MouseEvent).clientY - rect.top
      : (e as React.TouchEvent).touches[0].clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent default touch behavior to stop page scrolling on mobile
    e.preventDefault();
    
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    const x = e.type.includes('mouse')
      ? (e as React.MouseEvent).clientX - rect.left
      : (e as React.TouchEvent).touches[0].clientX - rect.left;
    const y = e.type.includes('mouse')
      ? (e as React.MouseEvent).clientY - rect.top
      : (e as React.TouchEvent).touches[0].clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent default touch behavior to stop page scrolling on mobile
    if (e) e.preventDefault();
    
    setIsDrawing(false);
    
    // Capture signature when drawing stops
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check if there's any drawing by looking for non-white pixels
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasContent = imageData.data.some((value, index) => {
      // Check if any pixel is not white (RGB values not all 255)
      if (index % 4 === 0) { // Red channel
        const r = value;
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        return r < 250 || g < 250 || b < 250; // Not pure white
      }
      return false;
    });
    
    if (hasContent) {
      setHasSignature(true);
      // Capture with white background
      const signatureData = canvas.toDataURL('image/png', 1.0);
      console.log('Signature captured:', signatureData.substring(0, 50) + '...'); // Debug log
      onSignatureChange(signatureData);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    // Clear canvas completely
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Reset white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Reset drawing styles after clearing
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    setHasSignature(false);
    onSignatureChange(null);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="bg-slate-700 border-2 border-dashed border-slate-500 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PencilIcon className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Draw your signature</span>
          </div>
          {hasSignature && (
            <button
              onClick={clearSignature}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
        
        <canvas
          ref={canvasRef}
          className="w-full h-32 bg-gray-100 rounded border cursor-crosshair"
          style={{ touchAction: 'none' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => {
            e.preventDefault();
            startDrawing(e);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            draw(e);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopDrawing(e);
          }}
        />
        
        <p className="text-xs text-slate-400 mt-2">
          {hasSignature ? 'Signature captured ✓' : 'Use your mouse or finger to draw your signature'}
        </p>
      </div>
    </div>
  );
}
