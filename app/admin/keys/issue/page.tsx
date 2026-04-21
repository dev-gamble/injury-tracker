import { CreateKeyForm } from '../CreateKeyForm'

export const dynamic = 'force-dynamic'

export default function AdminKeysIssuePage() {
  return (
    <section className="admin-card">
      <CreateKeyForm />
    </section>
  )
}
