import { ConnectButton } from '@mysten/dapp-kit';
import suiteimg from '../assets/suiteimg.png';

export default function Hotel() {
  return (
    <div className="h-screen flex flex-1 items-center">
      <img src={suiteimg} alt="Suite" className="w-1/2 h-screen object-cover hidden md:block" />
      <div className='p-32 h-1/2 flex flex-col items-center justify-center md:ml-16'>
        <h1 className="text-3xl font-bold mb-2 text-center text-white geist-mono">Welcome to sui.te</h1>
        <p className="text-slate-300 mb-6 text-center max-w-96">Connect your wallet to unlock the future of hotel management. Secure, instant, commission-free.</p>
        <ConnectButton />
      </div>
    </div>
  );
}
