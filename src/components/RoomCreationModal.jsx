import React, { useState } from 'react';
import { X } from 'lucide-react';
import './RoomCreationModal.css'; // Import custom animations
import apiClient from '../api/axios';

export default function RoomCreationModal({ hotelId, onClose }) {
  const [step, setStep] = useState(1);
  // hotelId should be the Sui objectId (starts with 0x...)
  // If you receive a hotel object, extract objectId here
  // Example: hotelId = hotel?.objectId || hotelId
  const [form, setForm] = useState({
    name: '',
    roomNumber: '',
    type: '',
    description: '',
    maxGuests: 2,
    maxAdults: 2,
    maxChildren: 0,
    baseGuestCount: 2,
    bedConfiguration: [{ bedType: 'king', quantity: 1 }],
    roomSize: 20,
    bathrooms: 1,
    floor: 1,
    view: '',
    pricePerDay: 0,
    extraGuestFee: 0,
    amenities: [],
    perks: [],
    isAccessible: false,
    accessibilityFeatures: [],
    smokingAllowed: false,
    petsAllowed: false,
    images: [],
  });

  // Step 1: Basic Info
  const Step1 = (
    <div className="space-y-2">
      <div className="border-b border-slate-700/50">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Basic Information</h3>
        <p className="text-slate-400 text-sm mt-0.5">Enter the room's basic details</p>
      </div>
      
      <div className="group space-y-1">
        <label className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">Room Name</label>
        <input 
          type="text" 
          value={form.name} 
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
          placeholder="e.g., Deluxe Suite A" 
          required 
          className="w-full px-4 py-3 rounded-xl bg-slate-700/70 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200" 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="group space-y-1">
          <label className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">Room Number</label>
          <div className="relative">
            <input 
              type="text" 
              value={form.roomNumber} 
              onChange={e => setForm(f => ({ ...f, roomNumber: e.target.value }))} 
              placeholder="e.g., 101" 
              required 
              className="w-full px-4 py-2 rounded-xl bg-slate-700/70 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200" 
            />
          </div>
        </div>
        <div className="group space-y-1">
          <label className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">Room Type</label>
          <div className="relative">
            <select 
              value={form.type} 
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))} 
              required 
              className="w-full appearance-none px-4 py-2 rounded-xl bg-slate-700/70 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200"
            >
              <option value="">Select room type</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="executive">Executive</option>
              <option value="presidential">Presidential</option>
              <option value="family">Family</option>
              <option value="accessible">Accessible</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="group space-y-1">
        <label className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">Description</label>
        <textarea 
          value={form.description} 
           onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
           placeholder="Describe the room's features, style, and unique selling points..." 
           rows={2} 
           className="w-full px-4 py-2 rounded-xl bg-slate-700/70 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200 resize-none" 
        />
        <p className="mt-1.5 text-xs text-slate-500">Provide a detailed description that highlights what makes this room special</p>
      </div>
    </div>
  );
  
  // Step 2: Guest Capacity
  const Step2 = (
    <div className="space-y-2">
      <div className="border-b border-slate-700/50">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Guest Capacity</h3>
        <p className="text-slate-400 text-sm mt-0.5">Define how many guests can stay in this room</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="group space-y-1">
          <label className="flex justify-between">
            <span className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">Maximum Guests</span>
            <span className="text-xs text-slate-500">{form.maxGuests} guests</span>
          </label>
          <div className="relative">
            <input 
              type="number" 
              min={1} 
              value={form.maxGuests} 
              onChange={e => setForm(f => ({ ...f, maxGuests: Number(e.target.value) }))} 
              className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500">Total number of guests allowed in the room</p>
        </div>
        
        <div className="group space-y-1">
          <label className="flex justify-between">
            <span className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">Base Guest Count</span>
            <span className="text-xs text-slate-500">{form.baseGuestCount} guests</span>
          </label>
          <div className="relative">
            <input 
              type="number" 
              min={1} 
              value={form.baseGuestCount} 
              onChange={e => setForm(f => ({ ...f, baseGuestCount: Number(e.target.value) }))} 
              className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500">Number of guests included in base price</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="group space-y-1">
          <label className="flex justify-between">
            <span className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">Maximum Adults</span>
            <span className="text-xs text-slate-500">{form.maxAdults} adults</span>
          </label>
          <div className="relative">
            <input 
              type="number" 
              min={1} 
              value={form.maxAdults} 
              onChange={e => setForm(f => ({ ...f, maxAdults: Number(e.target.value) }))} 
              className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500">Maximum number of adults allowed</p>
        </div>
        
        <div className="group space-y-1">
          <label className="flex justify-between">
            <span className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">Maximum Children</span>
            <span className="text-xs text-slate-500">{form.maxChildren} children</span>
          </label>
          <div className="relative">
            <input 
              type="number" 
              min={0} 
              value={form.maxChildren} 
              onChange={e => setForm(f => ({ ...f, maxChildren: Number(e.target.value) }))} 
              className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500">Maximum number of children allowed</p>
        </div>
      </div>
    </div>
  );

  // Step 3: Room Details & Specs
  const Step3 = (
    <div className="space-y-2">
      <div className="border-b border-slate-700/50 pb-2">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Room Details</h3>
        <p className="text-slate-400 text-sm mt-0.5">Specify the physical characteristics of the room</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="group space-y-1">
          <label className="flex justify-between">
            <span className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">Room Size (m²)</span>
          </label>
          <div className="relative">
            <input 
              type="number" 
              min={1} 
              value={form.roomSize} 
              onChange={e => setForm(f => ({ ...f, roomSize: Number(e.target.value) }))} 
              className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500">Size of the room in square meters</p>
        </div>
        
        <div className="group space-y-1">
          <label className="flex justify-between">
            <span className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">Bathrooms</span>
          </label>
          <div className="relative">
            <input 
              type="number" 
              min={1} 
              value={form.bathrooms} 
              onChange={e => setForm(f => ({ ...f, bathrooms: Number(e.target.value) }))} 
              className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12h-8v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2zm-8 2v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2h-8zm-9-2h7v2H4v-2zm0 4h7v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2zm9-10v2H4V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500">Number of bathrooms in the room</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="group space-y-1">
          <label className="flex justify-between">
            <span className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">Floor</span>
          </label>
          <div className="relative">
            <input 
              type="number" 
              min={0} 
              value={form.floor} 
              onChange={e => setForm(f => ({ ...f, floor: Number(e.target.value) }))} 
              className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500">Floor level of the room</p>
        </div>
        
        <div className="group space-y-1">
          <label className="flex justify-between">
            <span className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">View</span>
          </label>
          <div className="relative">
            <select 
              value={form.view} 
              onChange={e => setForm(f => ({ ...f, view: e.target.value }))} 
              className="w-full appearance-none bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200"
            >
              <option value="">Select view</option>
              <option value="ocean">Ocean</option>
              <option value="city">City</option>
              <option value="garden">Garden</option>
              <option value="pool">Pool</option>
              <option value="mountain">Mountain</option>
              <option value="courtyard">Courtyard</option>
              <option value="street">Street</option>
              <option value="interior">Interior</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500">View from the room</p>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="group space-y-1">
          <label className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">Bed Configuration</label>
          <div className="space-y-2 bg-slate-700/50 p-3 rounded-xl border border-slate-600/50">
            {form.bedConfiguration.map((bed, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <select 
                  value={bed.bedType} 
                  onChange={e => {
                    const beds = [...form.bedConfiguration];
                    beds[idx].bedType = e.target.value;
                    setForm(f => ({ ...f, bedConfiguration: beds }));
                  }} 
                  className="flex-grow appearance-none bg-slate-700/70 border border-slate-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200"
                >
                  <option value="king">King</option>
                  <option value="queen">Queen</option>
                  <option value="double">Double</option>
                  <option value="twin">Twin</option>
                  <option value="single">Single</option>
                  <option value="sofa-bed">Sofa Bed</option>
                  <option value="bunk-bed">Bunk Bed</option>
                </select>
                <div className="relative w-24">
                  <input 
                    type="number" 
                    min={1} 
                    value={bed.quantity} 
                    onChange={e => {
                      const beds = [...form.bedConfiguration];
                      beds[idx].quantity = Number(e.target.value);
                      setForm(f => ({ ...f, bedConfiguration: beds }));
                    }} 
                    className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200" 
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => setForm(f => ({ ...f, bedConfiguration: f.bedConfiguration.filter((_, i) => i !== idx) }))} 
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => setForm(f => ({ ...f, bedConfiguration: [...f.bedConfiguration, { bedType: 'king', quantity: 1 }] }))} 
              className="mt-2 text-sky-400 hover:text-sky-300 flex items-center gap-1 px-3 py-1.5 hover:bg-sky-900/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Bed
            </button>
          </div>
          <p className="text-xs text-slate-500">Specify the types and quantities of beds in the room</p>
        </div>
      </div>
    </div>
  );

  // Lists for amenities, perks, and accessibility features
  const amenitiesList = [
    'wifi', 'tv', 'ac', 'heating', 'minibar', 'safe', 'balcony', 'kitchenette', 'coffee-maker', 'hair-dryer', 'iron', 'telephone', 'room-service', 'daily-housekeeping', 'turndown-service'
  ];
  const perksList = [
    'free-breakfast', 'late-checkout', 'early-checkin', 'welcome-drink', 'free-parking', 'airport-shuttle', 'spa-access', 'gym-access', 'business-center', 'concierge', 'pet-friendly', 'smoking-allowed'
  ];
  const accessibilityList = [
    'wheelchair-accessible', 'hearing-accessible', 'visual-accessible', 'grab-bars', 'roll-in-shower', 'lowered-fixtures', 'braille-signage'
  ];
  
  // Step 4: Amenities
  const Step4 = (
    <div className="space-y-2">
      <div className="border-b border-slate-700/50 pb-2">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Room Amenities</h3>
        <p className="text-slate-400 text-sm mt-0.5">Select the amenities available in this room</p>
      </div>
      
      <div className="space-y-2">
        <div className="bg-slate-700/50 p-3 rounded-xl border border-slate-600/50">
          <div className="grid grid-cols-2 gap-3">
            {amenitiesList.map(a => (
              <label key={a} className="flex items-center gap-2 p-1.5 hover:bg-slate-600/30 rounded-lg transition-colors cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={form.amenities.includes(a)} 
                    onChange={e => setForm(f => ({ ...f, amenities: e.target.checked ? [...f.amenities, a] : f.amenities.filter(x => x !== a) }))} 
                    className="w-4 h-4 text-sky-500 bg-slate-700 border-slate-500 rounded focus:ring-sky-500 focus:ring-offset-slate-800 focus:ring-offset-1"
                  />
                </div>
                <span className="text-slate-300 text-sm capitalize">{a.replace(/-/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500">These amenities will be listed on the room details page</p>
      </div>
    </div>
  );
  
  // Step 5: Perks
  const Step5 = (
    <div className="space-y-2">
      <div className="border-b border-slate-700/50 pb-2">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Room Perks</h3>
        <p className="text-slate-400 text-sm mt-0.5">Select the perks included with this room</p>
      </div>
      
      <div className="space-y-2">
        <div className="bg-slate-700/50 p-3 rounded-xl border border-slate-600/50">
          <div className="grid grid-cols-2 gap-3">
            {perksList.map(p => (
              <label key={p} className="flex items-center gap-2 p-1.5 hover:bg-slate-600/30 rounded-lg transition-colors cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={form.perks.includes(p)} 
                    onChange={e => setForm(f => ({ ...f, perks: e.target.checked ? [...f.perks, p] : f.perks.filter(x => x !== p) }))} 
                    className="w-4 h-4 text-sky-500 bg-slate-700 border-slate-500 rounded focus:ring-sky-500 focus:ring-offset-slate-800 focus:ring-offset-1"
                  />
                </div>
                <span className="text-slate-300 text-sm capitalize">{p.replace(/-/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500">These perks will be highlighted to guests when booking</p>
      </div>
    </div>
  );

  // Step 7: Pricing & Policies
  const Step7 = (
    <div className="space-y-2">
      <div className="border-b border-slate-700/50 pb-2">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Pricing & Policies</h3>
        <p className="text-slate-400 text-sm mt-0.5">Set room rates and additional fees</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="group space-y-1">
          <label className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">Price per Day (SUI)</label>
          <div className="relative">
            <input 
              type="number" 
              min={0} 
              value={form.pricePerDay} 
              onChange={e => setForm(f => ({ ...f, pricePerDay: Number(e.target.value) }))} 
              className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500">Base price per night</p>
        </div>
        
        <div className="group space-y-1">
          <label className="text-sm font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors duration-200">Extra Guest Fee (SUI)</label>
          <div className="relative">
            <input 
              type="number" 
              min={0} 
              value={form.extraGuestFee} 
              onChange={e => setForm(f => ({ ...f, extraGuestFee: Number(e.target.value) }))} 
              className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500">Fee for each guest above base count</p>
        </div>
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">Room Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files[0];
            if (file) {
              setForm(f => ({ ...f, images: [file] }));
            }
          }}
          className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
        />
        <p className="text-xs text-slate-500 mt-1">Upload a photo of the room. Only one image is supported.</p>
        {form.images && form.images.length > 0 && (
          <div className="mt-2">
            <img src={URL.createObjectURL(form.images[0])} alt="Room preview" className="rounded-xl w-full max-h-48 object-cover border border-slate-700" />
          </div>
        )}
      </div>
    </div>
  );

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      // Always include hotelId from prop
      formData.append('hotelId', hotelId);
      // Append all fields except images and hotelId (already added)
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'images' || key === 'hotelId') return;
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      // Append first image file if exists
      if (form.images && form.images.length > 0) {
        formData.append('image', form.images[0]);
      }
      await apiClient.post('/transactions/list-room', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onClose();
    } catch (err) {
      alert('Error creating room');
    }
  };

  // Step 8: Review & Submit
  const Step8 = (
    <div className="space-y-2">
      <div className="border-b border-slate-700/50 pb-2">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Review Room Details</h3>
        <p className="text-slate-400 text-sm mt-0.5">Verify all information before creating the room</p>
      </div>
      
      <pre className="bg-slate-800/70 border border-slate-700/50 rounded-xl p-4 text-slate-300 text-sm overflow-x-auto max-h-64 shadow-inner">{JSON.stringify(form, null, 2)}</pre>
      
      <button 
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-5 py-2 rounded-xl font-semibold shadow-lg transition-all duration-200 border border-green-500/30 hover:border-green-400/50 mt-4" 
        onClick={handleSubmit}
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Confirm & Create Room
        </span>
      </button>
    </div>
  );

  // Step 6: Accessibility Features
  const Step6 = (
    <div className="space-y-2">
      <div className="border-b border-slate-700/50 pb-2">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Accessibility Features</h3>
        <p className="text-slate-400 text-sm mt-0.5">Select accessibility options for this room</p>
      </div>
      
      <div className="space-y-2">
        <div className="bg-slate-700/50 p-3 rounded-xl border border-slate-600/50">
          <div className="grid grid-cols-2 gap-3">
            {accessibilityList.map(a => (
              <label key={a} className="flex items-center gap-2 p-1.5 hover:bg-slate-600/30 rounded-lg transition-colors cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={form.accessibilityFeatures.includes(a)} 
                    onChange={e => setForm(f => ({ ...f, accessibilityFeatures: e.target.checked ? [...f.accessibilityFeatures, a] : f.accessibilityFeatures.filter(x => x !== a) }))} 
                    className="w-4 h-4 text-sky-500 bg-slate-700 border-slate-500 rounded focus:ring-sky-500 focus:ring-offset-slate-800 focus:ring-offset-1"
                  />
                </div>
                <span className="text-slate-300 text-sm capitalize">{a.replace(/-/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={form.isAccessible} 
                onChange={e => setForm(f => ({ ...f, isAccessible: e.target.checked }))} 
                className="w-4 h-4 text-sky-500 bg-slate-700 border-slate-500 rounded focus:ring-sky-500 focus:ring-offset-slate-800 focus:ring-offset-1"
              />
            </div>
            <span className="text-slate-300 text-sm">Room is fully accessible</span>
          </label>
          
          <label className="flex items-center gap-2 p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={form.smokingAllowed} 
                onChange={e => setForm(f => ({ ...f, smokingAllowed: e.target.checked }))} 
                className="w-4 h-4 text-sky-500 bg-slate-700 border-slate-500 rounded focus:ring-sky-500 focus:ring-offset-slate-800 focus:ring-offset-1"
              />
            </div>
            <span className="text-slate-300 text-sm">Smoking allowed</span>
          </label>
          
          <label className="flex items-center gap-2 p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={form.petsAllowed} 
                onChange={e => setForm(f => ({ ...f, petsAllowed: e.target.checked }))} 
                className="w-4 h-4 text-sky-500 bg-slate-700 border-slate-500 rounded focus:ring-sky-500 focus:ring-offset-slate-800 focus:ring-offset-1"
              />
            </div>
            <span className="text-slate-300 text-sm">Pets allowed</span>
          </label>
        </div>
        <p className="text-xs text-slate-500">These features will help guests with specific needs find suitable accommodations</p>
      </div>
    </div>
  );

  const steps = [Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8];
  const stepTitles = ['Basic Info', 'Room Details', 'Room Configuration', 'Amenities', 'Perks', 'Accessibility', 'Pricing & Policies', 'Review & Submit'];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-700/50 w-full max-w-lg transform transition-all duration-300 animate-modal-enter hover:shadow-sky-900/20 hover:border-slate-600/70 hover-glow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent">Create New Room</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-full transition-all duration-200 group">
            <X className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        </div>
        <form className="space-y-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/30 shadow-inner" onSubmit={e => e.preventDefault()}>
          <div key={`step-${step}`} className="step-enter">
            {steps[step - 1]}
          </div>
          <div className="flex gap-3 pt-3">
            {step > 1 && (
              <button 
                type="button" 
                className="flex-1 bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-white px-5 py-2 rounded-xl font-semibold transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50 shadow-md" 
                onClick={() => setStep(s => s - 1)}
              >
                <span className="flex items-center justify-center">← Back</span>
              </button>
            )}
            {step < 8 && (
              <button 
                type="button" 
                className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white px-5 py-2 rounded-xl font-semibold shadow-lg transition-all duration-200 border border-sky-500/30 hover:border-sky-400/50" 
                onClick={() => setStep(s => s + 1)}
              >
                <span className="flex items-center justify-center">Next →</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
