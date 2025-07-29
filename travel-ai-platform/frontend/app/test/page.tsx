export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Test Page
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            This is a simple test page to check if the basic styling works.
          </p>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Test Card</h2>
            <p className="text-gray-300">
              If you can see this styled properly, the basic setup is working.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
