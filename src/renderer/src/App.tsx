import { Button } from './components/shadcn/Button'

function App(): React.JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Hello World</h1>
      <Button>Button</Button>
    </div>
  )
}

export default App
