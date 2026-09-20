import { Boxes } from 'lucide-react'

export default function Segments() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Boxes size={21} />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
          Segments
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Organisez vos clients en segments exploitables.
        </p>

        <div className="mt-8 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
          Ce module sera construit progressivement.
        </div>
      </div>
    </div>
  )
}
