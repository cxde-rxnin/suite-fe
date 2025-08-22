import { useState } from 'react';
import { Building2, MapPin, Plus, X, Upload, CheckCircle } from 'lucide-react';

export default function HotelRegisterInline({ account, onRegistered }) {
  const [step, setStep] = useState(1);
  const [hotelForm, setHotelForm] = useState({
    name: '',
    physicalAddress: '',
    owner: account?.address || '',
    description: '',
    amenities: [],
    image: null,
  });
  const [amenityInput, setAmenityInput] = useState('');
  const isStep1Valid = hotelForm.name && hotelForm.physicalAddress && hotelForm.amenities.length > 0;
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setHotelForm(f => ({ ...f, image: files[0] }));
    } else if (name === 'amenities') {
      setAmenityInput(value);
    } else {
      setHotelForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleAmenityKeyDown(e) {
    if (e.key === 'Enter' && amenityInput.trim()) {
      e.preventDefault();
      if (!hotelForm.amenities.includes(amenityInput.trim())) {
        setHotelForm(f => ({ ...f, amenities: [...f.amenities, amenityInput.trim()] }));
      }
      setAmenityInput('');
    }
  }

  function removeAmenity(idx) {
    setHotelForm(f => ({ ...f, amenities: f.amenities.filter((_, i) => i !== idx) }));
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setHotelForm(f => ({ ...f, image: e.dataTransfer.files[0] }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCreating(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('name', hotelForm.name);
      formData.append('physicalAddress', hotelForm.physicalAddress);
      formData.append('owner', hotelForm.owner);
      formData.append('description', hotelForm.description);
      formData.append('image', hotelForm.image);
      hotelForm.amenities.forEach(a => formData.append('amenities[]', a));
      const res = await fetch('/api/transactions/create-hotel', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Hotel created and published to SUI!');
        if (onRegistered) onRegistered();
      } else {
        setMessage(data.error || JSON.stringify(data) || 'Error: Something went wrong');
      }
    } catch (err) {
      setMessage('Error: Something went wrong');
    }
    setCreating(false);
  }

  const isFormValid = hotelForm.name && hotelForm.physicalAddress;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 text-white">
          Register Your Hotel
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed max-w-md mx-auto">
          Join the future of hotel booking. Create your hotel profile and start accepting bookings.
        </p>
      </div>

      {/* Multi-Step Form Card */}
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
          {step === 1 && (
            <>
              {/* Hotel Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Hotel Name</label>
                <input 
                  name="name" 
                  value={hotelForm.name} 
                  onChange={handleChange} 
                  placeholder="Enter your hotel name" 
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                  required 
                />
              </div>
              
              {/* Physical Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Physical Address</label>
                <input 
                  name="physicalAddress" 
                  value={hotelForm.physicalAddress} 
                  onChange={handleChange} 
                  placeholder="123 Main Street, City, State" 
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                  required 
                />
              </div>
              
              {/* Amenities */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Amenities</label>
                <div className="w-full flex flex-wrap gap-2 mb-3">
                  {hotelForm.amenities.map((amenity, idx) => (
                    <span key={amenity + idx} className="inline-flex items-center px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-sm font-medium border border-sky-500/30">
                      {amenity}
                      <button type="button" className="ml-2 text-sky-400 hover:text-red-400 transition-colors" onClick={() => removeAmenity(idx)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input 
                  name="amenities" 
                  value={amenityInput} 
                  onChange={handleChange} 
                  onKeyDown={handleAmenityKeyDown}
                  placeholder="Type an amenity and press Enter..." 
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                />
                <p className="text-xs text-slate-400">Press Enter to add each amenity.</p>
              </div>
              
              <button 
                type="button"
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 ${
                  !isStep1Valid
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                    : 'bg-sky-500 text-white hover:bg-sky-600 active:transform active:scale-[0.98] shadow-lg hover:shadow-xl'
                }`}
              >
                Next Step
              </button>
            </>
          )}
          
          {step === 2 && (
            <>
              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <textarea 
                  name="description" 
                  value={hotelForm.description} 
                  onChange={handleChange} 
                  placeholder="Describe your hotel's unique features and charm..." 
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 resize-none" 
                  rows="4"
                />
              </div>
              
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Hotel Image</label>
                <div 
                  className={`relative w-full border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer group ${
                    dragActive 
                      ? 'border-sky-400 bg-sky-500/10' 
                      : hotelForm.image 
                        ? 'border-green-400 bg-green-500/10' 
                        : 'border-slate-500 hover:border-slate-400 hover:bg-slate-700/30'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="p-8 text-center">
                    <Upload className={`w-12 h-12 mx-auto mb-4 ${
                      dragActive ? 'text-sky-400' : hotelForm.image ? 'text-green-400' : 'text-slate-400'
                    }`} />
                    <p className="text-white font-medium mb-2">
                      {hotelForm.image ? hotelForm.image.name : 'Drop your image here or click to browse'}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {hotelForm.image ? 'Image selected successfully!' : 'Supports JPG, PNG, GIF up to 10MB'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-6 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-all duration-200 font-semibold"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={!isFormValid || creating}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    !isFormValid || creating
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                      : 'bg-sky-500 text-white hover:bg-sky-600 active:transform active:scale-[0.98] shadow-lg hover:shadow-xl'
                  }`}
                >
                  {creating ? 'Creating...' : 'Create Hotel'}
                </button>
              </div>
            </>
          )}
        </form>
        
        {message && (
          <div className={`mt-6 p-4 rounded-xl text-sm ${
            message.includes('Error') 
              ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
              : 'bg-green-500/10 border border-green-500/20 text-green-400'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}