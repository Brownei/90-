import { Link } from "@remix-run/react";
import { Button } from "../components/ui/Button";
import { useParams } from "@remix-run/react";

export default function MatchHub() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="bg-[#4339ca] p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-white hover:opacity-80">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Exit Hub
            </div>
          </Link>
          
          <div className="flex items-center gap-8 text-xl font-semibold">
            <span>BAR</span>
            <span className="text-2xl">4 - 1</span>
            <span>MCI</span>
          </div>

          <Button variant="outline" className="border-white text-white">
            Share Link
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="max-w-3xl mx-auto py-6 px-4">
        <div className="space-y-6">
          {/* Sample Comments */}
          <div className="space-y-4">
            <div className="bg-[#2a2a2a] rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">User001</div>
                  <p>Clearly offside, VAR officials are on one</p>
                </div>
                <div className="flex items-center gap-1">
                  <span>112</span>
                </div>
              </div>
              <button className="text-gray-400 text-sm mt-2">Reply Comment</button>
            </div>
            
            {/* Bot Comment */}
            <div className="bg-[#2a2a2a] rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">90 BOT</div>
                  <p>GOAL FOR BARCELONA 4 - 1</p>
                  <p className="text-sm text-gray-400">Robert Lewandowski</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] p-4 border-t border-gray-800">
          <div className="max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Comment"
              className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-gray-700 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 