import { Button } from '@/components/ui/button'

const _examplePatient: fhir4.Patient = {
  resourceType: 'Patient',
  id: 'example',
}

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Body Check Dashboard</h1>
        <p className="text-muted-foreground">React · Vite · Tailwind v4 · React Query · FHIR R4 · Shadcn</p>
        <Button>Get Started</Button>
      </div>
    </div>
  )
}

export default App
