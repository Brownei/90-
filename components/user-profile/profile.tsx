import { ArrowLeft, QrCode, Send, XCircle } from 'lucide-react';
import React from 'react';

const wagers = [
  {
    opponent: 'Username1 Vs Username2',
    date: '21/07/2025',
    description: '“Mbappe to score in the second half ”',
    amount: '50 USDC',
    status: 'error',
    label: '',
    icon: <XCircle className="h-5 w-5 text-red-500" />,
  },
  {
    opponent: 'Username1 Vs Username2',
    date: '21/07/2025',
    description: '“Mbappe to score in the second half ”',
    amount: '50 USDC',
    status: 'lost',
    label: 'Lost',
    icon: null,
  },
  {
    opponent: 'Username1 Vs Username2',
    date: '21/07/2025',
    description: '“Mbappe to score in the second half ”',
    amount: '50 USDC',
    status: 'won',
    label: 'Won',
    icon: null,
  },
  {
    opponent: 'Username1 Vs Username2',
    date: '21/07/2025',
    description: '“Mbappe to score in the second half ”',
    amount: '50 USDC',
    status: 'cancelled',
    label: 'Cancelled',
    icon: null,
  },
];

const statusColor = {
  lost: 'bg-red-500 text-white',
  won: 'bg-green-500 text-white',
  cancelled: 'bg-black text-white',
};

const Profile = () => {
  return (
    <div className=" pt-20 pb-12 flex w-full flex-col items-center px-4">
      <div className="flex w-full max-w-[320px] flex-col items-center">
        <button className="mb-2 self-start">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>


        <div className="mb-4 text-center">
          <h2 className="text-sm font-semibold text-gray-800">PROFILE</h2>
          <p className="text-xs text-gray-600">View your profile</p>
        </div>

        <div className="mb-4 text-center">
          <h3 className="text-md font-semibold text-black">
            Username Wallet{' '}
            <span className="text-sm text-gray-500">8za3...sx2Z</span>
          </h3>
        </div>

        <div className="mb-6 flex w-full max-w-sm items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
          <div>
            <p className="text-xs text-gray-600">Wallet balance:</p>
            <p className="text-lg font-bold text-black">$50.00</p>
          </div>
          <div className="flex items-center gap-2">
            <button>
              <QrCode className="h-5 w-5 text-gray-600" />
            </button>
            <button>
              <Send className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="max-h-[300px] w-full max-w-sm overflow-y-auto rounded-lg bg-white p-4 shadow-md">
          <h4 className="text-md mb-4 font-semibold text-black">
            Wagers History
          </h4>

          <div className="space-y-4">
            {wagers.map((wager, idx) => (
              <div key={idx} className="border-b pb-3">
                <div className="flex items-center justify-between text-sm font-semibold text-black">
                  <span>{wager.opponent}</span>
                  <span className="text-xs text-gray-500">{wager.date}</span>
                </div>
                <p className="mt-1 text-sm text-gray-700">
                  {wager.description}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-semibold">{wager.amount}</span>
                  {wager.icon ? (
                    wager.icon
                  ) : (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[wager.status as keyof typeof statusColor]}`}
                    >
                      {wager.label}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="mt-6 w-full max-w-sm rounded-full bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700">
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default Profile;
