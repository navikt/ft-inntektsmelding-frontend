import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <div className="bg-surface-danger-subtle">Hello /!</div>
})