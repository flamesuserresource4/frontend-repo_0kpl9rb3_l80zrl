import React from 'react';

function Display({ expression, result }) {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
      <div className="text-right text-zinc-400 text-sm tracking-wider truncate min-h-[20px]">
        {expression || '0'}
      </div>
      <div className="text-right text-4xl md:text-5xl font-semibold text-zinc-900 dark:text-zinc-100 mt-2 break-words">
        {result}
      </div>
    </div>
  );
}

export default Display;
