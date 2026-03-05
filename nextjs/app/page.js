export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">RTM Portal</h1>
          <p className="text-xl mb-8">Welcome to Radio Televisyen Malaysia</p>
          <p className="text-base-content/70">Your gateway to news, programs, and more</p>
        </div>

        {/* DaisyUI Components Demo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">News & Updates</h2>
              <p>Stay informed with the latest news and updates from RTM.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm">Read More</button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Programs</h2>
              <p>Explore our wide range of television and radio programs.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm">Browse</button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Directory</h2>
              <p>Find contact information and directory listings.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm">Search</button>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Demo */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-accent">Accent</button>
          <button className="btn btn-success">Success</button>
          <button className="btn btn-warning">Warning</button>
          <button className="btn btn-error">Error</button>
        </div>
      </div>
    </main>
  )
}
