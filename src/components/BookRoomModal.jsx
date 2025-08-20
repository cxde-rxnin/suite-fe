import { useState } from 'react';

function BookRoomModal({ isOpen, onClose, onSubmit, room }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ fullName, email, startDate, endDate });
  };

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold"
                aria-label="Close"
            >
                &times;
            </button>
            <h2 className="text-xl font-bold text-sky-400 mb-6 break-words">Book Room {room?.objectId}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    className="px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 break-words"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 break-words"
                />
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        required
                        className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 break-words"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        required
                        className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 break-words"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 py-2 px-4 rounded-lg font-bold bg-sky-400 hover:bg-sky-500 text-white transition break-words"
                >
                    Confirm Booking
                </button>
            </form>
        </div>
    </div>
);
}

export default BookRoomModal;
