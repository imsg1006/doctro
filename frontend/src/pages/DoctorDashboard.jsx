import { useState, useEffect } from 'react';
import api from '../api/axios';
import SlotCard from '../components/SlotCard';
import { Plus, Loader2, CalendarPlus, UserCheck } from 'lucide-react';

const DoctorDashboard = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    // Bookings state mapping slot_id -> bookings array
    const [bookings, setBookings] = useState({});

    const fetchSlots = async () => {
        try {
            const { data } = await api.get('/doctor/my-slots');
            setSlots(data);

            // Fetch bookings for booked slots
            data.forEach(slot => {
                if (slot.is_booked) {
                    fetchBookings(slot.id);
                }
            });
        } catch (err) {
            setError('Failed to load slots');
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async (slotId) => {
        try {
            const { data } = await api.get(`/doctor/slot-bookings/${slotId}`);
            setBookings(prev => ({ ...prev, [slotId]: data }));
        } catch (err) {
            console.error(`Failed to load bookings for slot ${slotId}`);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    const handleCreateSlot = async (e) => {
        e.preventDefault();
        setError('');

        if (!startTime || !endTime) {
            setError('Please provide both start and end times');
            return;
        }

        // Convert local datetime-local to UTC string format expected by FastAPI
        const startIso = new Date(startTime).toISOString();
        const endIso = new Date(endTime).toISOString();

        setCreating(true);
        try {
            await api.post(`/doctor/create-slot?start_time=${startIso}&end_time=${endIso}`);
            setStartTime('');
            setEndTime('');
            fetchSlots();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create slot');
        } finally {
            setCreating(false);
        }
    };

    const handleCancelSlot = async (slotId) => {
        if (!window.confirm("Are you sure you want to cancel this available slot?")) return;
        try {
            await api.delete(`/doctor/cancel-slot/${slotId}`);
            setSlots(slots.filter(s => s.id !== slotId));
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to cancel slot');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Doctor Dashboard</h1>
                <p className="text-lg text-slate-500">Manage your schedule and upcoming appointments</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Slot Form */}
                <div className="lg:col-span-1">
                    <div className="glass-card rounded-2xl p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <CalendarPlus className="w-6 h-6 text-primary-500" />
                            Add New Slot
                        </h2>
                        <form onSubmit={handleCreateSlot} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Time</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">End Time</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full relative flex justify-center items-center py-2.5 px-4 rounded-xl text-white font-semibold bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                            >
                                {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5 mr-1" /> Create Slot</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Existing Slots */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Your Schedule</h2>
                        <div className="bg-slate-200/50 text-slate-600 px-3 py-1 rounded-full text-sm font-semibold">
                            {slots.length} Total Slots
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                        </div>
                    ) : slots.length === 0 ? (
                        <div className="text-center py-16 bg-white/50 border border-dashed border-slate-300 rounded-2xl">
                            <CalendarPlus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-1">No slots created yet</h3>
                            <p className="text-slate-500">Create some slots using the form to allow patients to book.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {slots.map((slot) => (
                                <SlotCard
                                    key={slot.id}
                                    slot={slot}
                                    onAction={handleCancelSlot}
                                    actionConfig={{
                                        label: 'Cancel Slot',
                                        className: 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700',
                                        disableIfBooked: true
                                    }}
                                >
                                    {/* Additional info inside the card wrapper */}
                                    {slot.is_booked && bookings[slot.id] && (
                                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                                            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                                <UserCheck className="w-4 h-4 text-primary-500" /> Appointment Details
                                            </h4>
                                            {bookings[slot.id].map(booking => (
                                                <div key={booking.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                                                    <p className="text-slate-600 mb-1">Patient ID: <span className="font-semibold text-slate-800">{booking.patient_id}</span></p>
                                                    <a
                                                        href={booking.meet_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-block mt-2 font-medium text-primary-500 hover:text-blue-700 hover:underline"
                                                    >
                                                        Join Google Meet &rarr;
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </SlotCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
