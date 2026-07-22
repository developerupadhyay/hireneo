'use client'

import { useState } from 'react'
import { Copy, CheckCircle } from 'lucide-react'

export default function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Failed to copy", e)
    }
  }

  return (
    <div className="flex gap-2">
      <input 
        type="text" 
        readOnly 
        value={link} 
        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white/80 focus:outline-none" 
      />
      <button 
        onClick={handleCopy}
        className={`flex items-center gap-2 text-white px-4 py-2 rounded-xl transition-all font-medium min-w-[100px] justify-center ${
          copied ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary-dark'
        }`}
      >
        {copied ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy
          </>
        )}
      </button>
    </div>
  )
}
