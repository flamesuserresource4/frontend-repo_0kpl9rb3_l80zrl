import React from 'react';

function HistoryPanel({ history, onReuse, onClear }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">History</h3>
        <button
          onClick={onClear}
          className="text-xs px-2 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
        >
          Clear
        </button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {history.length === 0 && (
          <div className="text-xs text-zinc-400">No calculations yet</div>
        )}
        {history.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onReuse(item.expression)}
            className="w-full text-left text-sm p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
            title="Click to reuse expression"
          >
            <div className="text-zinc-500 dark:text-zinc-400">{item.expression}</div>
            <div className="text-zinc-900 dark:text-zinc-100 font-medium">= {item.result}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HistoryPanel;
