import { Users } from 'lucide-react'

export default function Customers() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Users size={21} />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
          Customers
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Centralisez les clients issus de vos différents stores.
        </p>

      </div>
    </div>
  )
}
