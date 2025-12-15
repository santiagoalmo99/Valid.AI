import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params
    const title = searchParams.get('title') || 'My Startup Idea';
    const score = searchParams.get('score') || '92';
    
    // Determine color based on score (matching frontend logic)
    const scoreNum = parseInt(score);
    let scoreColor = '#34d399'; // emerald
    if (scoreNum < 40) scoreColor = '#ef4444';
    else if (scoreNum < 60) scoreColor = '#facc15';
    else if (scoreNum < 80) scoreColor = '#22d3ee';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 0%), linear-gradient(to bottom right, #000000, #111111)',
            backgroundSize: '50px 50px, 100% 100%',
            color: 'white',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Neon Glow spots */}
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'rgba(52, 211, 153, 0.15)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'rgba(34, 211, 238, 0.1)', filter: 'blur(100px)', borderRadius: '50%' }}></div>

          {/* Card Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.1)',
              borderRadius: '30px',
              padding: '40px 80px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              boxShadow: '0 0 50px rgba(0,0,0,0.5)',
            }}
          >
             {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
               <div style={{ width: '40px', height: '40px', background: 'linear-gradient(to top right, #34d399, #22d3ee)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold', fontSize: '20px' }}>V</div>
               <div style={{ fontSize: '30px', fontWeight: 'bold', letterSpacing: '2px' }}>VALID<span style={{ color: '#34d399' }}>.AI</span></div>
            </div>

            {/* Main Score */}
            <div style={{ display: 'flex', alignItems: 'flex-end', lineHeight: 1 }}>
               <span style={{ fontSize: '140px', fontWeight: '900', color: scoreColor, textShadow: `0 0 30px ${scoreColor}50` }}>{score}</span>
               <span style={{ fontSize: '80px', fontWeight: 'bold', color: '#64748b', marginBottom: '20px', marginLeft: '10px' }}>/100</span>
            </div>
            
            <div style={{ fontSize: '24px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '40px', fontWeight: 'bold' }}>
               Viability Score
            </div>

            {/* Project Name */}
            <div style={{ fontSize: '30px', color: 'white', maxWidth: '800px', textAlign: 'center', lineHeight: 1.4 }}>
               for <span style={{ fontWeight: 'bold', borderBottom: `3px solid ${scoreColor}` }}>{title}</span>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: '40px', fontSize: '20px', color: '#475569' }}>
            Validated by VALID.AI - The #1 AI Idea Validator
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
