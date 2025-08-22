import React, { useState } from 'react';
// You can import and reuse your multi-step form logic here

function EditRoomModal({ isOpen, onClose, roomData, onSave }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(roomData);

  // Steps based on RoomCreationModal fields
  const steps = [
    <div key="step1">
      <label className="block mb-2 text-sm font-medium text-white">Room Name</label>
      <input className="w-full p-2 rounded bg-slate-700 text-white mb-4" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
      <label className="block mb-2 text-sm font-medium text-white">Room Number</label>
      <input className="w-full p-2 rounded bg-slate-700 text-white" value={formData.roomNumber || ''} onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} />
    </div>,
    <div key="step2">
      <label className="block mb-2 text-sm font-medium text-white">Price Per Day (SUI)</label>
      <input type="number" className="w-full p-2 rounded bg-slate-700 text-white mb-4" value={formData.pricePerDay || ''} onChange={e => setFormData({ ...formData, pricePerDay: e.target.value })} />
      <label className="block mb-2 text-sm font-medium text-white">Base Guest Count</label>
      <input type="number" className="w-full p-2 rounded bg-slate-700 text-white" value={formData.baseGuestCount || ''} onChange={e => setFormData({ ...formData, baseGuestCount: e.target.value })} />
    </div>,
    <div key="step3">
      <label className="block mb-2 text-sm font-medium text-white">Description</label>
      <textarea className="w-full p-2 rounded bg-slate-700 text-white mb-4" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
      <label className="block mb-2 text-sm font-medium text-white">Room Size (m²)</label>
      <input type="number" className="w-full p-2 rounded bg-slate-700 text-white" value={formData.roomSize || ''} onChange={e => setFormData({ ...formData, roomSize: e.target.value })} />
    </div>,
    <div key="step4">
      <label className="block mb-2 text-sm font-medium text-white">Bathrooms</label>
      <input type="number" className="w-full p-2 rounded bg-slate-700 text-white mb-4" value={formData.bathrooms || ''} onChange={e => setFormData({ ...formData, bathrooms: e.target.value })} />
      <label className="block mb-2 text-sm font-medium text-white">Type</label>
      <input className="w-full p-2 rounded bg-slate-700 text-white" value={formData.type || ''} onChange={e => setFormData({ ...formData, type: e.target.value })} />
    </div>,
    <div key="step5">
      <label className="block mb-2 text-sm font-medium text-white">Amenities (comma separated)</label>
      <input className="w-full p-2 rounded bg-slate-700 text-white mb-4" value={formData.amenities ? formData.amenities.join(', ') : ''} onChange={e => setFormData({ ...formData, amenities: e.target.value.split(',').map(a => a.trim()) })} />
      <label className="block mb-2 text-sm font-medium text-white">Image URL</label>
      <input className="w-full p-2 rounded bg-slate-700 text-white" value={formData.images && formData.images[0] && formData.images[0].imageUrl ? formData.images[0].imageUrl : ''} onChange={e => setFormData({ ...formData, images: [{ imageUrl: e.target.value }] })} />
    </div>
  ];

  function handleNext() {
    if (step < steps.length - 1) setStep(step + 1);
  }
  function handlePrev() {
    if (step > 0) setStep(step - 1);
  }
  function handleSave() {
    onSave(formData);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold text-sky-400 mb-6">Edit Room</h2>
        {steps[step]}
        <div className="flex gap-2 mt-6 justify-end">
          <button className="px-4 py-2 rounded bg-slate-700 text-white" onClick={handlePrev} disabled={step === 0}>Previous</button>
          <button className="px-4 py-2 rounded bg-sky-500 text-white" onClick={handleNext} disabled={step === steps.length - 1}>Next</button>
          {step === steps.length - 1 && <button className="px-4 py-2 rounded bg-green-500 text-white" onClick={handleSave}>Save</button>}
        </div>
      </div>
    </div>
  );
}

export default EditRoomModal;
