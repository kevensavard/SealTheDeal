import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Get Started</h1>
          <p className="text-slate-300">Create your SealTheDeal account</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600',
              card: 'bg-slate-800 border-slate-600',
              headerTitle: 'text-white',
              headerSubtitle: 'text-slate-300',
              socialButtonsBlockButton: 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600',
              formFieldInput: 'bg-slate-700 border-slate-600 text-white',
              formFieldLabel: 'text-slate-300',
              footerActionLink: 'text-blue-400 hover:text-blue-300',
              identityPreviewText: 'text-slate-300',
              formResendCodeLink: 'text-blue-400 hover:text-blue-300',
            }
          }}
          afterSignUpUrl="/dashboard"
        />
      </div>
    </div>
  );
}
