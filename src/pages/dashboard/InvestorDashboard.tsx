import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Filter, Search, PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
// import { Badge } from '../../components/ui/Badge';
// import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { useAuth } from '../../context/AuthContext';
// import { Entrepreneur } from '../../types';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor, createCollaborationRequest  } from '../../data/collaborationRequests';
//code For Calendar.
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


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
  
// Get collaboration requests sent by this investor
const existingRequests = getRequestsFromInvestor(user.id);
const requestedEntrepreneurIds = existingRequests.map(req => req.entrepreneurId);
  
  // Filter entrepreneurs based on search and industry filters
  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Industry filter
    const matchesIndustry = selectedIndustries.length === 0 || 
      selectedIndustries.includes(entrepreneur.industry);
    
    return matchesSearch && matchesIndustry;
  });
  
  // Get unique industries for filter
  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));
  
  // Toggle industry selection
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prevSelected => 
      prevSelected.includes(industry)
        ? prevSelected.filter(i => i !== industry)
        : [...prevSelected, industry]
    );
  };
  // Add new availability slot
const addAvailabilitySlot = () => {
  if (newSlot.date && newSlot.startTime && newSlot.endTime) {
    if (editingSlotId !== null) {
      // Edit existing slot
      setAvailabilitySlots(availabilitySlots.map(slot => 
        slot.id === editingSlotId ? { ...slot, ...newSlot } : slot
      ));
      setEditingSlotId(null);
    } else {
      // Add new slot
      setAvailabilitySlots([...availabilitySlots, { ...newSlot, id: Date.now() }]);
    }
    setNewSlot({ date: '', startTime: '', endTime: '' });
    setShowAddSlot(false);
  } else {
    alert('Please fill in all fields');
  }
};

// Delete availability slot
const deleteAvailabilitySlot = (id: number) => {
  setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== id));
};

// Edit availability slot
const editAvailabilitySlot = (slot: any) => {
  setNewSlot({ date: slot.date, startTime: slot.startTime, endTime: slot.endTime });
  setEditingSlotId(slot.id);
  setShowAddSlot(true);
};
const sendMeetingRequest = () => {
   console.log("sendMeetingRequest called!");  // Add this
 console.log("📤 Sending request to entrepreneurId:", meetingRequest.entrepreneurId);
  if (!meetingRequest.date || !meetingRequest.time) {
    alert('Please select date and time');
    return;
  }
  console.log("Creating collaboration request...");  // Add 
  
  // Save to central data file (this is what Entrepreneur sees!)
  createCollaborationRequest(
    user.id,                                    // investorId
    meetingRequest.entrepreneurId,              // entrepreneurId
    `${meetingRequest.message || 'Meeting request'}\n\n📅 Date: ${meetingRequest.date}\n⏰ Time: ${meetingRequest.time}`
  );
  
  // Also save to local state for Investor display
  const newRequest = {
    id: Date.now(),
    entrepreneurId: meetingRequest.entrepreneurId,
    entrepreneurName: selectedEntrepreneur?.name || 'Entrepreneur',
    startupName: selectedEntrepreneur?.startupName || 'Startup',
    date: meetingRequest.date,
    time: meetingRequest.time,
    message: meetingRequest.message,
    status: 'pending',
    sentAt: new Date().toISOString()
  };
    console.log("Collaboration request created!");  // Add this
  
  setSentRequests([...sentRequests, newRequest]);
  setShowRequestForm(false);
  setMeetingRequest({ entrepreneurId: '', date: '', time: '', message: '' });
  setSelectedEntrepreneur(null);
  alert('Meeting request sent successfully!');
};
  return (
    <div className="space-y-6 animate-fade-in">
    {/* Calendar Section */}
       <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
        <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>Schedule a Meeting</h3>
        <Calendar 
       onChange={(value) => setSelectedDate(value as Date | null)}
       value={selectedDate} 
  />
  {selectedDate && (
    <p style={{ marginTop: '15px', color: '#666' }}>
      Selected: {selectedDate.toDateString()}
    </p>
  )}
</div>
{/* Availability Slots Section */}
<div style={{ 
  backgroundColor: 'white', 
  padding: '20px', 
  borderRadius: '10px',
  marginBottom: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
    <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>🕐 My Availability Slots</h3>
    <button
      onClick={() => {
        setShowAddSlot(!showAddSlot);
        setEditingSlotId(null);
        setNewSlot({ date: '', startTime: '', endTime: '' });
      }}
      style={{
        backgroundColor: '#4F46E5',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      {showAddSlot ? 'Cancel' : '+ Add Availability'}
    </button>
  </div>

  {/* Add/Edit Form */}
  {showAddSlot && (
    <div style={{ 
      backgroundColor: '#F3F4F6', 
      padding: '15px', 
      borderRadius: '8px',
      marginBottom: '15px'
    }}>
      <h4 style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        {editingSlotId !== null ? 'Edit Slot' : 'Add New Slot'}
      </h4>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="date"
          value={newSlot.date}
          onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          placeholder="Date"
        />
        <input
          type="time"
          value={newSlot.startTime}
          onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          placeholder="Start Time"
        />
        <input
          type="time"
          value={newSlot.endTime}
          onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          placeholder="End Time"
        />
        <button
          onClick={addAvailabilitySlot}
          style={{
            backgroundColor: '#10B981',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {editingSlotId !== null ? 'Update' : 'Save'}
        </button>
      </div>
    </div>
  )}

  {/* List of Availability Slots */}
  {availabilitySlots.length === 0 ? (
    <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>
      No availability slots added yet. Click "+ Add Availability" to create one.
    </p>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {availabilitySlots.map((slot) => (
        <div
          key={slot.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: '#F9FAFB',
            borderRadius: '8px',
            border: '1px solid #E5E7EB'
          }}
        >
          <div>
            <strong>{slot.date}</strong> | {slot.startTime} - {slot.endTime}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => editAvailabilitySlot(slot)}
              style={{
                backgroundColor: '#F59E0B',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Edit
            </button>
            <button
              onClick={() => deleteAvailabilitySlot(slot.id)}
              style={{
                backgroundColor: '#EF4444',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Startups</h1>
          <p className="text-gray-600">Find and connect with promising entrepreneurs</p>
        </div>
        
        <Link to="/entrepreneurs">
          <Button
            leftIcon={<PlusCircle size={18} />}
          >
            View All Startups
          </Button>
        </Link>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search startups, industries, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            startAdornment={<Search size={18} />}
          />
        </div>
        
        <div className="w-full md:w-1/3">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            
            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <div
                  key={industry}
                  className={`inline-flex cursor-pointer ${selectedIndustries.includes(industry) ? 'text-primary-700 bg-primary-100' : 'text-gray-700 bg-gray-100'} px-2 py-1 rounded-full text-sm`}
                  onClick={() => toggleIndustry(industry)}
                 >
                 {industry}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Users size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Total Startups</p>
                <h3 className="text-xl font-semibold text-primary-900">{entrepreneurs.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <PieChart size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Industries</p>
                <h3 className="text-xl font-semibold text-secondary-900">{industries.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Users size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Your Connections</p>
                <h3 className="text-xl font-semibold text-accent-900">
                {existingRequests.filter(req => req.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Entrepreneurs grid */}
   
<div>
  <Card>
    <CardHeader>
      <h2 className="text-lg font-medium text-gray-900">Featured Startups</h2>
    </CardHeader>
    
    <CardBody>
      {filteredEntrepreneurs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntrepreneurs.map(entrepreneur => (
            <div key={entrepreneur.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <h3 className="font-bold text-lg">{entrepreneur.startupName}</h3>
              <p className="text-gray-700">{entrepreneur.name}</p>
              <p className="text-sm text-gray-500">{entrepreneur.industry}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{entrepreneur.pitchSummary}</p>
              <button
                 onClick={() => {
                 console.log("📌 Entrepreneur object:", entrepreneur);
                 console.log("📌 Entrepreneur ID:", entrepreneur.id);
                 console.log("Button clicked!", entrepreneur);
                 setSelectedEntrepreneur(entrepreneur);
                 setMeetingRequest({ ...meetingRequest, entrepreneurId: entrepreneur.id });
                 setShowRequestForm(true);
                 console.log("showRequestForm set to:", true);
                 }}
                className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
               >
               Request Meeting
             </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No startups match your filters</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => {
              setSearchQuery('');
              setSelectedIndustries([]);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </CardBody>
  </Card>
</div>
    {/* Meeting Request Modal - ADD THIS RIGHT HERE */}
  {showRequestForm && selectedEntrepreneur && (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        width: '500px',
        maxWidth: '90%'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
          Request Meeting with {selectedEntrepreneur.startupName}
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date:</label>
          <input
            type="date"
            value={meetingRequest.date}
            onChange={(e) => setMeetingRequest({ ...meetingRequest, date: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Time:</label>
          <input
            type="time"
            value={meetingRequest.time}
            onChange={(e) => setMeetingRequest({ ...meetingRequest, time: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message (optional):</label>
          <textarea
            value={meetingRequest.message}
            onChange={(e) => setMeetingRequest({ ...meetingRequest, message: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
            rows={3}
            placeholder="Add a personal message..."
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              setShowRequestForm(false);
              setSelectedEntrepreneur(null);
            }}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #D1D5DB', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={sendMeetingRequest}
            style={{ backgroundColor: '#4F46E5', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  )}

    </div>  
  );
};
   