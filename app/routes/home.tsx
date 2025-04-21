import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "90+ - The Future of Live Football Engagement" },
    { name: "description", content: "The center stage for the Global game" },
  ];
}

export default function Home() {
  const { login, isAuthenticated, user, logout, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <img src="/logo.svg" alt="90+" className="h-8" />
        </div>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src={user?.profileImageUrl} 
                alt={user?.username} 
                className="w-8 h-8 rounded-full"
              />
              <span>@{user?.username}</span>
            </div>
            <Button 
              variant="outline" 
              className="border-white text-white"
              onClick={logout}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button 
            variant="primary" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={login}
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Connect X"}
          </Button>
        )}
      </header>

      {/* Hero Section */}
      <section className="text-center py-32 px-4">
        <h1 className="text-6xl font-bold mb-4">
          The center stage for the<br />Global game
        </h1>
        <p className="text-xl mb-8">
          The Future of Live Football Engagement, Powered by You!
        </p>
        <div className="flex gap-4 justify-center">
          {/* <Link to="/match/barcelona-vs-mci"> */}
            <Button variant="outline" className="border-white text-white">
              Join the Conversation
            </Button>
          {/* </Link> */}
          <Button variant="outline" className="border-white text-white">
            Follow Us
          </Button>
        </div>
      </section>

      {/* Comment Hubs Section */}
      <section className="py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Comment Hubs</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto">
          Step into the Comment Hub, where fans from all over the world unite
          to debate, celebrate, and interact in real-time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="bg-[#f5f5f5] bg-opacity-10 p-6 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <img src="/icons/banter.svg" alt="Unfiltered Banter" />
            </div>
            <h3>Unfiltered Banter</h3>
          </div>
          <div className="bg-[#f5f5f5] bg-opacity-10 p-6 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <img src="/icons/rise.svg" alt="Rise to the Top" />
            </div>
            <h3>Rise to the Top</h3>
          </div>
          <div className="bg-[#f5f5f5] bg-opacity-10 p-6 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <img src="/icons/match.svg" alt="Comment Match" />
            </div>
            <h3>Comment Match</h3>
          </div>
          <div className="bg-[#f5f5f5] bg-opacity-10 p-6 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <img src="/icons/no-limits.svg" alt="No Borders/Limit" />
            </div>
            <h3>No Borders/Limit</h3>
          </div>
        </div>
      </section>

      {/* Predict the Game Section */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <h2 className="text-4xl font-bold text-center mb-4">Predict the Game</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto">
          Feel the tension before kickoff? Or that gut feeling at halftime? With
          Oracle, your instincts aren't just guesses—they're currency.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <img src="/icons/shots.svg" alt="Call the Shots" />
            </div>
            <h3>Call the Shots</h3>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <img src="/icons/win.svg" alt="Win More" />
            </div>
            <h3>Win More</h3>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <img src="/icons/play.svg" alt="Play Your Way" />
            </div>
            <h3>Play Your Way</h3>
          </div>
        </div>
      </section>

      {/* Sidebets Section */}
      <section className="py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Sidebets: Coming Soon — Bet on Your Banter
        </h2>
        <p className="text-center mb-12 max-w-2xl mx-auto">
          Soon, you'll be able to instantly bet your takes during live matches.
          Whether it's a bold prediction or a hot debate, Sidebets will let you
          put your insights on the line, enabling Peer to Peer bets
        </p>
      </section>

      {/* Onboarding Section */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Seamless Onboarding:<br />Jump In, No Hassle
            </h2>
            <p className="mb-8">
              Joining 90+ is as easy as a tap. Whether you're a Web3 pro or new to the game, we make it simple.
            </p>
            <Button variant="outline" className="border-white text-white">
              Join the Conversation
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img src="/icons/connect.svg" alt="Connect" className="w-6 h-6" />
              <p>Connect your X(formerly Twitter) Account Seamlessly</p>
            </div>
            <div className="flex items-center gap-4">
              <img src="/icons/stay.svg" alt="Stay" className="w-6 h-6" />
              <p>Stay in the Loop: Get match alerts and updates straight to your inbox.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">What's Next? Stay Tuned...</h2>
          <p className="mb-8">
            The game never stops and neither do we. Big features are on the
            horizon, and you won't want to miss what's coming next.
            Be part of the future of live football interaction
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700"
            />
            <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.svg" alt="90+" className="h-6" />
            <span className="ml-4">Copyright © 2023, 90+</span>
          </div>
          <div className="flex gap-4">
            <a href="#support">Support</a>
            <a href="#terms">Terms & Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
