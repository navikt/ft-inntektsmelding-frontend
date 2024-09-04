import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$id/vis')({
  component: () => <div>Hello /$id/vis!</div>
})
