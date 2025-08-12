'use client';
import React, { useState } from 'react'
import MessageIcon from '@/public/icons/MessageIcon';
import Link from 'next/link';
import { ArrowRight, } from 'lucide-react';
import { useSessionStore } from '@/stores/use-session-store';
import { useRouter } from 'next/navigation';

const Homepage = () => {
  const { session: user } = useSessionStore()
  const router = useRouter()
  const [wagerCondition, setWagerCondition] = useState('')
  const [amount, setAmount] = useState('')

  const handleBookWager = () => {
    // Validate required fields
    if (!wagerCondition.trim() || !amount.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Create wager data object
    const wagerData = {
      wagerCondition,
      amount,
      bookedBy: user?.name || '@user',
      wagerLink: `${window.location.origin}/wager/${Date.now()}` // Generate unique link
    }

    // Store in sessionStorage for the BookedWager component to read
    sessionStorage.setItem('currentWager', JSON.stringify(wagerData));

    // Navigate to booked wager page
    router.push('/history');
  }

  return (
    <main className="pt-20 pb-12 px-4 min-h-screen min-w-screen bg-[#ECF5F5]">

      {/* In-Play Wagers Section */}
      <div className="px-1 pb-1">
        <div className="max-w-4xl mx-auto  overflow-hidden">
          <div className="p-2 lg:p-2 text-center">
            <h2 className="text-3xl lg:text-3xl font-bold text-black mb-4">
              Wager on Your Takes
            </h2>
            <p className="text-gray-600 text-sm lg:text-base mb-8 w-[70%] max-w-2xl mx-auto">
              Settle peer-to-peer bets on live sports events with in-play wagers
            </p>

            <div className="px-4 py-4">
              <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-6">
                <h1 className="text-xl font-bold text-center text-black mb-8">
                  BOOK WAGER
                </h1>

                <div className="space-y-6">

                  {/* Wager Condition */}
                  <div className='text-left'>
                    <label className="block text-sm font-semibold text-black mb-2">
                      WAGER CONDITION<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={wagerCondition}
                      onChange={(e) => setWagerCondition(e.target.value)}
                      placeholder=""
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  {/* Amount */}
                  <div className='text-left'>
                    <label className="block text-sm font-semibold text-black mb-2">
                      AMOUNT<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder=""
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={handleBookWager}
                    className="w-full bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold py-3 px-6 rounded-full text-sm mt-8"
                  >
                    BOOK
                  </button>
                </div>
              </div>
            </div>


            <div className="mb-8">
              <div className="flex items-center justify-between bg-white border-1 border-[#847F83] rounded-full p-2 max-w-md mx-auto mb-6">
                <input
                  type="text"
                  placeholder="Paste wager link to join"
                  className="flex-1 bg-transparent outline-none px-3 text-sm text-gray-600 placeholder-gray-400"
                />
                <button className="bg-white text-black font-medium py-2 px-4 rounded-full text-sm ">
                  Wager
                </button>
              </div>
            </div>
            <div className="bg-white justify-around p-4 rounded-xl ">
              <div className="text-left mx-auto">
                <h3 className="font-semibold text-black mb-4 pb-1">
                  Booked wagers
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm text-gray-700">Mbappe to score in the second half</span>
                    <div className="flex items-center gap-1.5">
                      <button className="text-blue-500 text-xs underline">View</button>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Cancel</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">Inter Milan to win the UCL</span>
                    <div className="flex items-center gap-2">
                      <button className="text-blue-500 text-xs underline">View</button>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Cancel</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">Inter Milan to win the UCL</span>
                    <div className="flex items-center gap-2">
                      <button className="text-blue-500 text-xs underline">View</button>
                      <span className="bg-gray-300 text-gray-600 text-xs px-2 py-1 rounded">Withdraw</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wager Rooms Section */}
      <div className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/wager-rooms"
            className="block bg-gray-400 hover:bg-gray-500 transition-colors text-white rounded-2xl p-6 lg:p-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12  flex items-center justify-center">
                  <MessageIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-lg lg:text-xl">Wager rooms</h3>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </Link>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className='bg-[#141517] text-white'>
        <div className='border-t border-gray-700'>
          <div className='max-w-4xl mx-auto px-4 py-4 flex justify-between items-center text-xs'>
            <p className='text-gray-400'>© 2025 90+</p>
            <div className='flex gap-2 items-center text-gray-300'>
              <Link href={'/'} className="hover:text-white transition-colors">Support</Link>
              <span className='text-gray-600'>|</span>
              <Link href={'/'} className="hover:text-white transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Homepage
