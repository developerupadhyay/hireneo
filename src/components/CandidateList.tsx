'use client'

import { useState } from 'react'
import { Video, Users, Search, ExternalLink, ThumbsUp, ThumbsDown, Clock, ChevronDown, ChevronUp, Download } from 'lucide-react'
import { updateInterviewStatus } from '@/app/dashboard/positions/[id]/candidates/actions'

interface QuestionItem {
  id: string
  content: string
}

interface VideoResponseItem {
  id: string
  questionId: string
  videoUrl: string
  createdAt?: string | Date
}

interface CandidateItem {
  id?: string
  name: string
  email: string
}

interface InterviewItem {
  id: string
  status: string
  createdAt: string | Date
  candidate: CandidateItem
  responses: VideoResponseItem[]
}

interface PositionItem {
  id: string
  title: string
  questions: QuestionItem[]
}

interface CandidateListProps {
  interviews: InterviewItem[]
  position: PositionItem
}

export default function CandidateList({ interviews, position }: CandidateListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [expandedId, setExpandedId] = useState<string | null>(interviews[0]?.id || null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleStatusChange = async (interviewId: string, newStatus: string) => {
    setIsUpdating(interviewId)
    try {
      await updateInterviewStatus(interviewId, newStatus, position.id)
    } catch (e) {
      console.error('Failed to update candidate status:', e)
      alert('Could not update candidate status.')
    } finally {
      setIsUpdating(null)
    }
  }

  const exportToCSV = () => {
    if (filteredInterviews.length === 0) return
    const headers = ['Candidate Name', 'Candidate Email', 'Status', 'Video Responses Count', 'Date Submitted']
    const rows = filteredInterviews.map((i) => [
      `"${i.candidate.name.replace(/"/g, '""')}"`,
      `"${i.candidate.email.replace(/"/g, '""')}"`,
      i.status,
      i.responses.length,
      `"${new Date(i.createdAt).toISOString()}"`,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `hireneo-${position.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-candidates.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.candidate.email.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (statusFilter === 'ALL') return true
    if (statusFilter === 'COMPLETED') return interview.status === 'COMPLETED'
    if (statusFilter === 'SHORTLISTED') return interview.status === 'SHORTLISTED'
    if (statusFilter === 'REJECTED') return interview.status === 'REJECTED'
    if (statusFilter === 'STARTED') return interview.status === 'STARTED'
    return true
  })

  return (
    <div className="space-y-5">
      {/* Search & Filter Bento Bar */}
      <div className="bento-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name or email..."
            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 micro-tactile transition-all min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Filter Tabs with Micro-Tactile states */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
            {[
              { id: 'ALL', label: `All (${interviews.length})` },
              { id: 'COMPLETED', label: 'Completed' },
              { id: 'SHORTLISTED', label: 'Shortlisted' },
              { id: 'REJECTED', label: 'Rejected' },
            ].map((tab) => {
              const isActive = statusFilter === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap min-h-[40px] touch-target-48 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-bold micro-tactile'
                      : 'text-slate-700 dark:text-white/70 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={exportToCSV}
            title="Export candidates to CSV"
            disabled={filteredInterviews.length === 0}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-white/80 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 shadow-xs transition-colors disabled:opacity-40 flex-shrink-0 min-h-[40px] touch-target-48"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Candidates List Bento Cards */}
      <div className="space-y-4">
        {filteredInterviews.length === 0 ? (
          <div className="bento-card p-12 text-center">
            <Users className="w-10 h-10 text-slate-300 dark:text-white/20 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              No matching candidates found
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Try adjusting your search query or status filter.
            </p>
          </div>
        ) : (
          filteredInterviews.map((interview) => {
            const isExpanded = expandedId === interview.id
            const isCompleted = interview.status === 'COMPLETED'
            const isShortlisted = interview.status === 'SHORTLISTED'
            const isRejected = interview.status === 'REJECTED'

            let statusBadge = (
              <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider">
                In Progress
              </span>
            )
            if (isShortlisted) {
              statusBadge = (
                <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider">
                  ★ Shortlisted
                </span>
              )
            } else if (isRejected) {
              statusBadge = (
                <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider">
                  Rejected
                </span>
              )
            } else if (isCompleted) {
              statusBadge = (
                <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider">
                  Completed
                </span>
              )
            }

            return (
              <div
                key={interview.id}
                className="bento-card overflow-hidden transition-all"
              >
                {/* Header Row */}
                <div className="p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold uppercase shadow-sm flex-shrink-0">
                      {interview.candidate.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                          {interview.candidate.name}
                        </h3>
                        {statusBadge}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-white/50 truncate mt-0.5">
                        <span className="font-mono">{interview.candidate.email}</span> • Applied {new Date(interview.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Expand Toggle with >=48px Touch Targets */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-white/5 flex-wrap sm:flex-nowrap">
                    {/* Status change actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(interview.id, 'SHORTLISTED')}
                        title="Shortlist Candidate"
                        disabled={isUpdating === interview.id || isShortlisted}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 min-h-[42px] touch-target-48 ${
                          isShortlisted
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-900/40 hover:bg-emerald-100'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Shortlist</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(interview.id, 'REJECTED')}
                        title="Reject Candidate"
                        disabled={isUpdating === interview.id || isRejected}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 min-h-[42px] touch-target-48 ${
                          isRejected
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-900/40 hover:bg-rose-100'
                        }`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>

                    {/* View Responses Expand Button */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : interview.id)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-white text-xs font-semibold shadow-xs transition-colors min-h-[42px] touch-target-48"
                    >
                      <Video className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="num-tabular font-mono">{interview.responses.length} {interview.responses.length === 1 ? 'Response' : 'Responses'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Video Responses Shelf */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-black/30 border-t border-slate-200/80 dark:border-white/10">
                    {interview.responses.length === 0 ? (
                      <div className="text-center py-6">
                        <Clock className="w-8 h-8 text-slate-300 dark:text-white/20 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 dark:text-white/50">
                          Candidate has not recorded any responses yet.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {interview.responses.map((response, idx) => {
                          const question = position.questions.find((q) => q.id === response.questionId)
                          return (
                            <div
                              key={response.id}
                              className="bento-card p-4 bg-white dark:bg-[#0c111a]"
                            >
                              <div className="flex items-start justify-between gap-3 mb-2.5">
                                <div className="flex items-start gap-2 min-w-0">
                                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded flex-shrink-0">
                                    Q{idx + 1}
                                  </span>
                                  <p className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2">
                                    {question?.content || 'Question prompt'}
                                  </p>
                                </div>
                                <a
                                  href={response.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open raw video"
                                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded transition-colors touch-target-48 min-h-[36px] min-w-[36px] flex items-center justify-center"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                              <video
                                src={response.videoUrl}
                                controls
                                preload="metadata"
                                className="w-full rounded-xl bg-black aspect-video object-cover border border-slate-200 dark:border-white/10"
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
