import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'SealTheDeal - AI Contract Generator & E-Signature Platform'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
            }}
          >
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>S</span>
          </div>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SealTheDeal
          </span>
        </div>

        {/* Main Title */}
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            margin: '0 40px',
            lineHeight: '1.1',
            marginBottom: '20px',
          }}
        >
          AI Contract Generator
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '32px',
            color: '#cbd5e1',
            textAlign: 'center',
            margin: '0 40px',
            marginBottom: '40px',
          }}
        >
          Create & Sign Professional Contracts in Seconds
        </p>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#10b981',
              fontSize: '20px',
            }}
          >
            <span style={{ marginRight: '8px' }}>✓</span>
            AI-Powered
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#10b981',
              fontSize: '20px',
            }}
          >
            <span style={{ marginRight: '8px' }}>✓</span>
            E-Signatures
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#10b981',
              fontSize: '20px',
            }}
          >
            <span style={{ marginRight: '8px' }}>✓</span>
            Secure
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            color: '#64748b',
            fontSize: '24px',
          }}
        >
          sealthedeal.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
