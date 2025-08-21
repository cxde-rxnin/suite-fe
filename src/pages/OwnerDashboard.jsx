import { useState } from 'react';
import apiClient from '../api/axios';

const amenitiesList = [
  'WiFi', 'Pool', 'Parking', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Air Conditioning', 'Laundry', 'Pet Friendly'
];
const perksList = [
  'Free Breakfast', 'Late Checkout', 'Welcome Drink', 'Room Upgrade', 'Airport Shuttle'
];

export default function OwnerDashboard() {
  const [hotelForm, setHotelForm] = useState({
    name: '',
    physicalAddress: '',
    owner: '',
    description: '',
    amenities: [],
    perks: [],
    image: null,
  });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setHotelForm(f => ({
        ...f,
        [name]: checked
          ? [...f[name], value]
          : f[name].filter(v => v !== value)
      }));
    } else if (type === 'file') {
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
      if (Array.isArray(val)) {
        val.forEach(v => formData.append(key, v));
      } else if (val !== null) {
        formData.append(key, val);
      }
    });
    try {
      const res = await apiClient.post('/transactions/create-hotel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Hotel created and published to SUI!');
      setHotelForm({
        name: '', physicalAddress: '', owner: '', description: '', amenities: [], perks: [], image: null
      });
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    }
    setCreating(false);
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>
      <form onSubmit={handleSubmit} className="bg-slate-700 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Create Hotel</h2>
        <input name="name" value={hotelForm.name} onChange={handleChange} placeholder="Hotel Name" className="mb-2 p-2 w-full" required />
        <input name="physicalAddress" value={hotelForm.physicalAddress} onChange={handleChange} placeholder="Address" className="mb-2 p-2 w-full" required />
        <input name="owner" value={hotelForm.owner} onChange={handleChange} placeholder="Owner Address" className="mb-2 p-2 w-full" required />
        <textarea name="description" value={hotelForm.description} onChange={handleChange} placeholder="Description" className="mb-2 p-2 w-full" />
        <div className="mb-2">
          <label className="font-bold">Amenities:</label><br />
          {amenitiesList.map(a => (
            <label key={a} className="mr-2">
              <input type="checkbox" name="amenities" value={a} checked={hotelForm.amenities.includes(a)} onChange={handleChange} /> {a}
            </label>
          ))}
        </div>
        <div className="mb-2">
          <label className="font-bold">Perks:</label><br />
          {perksList.map(p => (
            <label key={p} className="mr-2">
              <input type="checkbox" name="perks" value={p} checked={hotelForm.perks.includes(p)} onChange={handleChange} /> {p}
            </label>
          ))}
        </div>
        <div className="mb-2">
          <label className="font-bold">Image:</label><br />
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </div>
        <button type="submit" disabled={creating} className="bg-sky-500 text-white px-4 py-2 rounded">
          {creating ? 'Creating...' : 'Create Hotel'}
        </button>
        {message && <div className="mt-4 text-green-400">{message}</div>}
      </form>
      {/* Room listing form and hotel/room management UI will go here next */}
    </div>
  );
}
