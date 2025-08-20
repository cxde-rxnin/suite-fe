import { Link } from 'react-router-dom';
import { ConnectButton } from '@mysten/dapp-kit';
import { Hotel } from 'lucide-react';

function Header() {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <span>Sui.te</span>
          </Link>
        </div>
        <ConnectButton className="geist-mono px-5 py-2 bg-sky-500 text-white rounded-lg shadow hover:bg-sky-600 transition font-semibold" />
      </nav>
    </header>
  );
}

export default Header;