import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const startAgent = () => {
    setIsRunning(true);
    setLogs([]);
    
    const eventSource = new EventSource('http://localhost:3000/api/run');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.log) {
        setLogs(prev => [...prev, data.log]);
      }
      if (data.error) {
        setLogs(prev => [...prev, `[ERROR] ${data.error}`]);
        eventSource.close();
        setIsRunning(false);
      }
      if (data.done) {
        setLogs(prev => [...prev, `[SUCCESS] Agent workflow complete!`]);
        eventSource.close();
        setIsRunning(false);
      }
    };

    eventSource.onerror = (err) => {
      setLogs(prev => [...prev, `[ERROR] Connection failed. Is the server running?`]);
      eventSource.close();
      setIsRunning(false);
    };
  };

  const getLogClass = (log: string) => {
    if (log.includes('[ERROR]') || log.includes('Failed')) return 'log-line error';
    if (log.includes('[Agent]') || log.includes('Payment') || log.includes('SAP')) return 'log-line highlight';
    return 'log-line';
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Ace Marketer Autonomous Agent</h1>
        <p>Real-time SAP Tool Discovery & x402 Execution</p>
      </div>

      <button 
        className="launch-btn" 
        onClick={startAgent} 
        disabled={isRunning}
      >
        {isRunning ? 'Agent Executing...' : 'Launch Autonomous Agent'}
      </button>

      <div className="terminal" ref={terminalRef}>
        {logs.length === 0 ? (
          <div className="log-line" style={{ color: '#888' }}>Waiting for command...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className={getLogClass(log)}>
              {log}
            </div>
          ))
        )}
      </div>

      <div className="cards">
        <div className="card">
          <h3>Workflow Stats</h3>
          <p>Status: {isRunning ? 'Active ⚡' : 'Idle 💤'}</p>
          <p>Network: Solana Devnet</p>
          <p>x402 Protocol: @acedatacloud/x402-client</p>
          <p>SAP SDK: @oobe-protocol-labs/synapse-sap-sdk</p>
        </div>
        <div className="card">
          <h3>Generated Visual Asset</h3>
          {logs.some(l => l.includes('Generated Asset URL')) ? (
             <>
               <p style={{ color: '#00ffcc' }}>✓ Asset generated successfully.</p>
               <img 
                  src={logs.find(l => l.includes('Generated Asset URL'))?.split('URL]: ')[1] || ''} 
                  alt="Generated Asset" 
                  style={{ width: '100%', borderRadius: '12px', marginTop: '10px' }}
               />
             </>
          ) : (
            <p style={{ color: '#888' }}>Waiting for agent to reach Designer phase...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
