"use client";

export default function DebugPage() {
  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Debug Page</h1>
      <div id="output"></div>
      <script dangerouslySetInnerHTML={{__html: `
        const output = document.getElementById('output');
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userId = localStorage.getItem('userId');
        
        output.innerHTML = \`
          <h2>localStorage Contents:</h2>
          <p><strong>accessToken:</strong> \${accessToken ? accessToken.substring(0, 50) + '...' : 'NOT FOUND'}</p>
          <p><strong>refreshToken:</strong> \${refreshToken ? refreshToken.substring(0, 50) + '...' : 'NOT FOUND'}</p>
          <p><strong>userId:</strong> \${userId || 'NOT FOUND'}</p>
          <hr />
          <p><a href="/onboarding">Go to Onboarding</a></p>
        \`;
      `}} />
    </div>
  );
}
