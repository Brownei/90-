import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const transactions = [
  {
    type: 'Received',
    from: 'HSjB...844K',
    amount: '+10 USDC',
    icon: '/usdc-icon.png',
    variant: 'positive',
  },
  {
    type: 'Sent',
    to: 'HSjB...844K',
    amount: '-0.00204 USDC',
    icon: '/usdc-icon.png',
    variant: 'negative',
  },
  {
    type: 'App Interaction',
    amount: '-0.000005 USDC',
    icon: null,
    variant: 'neutral',
  },
  {
    type: 'Received',
    from: 'ID-Wager45',
    amount: '+10 USDC',
    icon: '/wager-icon.png',
    variant: 'positive',
  },
];

const getAmountColor = (variant: string) => {
  switch (variant) {
    case 'positive':
      return 'text-green-500';
    case 'negative':
      return 'text-gray-800';
    case 'neutral':
    default:
      return 'text-gray-800';
  }
};

const History = () => {
  return (
    <main className="pt-20 pb-12 px-4 min-h-screen min-w-screen bg-[#ECF5F5]">
      <button className="mb-2 self-start">
        <ArrowLeft className="h-5 w-5 text-gray-600" />
      </button>

      <div className="mb-6 text-center">
        <h2 className="text-sm font-semibold text-gray-800">
          TRANSACTION HISTORY
        </h2>
        <p className="text-xs text-gray-600">Manage your transactions</p>
      </div>

      <p className="mb-2 text-xs text-gray-500">June 17, 2025</p>

      <div className="space-y-3">
        {transactions.map((tx, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              {tx.icon ? (
                ''
              ) : (
                <CheckCircle className="h-8 w-8 text-green-500" />
              )}

              <div>
                <p className="text-sm font-medium text-gray-800">{tx.type}</p>
                {tx.from && (
                  <p className="text-xs text-gray-500">From: {tx.from}</p>
                )}
                {tx.to && <p className="text-xs text-gray-500">To: {tx.to}</p>}
              </div>
            </div>

            <p
              className={`text-sm font-semibold ${getAmountColor(tx.variant)}`}
            >
              {tx.amount}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default History;
