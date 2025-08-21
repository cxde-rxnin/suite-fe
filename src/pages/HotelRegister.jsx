import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import apiClient from '../api/axios';
import { useNavigate } from 'react-router-dom';
import suiteimg from '../assets/suiteimg.png';

export default function HotelRegister() {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();
  const [hotelForm, setHotelForm] = useState({
    name: '',
    physicalAddress: '',
    owner: currentAccount?.address || '',
    image: null,
  });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setHotelForm(f => ({ ...f, image: files[0] }));
    } else {
      setHotelForm(f => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCreating(true);
    setMessage('');
    const formData = new FormData();
    Object.entries(hotelForm).forEach(([key, val]) => {
      if (val !== null) formData.append(key, val);
    });
    try {
      await apiClient.post('/transactions/create-hotel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Hotel created and published to SUI! Redirecting...');
      setTimeout(() => navigate('/hotel'), 1500);
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    }
    setCreating(false);
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#232B3A]">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2 text-center text-white geist-mono">Join the Wave</h1>
        <p className="text-slate-300 mb-6 text-center">The future of hotel booking is here. Join us and ride the wave to success.</p>
        <div className="w-full flex gap-2 mb-6">
          <div className="h-2 bg-[#2D7FF9] rounded-full flex-1" />
          <div className="h-2 bg-[#232B3A] rounded-full flex-1" />
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input name="name" value={hotelForm.name} onChange={handleChange} placeholder="Hotel Name" className="bg-[#2C3444] text-white p-4 rounded-xl outline-none mb-2 border-none" required />
          <input name="physicalAddress" value={hotelForm.physicalAddress} onChange={handleChange} placeholder="Hotel Address" className="bg-[#2C3444] text-white p-4 rounded-xl outline-none mb-2 border-none" required />
          <label className="w-full border-2 border-dashed border-[#6A7A99] rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer text-slate-300 mb-2">
            <span>Upload Image</span>
            <input type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
          </label>
          <button type="submit" disabled={creating} className="bg-white text-[#232B3A] font-bold py-4 rounded-xl mt-2 text-lg">
            {creating ? 'Registering...' : 'Continue'}
          </button>
          {message && <div className="mt-4 text-green-400 text-center">{message}</div>}
        </form>
      </div>
    </div>
  );
}
