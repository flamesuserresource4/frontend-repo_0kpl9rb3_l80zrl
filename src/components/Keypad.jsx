import React from 'react';

const buttons = [
  { label: 'C', variant: 'muted' },
  { label: '⌫', variant: 'muted' },
  { label: '%', variant: 'muted' },
  { label: '/', variant: 'accent' },
  { label: '7' },
  { label: '8' },
  { label: '9' },
  { label: '*', variant: 'accent' },
  { label: '4' },
  { label: '5' },
  { label: '6' },
  { label: '-', variant: 'accent' },
  { label: '1' },
  { label: '2' },
  { label: '3' },
  { label: '+', variant: 'accent' },
  { label: '(', variant: 'muted' },
  { label: '0' },
  { label: ')', variant: 'muted' },
  { label: '=', variant: 'primary' },
];

function Keypad({ onPress }) {
  const base =
    'h-14 md:h-16 rounded-xl text-lg md:text-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors';

  const variants = {
    default: 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100',
    muted:
      'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200',
    accent:
      'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300',
    primary:
      'col-span-1 md:col-span-1 bg-blue-600 hover:bg-blue-700 text-white',
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          className={`${base} ${variants[btn.variant || 'default']}`}
          onClick={() => onPress(btn.label)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

export default Keypad;
