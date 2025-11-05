import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Display from './components/Display.jsx';
import Keypad from './components/Keypad.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';

// Validate and evaluate a math expression safely
function evaluateExpression(expr) {
  if (!expr) return '';
  // Only allow digits, operators, dots, spaces and parentheses
  const safe = /^[0-9+\-*/%().\s]+$/.test(expr);
  if (!safe) throw new Error('Invalid characters');

  // Prevent eval on obviously invalid endings (e.g., trailing operator)
  let cleaned = expr.trim();
  while (/[+\-*/%.]$/.test(cleaned)) {
    cleaned = cleaned.slice(0, -1);
  }
  if (!cleaned) return '';

  // Basic parentheses balance check
  const open = (cleaned.match(/\(/g) || []).length;
  const close = (cleaned.match(/\)/g) || []).length;
  if (close > open) throw new Error('Unbalanced parentheses');
  // Auto-close if one is missing for preview/eval
  cleaned = cleaned + ')'.repeat(open - close);

  // Evaluate using Function after validation
  // eslint-disable-next-line no-new-func
  const result = Function(`"use strict"; return (${cleaned})`)();
  if (typeof result === 'number' && Number.isFinite(result)) {
    // Normalize -0 to 0
    return Object.is(result, -0) ? 0 : +parseFloat(result.toFixed(10));
  }
  throw new Error('Computation error');
}

function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [history, setHistory] = useState([]);

  const appendToken = useCallback((token) => {
    setExpression((prev) => {
      if (token === '.') {
        // Ensure only one dot per number segment
        const parts = prev.split(/[^0-9.]/);
        const last = parts[parts.length - 1] || '';
        if (last.includes('.')) return prev; // ignore extra dot
        return prev + token;
      }

      if ('+-*/%'.includes(token)) {
        if (prev === '' && token !== '-') return prev; // disallow leading operator except minus
        // Prevent two operators in a row (allow "(-" for negative numbers)
        if (/[+\-*/%]$/.test(prev)) {
          // Replace the last operator with the new one
          return prev.slice(0, -1) + token;
        }
        return prev + token;
      }

      if (token === '(') {
        // Insert implicit multiplication like "2(3" becomes "2*(3"
        if (/[0-9)]$/.test(prev)) return prev + '*' + token;
        return prev + token;
      }
      if (token === ')') {
        // Only add if there's an unmatched '('
        const open = (prev.match(/\(/g) || []).length;
        const close = (prev.match(/\)/g) || []).length;
        if (open > close && /[0-9)]$/.test(prev)) return prev + token;
        return prev;
      }

      // Digits
      if (/^\d$/.test(token)) {
        return prev + token;
      }

      return prev;
    });
  }, []);

  const handlePress = useCallback(
    (label) => {
      if (label === 'C') {
        setExpression('');
        setResult('0');
        return;
      }
      if (label === '⌫') {
        setExpression((prev) => prev.slice(0, -1));
        return;
      }
      if (label === '=') {
        try {
          const value = evaluateExpression(expression);
          if (value !== '' && value !== undefined) {
            setResult(String(value));
            setHistory((h) => [
              { expression: expression.trim(), result: String(value) },
              ...h,
            ].slice(0, 20));
          }
        } catch (e) {
          setResult('Error');
        }
        return;
      }

      appendToken(label);
    },
    [appendToken, expression]
  );

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      const { key } = e;
      if ((/^[0-9]$/).test(key)) return appendToken(key);
      if (['+', '-', '*', '/', '%', '(', ')', '.'].includes(key)) return appendToken(key);
      if (key === 'Enter' || key === '=') return handlePress('=');
      if (key === 'Backspace') return handlePress('⌫');
      if (key === 'Escape') return handlePress('C');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [appendToken, handlePress]);

  const preview = useMemo(() => {
    if (!expression) return '0';
    try {
      const val = evaluateExpression(expression);
      return val === '' ? '0' : String(val);
    } catch (e) {
      return result; // keep last confirmed result on error
    }
  }, [expression, result]);

  const reuseFromHistory = (expr) => {
    setExpression(expr);
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-50">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Calculator</h1>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-4">
            <Display expression={expression} result={preview} />
            <Keypad onPress={handlePress} />
          </div>
          <div className="md:col-span-1">
            <HistoryPanel history={history} onReuse={reuseFromHistory} onClear={clearHistory} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Tip: Use your keyboard to type numbers and operators. Press Enter to evaluate, Escape to clear, Backspace to delete.
        </p>
      </div>
    </div>
  );
}

export default App;
