import { Link } from 'react-router-dom';
import { ConnectButton } from '@mysten/dapp-kit';
import { Hotel } from 'lucide-react';

function Header() {
  return (
    <header className="bg-slate-800/95 backdrop-blur-md fixed w-full top-0 left-0 z-50 border-b border-slate-700/50">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-sky-400 transition-colors geist-mono">
            <span>Sui.te</span>
          </Link>
        </div>

        {/* Connect Button */}
        <ConnectButton className="geist-mono px-5 py-2.5 bg-sky-500 text-white rounded-xl shadow-lg hover:bg-sky-600 transition-all duration-200 font-semibold hover:shadow-sky-500/25" />
      </nav>
    </header>
  );
}

export default Header;