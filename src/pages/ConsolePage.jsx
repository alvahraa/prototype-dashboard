import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal as TerminalIcon, 
  ShieldCheck, 
  Activity,
  Clock
} from 'lucide-react';
import { useVisitors, useBooks } from '../hooks';

/**
 * ConsolePage - Full Immersive Terminal Experience
 * 
 * A Unix-like shell interface for library system administration
 */

// Command history
const initialOutput = [
  { type: 'system', text: 'Library System Console v1.0.0' },
  { type: 'system', text: 'Type "help" for available commands.' },
  { type: 'divider' },
];

function ConsolePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(initialOutput);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const [uptime] = useState(() => Math.floor(Math.random() * 1000) + 100);

  const { visitors } = useVisitors();
  const { books } = useBooks();

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input on click
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Command parser
  const executeCommand = async (cmd) => {
    const command = cmd.trim().toLowerCase();
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    // Add command to history
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    // Add command to output
    setOutput(prev => [...prev, { type: 'input', text: cmd, time: timestamp }]);

    // Parse command
    if (command === 'help') {
      setOutput(prev => [...prev, 
        { type: 'response', text: 'Available commands:' },
        { type: 'code', text: '  help                  Show this help message' },
        { type: 'code', text: '  clear                 Clear terminal screen' },
        { type: 'code', text: '  whoami                Display current user' },
        { type: 'code', text: '  select * from visitors  Query visitor data' },
        { type: 'code', text: '  select * from books     Query book catalog' },
        { type: 'code', text: '  run diagnostics       Execute system diagnostics' },
        { type: 'code', text: '  status                Show system status' },
        { type: 'divider' },
      ]);
    } 
    else if (command === 'clear') {
      setOutput([
        { type: 'system', text: 'Terminal cleared.' },
        { type: 'divider' },
      ]);
    }
    else if (command === 'whoami') {
      setOutput(prev => [...prev, 
        { type: 'response', text: 'admin (privileged access)' },
        { type: 'divider' },
      ]);
    }
    else if (command === 'status') {
      setOutput(prev => [...prev, 
        { type: 'response', text: 'System Status:' },
        { type: 'code', text: `  Uptime:     ${uptime} hours` },
        { type: 'code', text: '  Connection: SECURE' },
        { type: 'code', text: '  Database:   OPERATIONAL' },
        { type: 'code', text: '  API:        HEALTHY' },
        { type: 'divider' },
      ]);
    }
    else if (command === 'select * from visitors') {
      const data = visitors?.slice(0, 5) || [];
      setOutput(prev => [...prev, 
        { type: 'response', text: `Query executed. ${data.length} rows returned.` },
        { type: 'json', text: JSON.stringify(data, null, 2) },
        { type: 'divider' },
      ]);
    }
    else if (command === 'select * from books') {
      const data = books?.slice(0, 5) || [];
      setOutput(prev => [...prev, 
        { type: 'response', text: `Query executed. ${data.length} rows returned.` },
        { type: 'json', text: JSON.stringify(data, null, 2) },
        { type: 'divider' },
      ]);
    }
    else if (command === 'run diagnostics') {
      const steps = [
        'Checking API connection...',
        'Verifying database integrity...',
        'Scanning system modules...',
        'Running security audit...',
        'Compiling diagnostic report...',
      ];
      
      for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 400));
        setOutput(prev => [...prev, { 
          type: 'progress', 
          text: `[${i + 1}/${steps.length}] ${steps[i]} OK` 
        }]);
      }
      
      await new Promise(r => setTimeout(r, 200));
      setOutput(prev => [...prev, 
        { type: 'success', text: 'Diagnostics complete. All systems operational.' },
        { type: 'divider' },
      ]);
    }
    else if (command === '') {
      // Empty command, do nothing
    }
    else {
      setOutput(prev => [...prev, 
        { type: 'error', text: `Error: Command not found: "${cmd}"` },
        { type: 'error', text: 'Type "help" for available commands.' },
        { type: 'divider' },
      ]);
    }

    setInput('');
  };

  // Handle key events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  // Render output line
  const renderLine = (line, index) => {
    const baseClass = 'font-mono text-sm leading-relaxed';
    
    switch (line.type) {
      case 'system':
        return <div key={index} className={`${baseClass} text-gray-500`}>{line.text}</div>;
      case 'input':
        return (
          <div key={index} className={`${baseClass} text-green-400`}>
            <span className="text-gray-500">[{line.time}] </span>
            <span className="text-emerald-400">root@library-system:~$ </span>
            {line.text}
          </div>
        );
      case 'response':
        return <div key={index} className={`${baseClass} text-white`}>{line.text}</div>;
      case 'code':
        return <div key={index} className={`${baseClass} text-gray-400`}>{line.text}</div>;
      case 'json':
        return <pre key={index} className={`${baseClass} text-cyan-400 whitespace-pre-wrap overflow-x-auto`}>{line.text}</pre>;
      case 'progress':
        return <div key={index} className={`${baseClass} text-yellow-400`}>{line.text}</div>;
      case 'success':
        return <div key={index} className={`${baseClass} text-emerald-400 font-medium`}>{line.text}</div>;
      case 'error':
        return <div key={index} className={`${baseClass} text-red-400`}>{line.text}</div>;
      case 'divider':
        return <div key={index} className="h-2"></div>;
      default:
        return <div key={index} className={baseClass}>{line.text}</div>;
    }
  };

  return (
    <div 
      className="h-full bg-gray-950 text-green-500 font-mono flex flex-col rounded-2xl overflow-hidden"
      onClick={handleContainerClick}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm text-gray-400">library-system-console</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>CONNECTION: SECURE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>STATUS: ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>UPTIME: {uptime}h</span>
          </div>
        </div>
      </div>

      {/* Main Output Area */}
      <div 
        ref={outputRef}
        className="flex-1 p-4 overflow-y-auto"
      >
        {output.map((line, i) => renderLine(line, i))}
      </div>

      {/* Input Line */}
      <div className="px-4 py-3 bg-gray-900 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-sm">root@library-system:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-green-400 text-sm outline-none caret-green-400"
            autoFocus
            spellCheck={false}
          />
          <motion.div 
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            className="w-2 h-4 bg-green-400"
          />
        </div>
      </div>
    </div>
  );
}

export default ConsolePage;
