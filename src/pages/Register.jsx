import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../auth/useAuth'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    organization: {
      name: '',
      slug: '',
    },
    user: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })
  const [errors, setErrors] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const handleOrganizationChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      organization: {
        ...current.organization,
        [name]: value,
      },
    }))
  }

  const handleUserChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      user: {
        ...current.user,
        [name]: value,
      },
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrors([])
    setSubmitting(true)

    try {
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      const responseErrors = requestError.response?.data?.errors

      setErrors(
        Array.isArray(responseErrors)
          ? responseErrors
          : [requestError.response?.data?.error || 'Inscription impossible.'],
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
            R
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Créer votre espace Revora
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Votre organisation et votre compte propriétaire seront créés
            ensemble.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {errors.length > 0 && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <ul className="space-y-1">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Organisation
              </h2>

              <div className="mt-3 space-y-4">
                <input
                  type="text"
                  name="name"
                  value={form.organization.name}
                  onChange={handleOrganizationChange}
                  required
                  placeholder="Nom de votre entreprise"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

                <input
                  type="text"
                  name="slug"
                  value={form.organization.slug}
                  onChange={handleOrganizationChange}
                  required
                  placeholder="nom-de-votre-entreprise"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Propriétaire
              </h2>

              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="first_name"
                  value={form.user.first_name}
                  onChange={handleUserChange}
                  required
                  placeholder="Prénom"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

                <input
                  type="text"
                  name="last_name"
                  value={form.user.last_name}
                  onChange={handleUserChange}
                  required
                  placeholder="Nom"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="mt-4 space-y-4">
                <input
                  type="email"
                  name="email"
                  value={form.user.email}
                  onChange={handleUserChange}
                  required
                  autoComplete="email"
                  placeholder="vous@entreprise.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

                <input
                  type="password"
                  name="password"
                  value={form.user.password}
                  onChange={handleUserChange}
                  required
                  autoComplete="new-password"
                  placeholder="Mot de passe"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

                <input
                  type="password"
                  name="password_confirmation"
                  value={form.user.password_confirmation}
                  onChange={handleUserChange}
                  required
                  autoComplete="new-password"
                  placeholder="Confirmer le mot de passe"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Création...' : 'Créer mon espace'}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Déjà inscrit ?{' '}
            <Link
              to="/login"
              className="font-semibold text-slate-900 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
