'use client'

import { useState, useSyncExternalStore } from 'react'
import { Copy, CheckCircle, ExternalLink } from 'lucide-react'

const emptySubscribe = () => () => {}
const getOriginSnapshot = () => (typeof window !== 'undefined' ? window.location.origin : '')
const getServerOriginSnapshot = () => ''

export default function CopyLinkButton({ link, path }: { link?: string; path?: string }) {
  const [copied, setCopied] = useState(false)
  const origin = useSyncExternalStore(emptySubscribe, getOriginSnapshot, getServerOriginSnapshot)

  const computeUrl = (): string => {
    if (!origin) return link || path || ''
    if (path) {
      return `${origin}${path.startsWith('/') ? '' : '/'}${path}`
    }
    if (link) {
      try {
        const parsed = new URL(link)
        return `${origin}${parsed.pathname}${parsed.search}`
      } catch {
        return `${origin}${link.startsWith('/') ? '' : '/'}${link}`
      }
    }
    return ''
  }

  const fullUrl = computeUrl()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('Failed to copy', e)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <div className="relative flex-1">
        <input 
          type="text" 
          readOnly 
          value={fullUrl} 
          aria-label="Interview sharing URL"
          className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white/90 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40 select-all transition-colors" 
        />
      </div>
      <div className="flex items-center gap-2">
        <button 
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Link copied to clipboard" : "Copy interview link"}
          className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            copied 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
          }`}
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </>
          )}
        </button>
        {fullUrl && (
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open interview in new tab"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
}
