import { GuidedTour } from '../../components/Tour/GuidedTour';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Filter, Search, PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor, createCollaborationRequest } from '../../data/collaborationRequests';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { VideoCall } from '../../components/VideoCall/VideoCall';
import { DocumentChamber } from '../../components/DocumentChamber/DocumentChamber';
import { PaymentSection } from '../../components/Payment/PaymentSection';

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '' });
  const [editingSlotId, setEditingSlotId] = useState<number | null>(null);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState<any>(null);
  const [meetingRequest, setMeetingRequest] = useState({
    entrepreneurId: '',
    date: '',
    time: '',
    message: ''
  });

  if (!user) return null;

  const existingRequests = getRequestsFromInvestor(user.id);
  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));

  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const matchesSearch = searchQuery === '' || 
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(entrepreneur.industry);
    return matchesSearch && matchesIndustry;
  });

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]);
  };

  const addAvailabilitySlot = () => {
    if (newSlot.date && newSlot.startTime && newSlot.endTime) {
      if (editingSlotId !== null) {
        setAvailabilitySlots(availabilitySlots.map(slot => slot.id === editingSlotId ? { ...slot, ...newSlot } : slot));
        setEditingSlotId(null);
      } else {
        setAvailabilitySlots([...availabilitySlots, { ...newSlot, id: Date.now() }]);
      }
      setNewSlot({ date: '', startTime: '', endTime: '' });
      setShowAddSlot(false);
    } else {
      alert('Please fill in all fields');
    }
  };

  const deleteAvailabilitySlot = (id: number) => {
    setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== id));
  };

  const editAvailabilitySlot = (slot: any) => {
    setNewSlot({ date: slot.date, startTime: slot.startTime, endTime: slot.endTime });
    setEditingSlotId(slot.id);
    setShowAddSlot(true);
  };

  const sendMeetingRequest = () => {
    if (!meetingRequest.date || !meetingRequest.time) {
      alert('Please select date and time');
      return;
    }
    createCollaborationRequest(user.id, meetingRequest.entrepreneurId, `${meetingRequest.message || 'Meeting request'}\n\n📅 Date: ${meetingRequest.date}\n⏰ Time: ${meetingRequest.time}`);
    setSentRequests([...sentRequests, {
      id: Date.now(),
      entrepreneurId: meetingRequest.entrepreneurId,
      startupName: selectedEntrepreneur?.startupName || 'Startup',
      date: meetingRequest.date,
      time: meetingRequest.time,
      status: 'pending'
    }]);
    setShowRequestForm(false);
    setMeetingRequest({ entrepreneurId: '', date: '', time: '', message: '' });
    setSelectedEntrepreneur(null);
    alert('Meeting request sent!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Calendar Section */}
     <div className="calendar-section" style={{ background: 'white', padding: 20, borderRadius: 10, marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 'bold' }}>📅 Schedule a Meeting</h3>
        <Calendar onChange={(v) => setSelectedDate(v as Date | null)} value={selectedDate} />
        {selectedDate && <p>Selected: {selectedDate.toDateString()}</p>}
      </div>

      {/* Video Call Section */}
      <div className="video-call-container">
        <VideoCall userName={user?.name || 'Investor'} />
     </div>

      {/* Document Chamber */}
      <DocumentChamber />

      {/* Payment Section */}
      <div className="payment-section">
       <PaymentSection />
      </div>

      {/* Availability Slots Section */}
     <div className="availability-slots" style={{ background: 'white', padding: 20, borderRadius: 10, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 18, fontWeight: 'bold' }}>🕐 My Availability Slots</h3>
          <button onClick={() => { setShowAddSlot(!showAddSlot); setEditingSlotId(null); setNewSlot({ date: '', startTime: '', endTime: '' }); }} style={{ background: '#4F46E5', color: 'white', padding: '8px 16px', borderRadius: 8, border: 'none' }}>{showAddSlot ? 'Cancel' : '+ Add'}</button>
        </div>
        {showAddSlot && (
          <div style={{ background: '#F3F4F6', padding: 15, borderRadius: 8, marginTop: 10 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <input type="date" value={newSlot.date} onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })} style={{ padding: 8, borderRadius: 6 }} />
              <input type="time" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })} style={{ padding: 8, borderRadius: 6 }} />
              <input type="time" value={newSlot.endTime} onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })} style={{ padding: 8, borderRadius: 6 }} />
              <button onClick={addAvailabilitySlot} style={{ background: '#10B981', color: 'white', padding: '8px 16px', borderRadius: 6, border: 'none' }}>Save</button>
            </div>
          </div>
        )}
        {availabilitySlots.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 20 }}>No slots yet</p>
        ) : (
          availabilitySlots.map(slot => (
            <div key={slot.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: '#F9FAFB', borderRadius: 8, marginTop: 10 }}>
              <div><strong>{slot.date}</strong> | {slot.startTime} - {slot.endTime}</div>
              <div>
                <button onClick={() => editAvailabilitySlot(slot)} style={{ background: '#F59E0B', color: 'white', padding: '4px 12px', borderRadius: 6, marginRight: 5 }}>Edit</button>
                <button onClick={() => deleteAvailabilitySlot(slot.id)} style={{ background: '#EF4444', color: 'white', padding: '4px 12px', borderRadius: 6 }}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sent Requests */}
      {sentRequests.length > 0 && (
        <div style={{ background: 'white', padding: 20, borderRadius: 10, marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 'bold' }}>📨 Sent Requests</h3>
          {sentRequests.map(r => (
            <div key={r.id} style={{ padding: 12, background: '#F9FAFB', borderRadius: 8, marginTop: 10, borderLeft: `4px solid ${r.status === 'pending' ? '#F59E0B' : '#10B981'}` }}>
              <strong>{r.startupName}</strong> - {r.date} at {r.time} <span style={{ float: 'right' }}>{r.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {showRequestForm && selectedEntrepreneur && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: 25, borderRadius: 12, width: 400 }}>
            <h3>Meeting with {selectedEntrepreneur.startupName}</h3>
            <input type="date" value={meetingRequest.date} onChange={(e) => setMeetingRequest({ ...meetingRequest, date: e.target.value })} style={{ width: '100%', padding: 8, margin: '10px 0' }} />
            <input type="time" value={meetingRequest.time} onChange={(e) => setMeetingRequest({ ...meetingRequest, time: e.target.value })} style={{ width: '100%', padding: 8, margin: '10px 0' }} />
            <textarea value={meetingRequest.message} onChange={(e) => setMeetingRequest({ ...meetingRequest, message: e.target.value })} placeholder="Message" style={{ width: '100%', padding: 8, margin: '10px 0' }} rows={3} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowRequestForm(false)}>Cancel</button>
              <button onClick={sendMeetingRequest} style={{ background: '#4F46E5', color: 'white', padding: '8px 16px', borderRadius: 6 }}>Send</button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="flex justify-between">
        <div><h1 className="text-2xl font-bold">Discover Startups</h1><p>Find and connect with promising entrepreneurs</p></div>
        <Link to="/entrepreneurs"><Button>View All</Button></Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} fullWidth startAdornment={<Search size={18} />} />
        <div className="flex gap-2">
          {industries.map(industry => (
            <div key={industry} className={`cursor-pointer px-2 py-1 rounded-full text-sm ${selectedIndustries.includes(industry) ? 'bg-primary-500 text-white' : 'bg-gray-100'}`} onClick={() => toggleIndustry(industry)}>
              {industry}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardBody><Users size={20} /><p>Total Startups</p><h3>{entrepreneurs.length}</h3></CardBody></Card>
        <Card><CardBody><PieChart size={20} /><p>Industries</p><h3>{industries.length}</h3></CardBody></Card>
        <Card><CardBody><Users size={20} /><p>Connections</p><h3>{existingRequests.filter(r => r.status === 'accepted').length}</h3></CardBody></Card>
      </div>

      {/* Entrepreneurs Grid */}
    <Card className="featured-startups">
        <CardHeader><h2>Featured Startups</h2></CardHeader>
        <CardBody>
          <div className="grid grid-cols-3 gap-6">
            {filteredEntrepreneurs.map(e => (
              <div key={e.id} className="border rounded-lg p-4 bg-white">
                <h3 className="font-bold">{e.startupName}</h3>
                <p>{e.name}</p>
                <p className="text-sm text-gray-500">{e.industry}</p>
                <button onClick={() => { setSelectedEntrepreneur(e); setMeetingRequest({ ...meetingRequest, entrepreneurId: e.id }); setShowRequestForm(true); }} className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg">Request Meeting</button>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
      <GuidedTour />
    </div>
  );
};
