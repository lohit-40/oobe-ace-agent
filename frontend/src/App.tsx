import { useState, useRef, useEffect } from 'react';
import './App.css';

type Phase = 'idle' | 'sap' | 'research' | 'copywriting' | 'design' | 'done';

function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('idle');
  const [toasts, setToasts] = useState<{id: number, msg: string}[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  let toastCounter = 0;

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addToast = (msg: string) => {
    const id = ++toastCounter;
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const startAgent = () => {
    setIsRunning(true);
    setLogs([]);
    setCurrentPhase('sap');
    
    const eventSource = new EventSource('http://localhost:3000/api/run');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.log) {
        setLogs(prev => [...prev, data.log]);
        
        // Update Phase based on logs
        if (data.log.includes('Target Acquired')) setCurrentPhase('sap');
        if (data.log.includes('Phase 1: Research')) {
          setCurrentPhase('research');
          addToast("🔗 SAP Discovery Tx Confirmed");
        }
        if (data.log.includes('Phase 2: Copywriting')) {
          setCurrentPhase('copywriting');
          addToast("🔗 Research x402 Settled");
        }
        if (data.log.includes('Phase 3: Asset Generation')) {
          setCurrentPhase('design');
          addToast("🔗 Copywriter x402 Settled");
        }
      }
      if (data.error) {
        setLogs(prev => [...prev, `[ERROR] ${data.error}`]);
        eventSource.close();
        setIsRunning(false);
      }
      if (data.done) {
        setCurrentPhase('done');
        addToast("🔗 Asset Gen x402 Settled");
        addToast("✅ Workflow Complete");
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
    if (log.includes('[ERROR]') || log.includes('Failed') || log.includes('Cannot read properties')) return 'log-line error';
    if (log.includes('[SUCCESS]') || log.includes('Completed Successfully')) return 'log-line success';
    if (log.includes('⚠️')) return 'log-line highlight';
    if (log.includes('[Agent]') || log.includes('Payment') || log.includes('SAP')) return 'log-line highlight';
    return 'log-line typewriter-text'; // Apply typing effect class to standard logs
  };

  const phases: { id: Phase, label: string }[] = [
    { id: 'sap', label: 'SAP Auth & Discovery' },
    { id: 'research', label: 'Ace Research' },
    { id: 'copywriting', label: 'Ace Copywriter' },
    { id: 'design', label: 'Ace Designer' }
  ];

  const getPhaseStatus = (phase: Phase) => {
    const phaseOrder = ['idle', 'sap', 'research', 'copywriting', 'design', 'done'];
    const currentIndex = phaseOrder.indexOf(currentPhase);
    const thisIndex = phaseOrder.indexOf(phase);
    
    if (currentPhase === 'done' || thisIndex < currentIndex) return 'completed';
    if (thisIndex === currentIndex) return 'active';
    return '';
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Ace Marketer Autonomous Agent</h1>
        <p>Real-time SAP Tool Discovery & x402 On-Chain Execution</p>
      </div>

      <div className="workflow-graph">
        {phases.map((p, i) => (
          <div key={p.id} className={`node ${getPhaseStatus(p.id)}`}>
            {i + 1}. {p.label}
          </div>
        ))}
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
          <h3>⚡ Execution Context</h3>
          <p>Status: <span className="value" style={{ color: isRunning ? '#00f2fe' : '#fff' }}>{isRunning ? 'Executing On-Chain...' : (currentPhase === 'done' ? 'Completed ✅' : 'Idle 💤')}</span></p>
          <p>Network: <span className="value">Solana Devnet</span></p>
          <p>Payment Proto: <span className="value">@acedatacloud/x402</span></p>
          <p>Discovery: <span className="value">Synapse SAP SDK</span></p>
          <p>Agent Wallet: <span className="value">84di...LXjT</span></p>
        </div>
        <div className="card">
          <h3>🖼️ Generated Asset</h3>
          {logs.some(l => l.includes('Generated Asset URL')) ? (
             <>
               <img 
                  src={logs.find(l => l.includes('Generated Asset URL'))?.split('URL]: ')[1] || ''} 
                  alt="Generated Asset" 
               />
             </>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px', marginTop: '10px' }}>
              Waiting for agent to reach Designer phase...
            </div>
          )}
        </div>
      </div>

      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast">{t.msg}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
