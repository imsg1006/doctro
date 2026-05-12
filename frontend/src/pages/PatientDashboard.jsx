import { useState, useEffect } from 'react';
import api from '../api/axios';
import SlotCard from '../components/SlotCard';
import { Loader2, CalendarSearch, Settings, HeartPulse, Video } from 'lucide-react';

const PatientDashboard = () => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [bookingSlotId, setBookingSlotId] = useState(null);
    const [filterDate, setFilterDate] = useState('');
    const [filterSpecialization, setFilterSpecialization] = useState('All');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchAvailableSlots = async () => {
        try {
            const { data } = await api.get('/patient/available-slots');
            setAvailableSlots(data);
        } catch (err) {
            setError('Failed to load available slots');
        } finally {
            setLoadingSlots(false);
        }
    };

    const fetchMyBookings = async () => {
        try {
            const { data } = await api.get('/patient/my-bookings');
            setMyBookings(data);
        } catch (err) {
            setError('Failed to load your bookings');
        } finally {
            setLoadingBookings(false);
        }
    };

    useEffect(() => {
        fetchAvailableSlots();
        fetchMyBookings();
    }, []);

    const handleBookSlot = async (slotId) => {
        setError('');
        setSuccess('');
        setBookingSlotId(slotId);

        try {
            await api.post(`/patient/book-slot/${slotId}`);
            setSuccess('Slot booked successfully!');
            // Refresh both lists
            fetchAvailableSlots();
            fetchMyBookings();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to book slot');
        } finally {
            setBookingSlotId(null);
            setTimeout(() => setSuccess(''), 5000);
        }
    };

    const filteredSlots = availableSlots.filter(slot => {
        let matchDate = true;
        let matchSpecialization = true;

        if (filterDate) {
            const slotDate = new Date(slot.start_time).toISOString().split('T')[0];
            if (slotDate !== filterDate) {
                matchDate = false;
            }
        }

        if (filterSpecialization !== 'All') {
            if (slot.doctor?.specialization !== filterSpecialization) {
                matchSpecialization = false;
            }
        }

        return matchDate && matchSpecialization;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col space-y-8 animate-fade-in pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Patient Dashboard</h1>
                <p className="text-lg text-slate-500">Book consultations and manage your health journey</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium shadow-sm animate-slide-up">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 bg-primary-950 text-primary-400 rounded-xl font-medium shadow-sm animate-slide-up flex flex-col justify-center border border-primary-900">
                    <div className="flex items-center gap-2">
                        <HeartPulse className="w-5 h-5" />
                        {success}
                    </div>
                    <span className="text-sm font-normal mt-1 opacity-80">An email has been sent to you with connection details.</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Available Slots */}
                <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <CalendarSearch className="w-6 h-6 text-primary-500" />
                            Available Consultations
                        </h2>
                        {!loadingSlots && availableSlots.length > 0 && (
                            <div className="flex flex-wrap items-center gap-3">
                                <input 
                                    type="date" 
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none text-slate-600 min-w-[130px]"
                                />
                                <select 
                                    value={filterSpecialization}
                                    onChange={(e) => setFilterSpecialization(e.target.value)}
                                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none text-slate-600 appearance-none min-w-[150px]"
                                >
                                    <option value="All">All Specialists</option>
                                    <option value="General Physician">General Physician</option>
                                    <option value="Cardiologist">Cardiologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Pediatrician">Pediatrician</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="Orthopedic">Orthopedic</option>
                                    <option value="Psychiatrist">Psychiatrist</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {loadingSlots ? (
                        <div className="flex justify-center p-12 glass-card rounded-2xl">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                        </div>
                    ) : filteredSlots.length === 0 ? (
                        <div className="text-center py-16 bg-white/50 border border-dashed border-slate-300 rounded-2xl">
                            <CalendarSearch className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-1">
                                {availableSlots.length > 0 ? "No slots match your filters" : "No slots available"}
                            </h3>
                            <p className="text-slate-500">
                                {availableSlots.length > 0 ? "Try adjusting your date or specialization filter." : "Please check back later when doctors add new slots."}
                            </p>
                            {availableSlots.length > 0 && (
                                <button 
                                    onClick={() => { setFilterDate(''); setFilterSpecialization('All'); }} 
                                    className="mt-4 text-primary-600 font-medium hover:underline"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {filteredSlots.map(slot => (
                                <SlotCard
                                    key={slot.id}
                                    slot={slot}
                                    onAction={handleBookSlot}
                                    actionConfig={{
                                        label: bookingSlotId === slot.id ? 'Booking...' : 'Book Consultation',
                                        className: 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md disabled:bg-primary-400',
                                        disabled: bookingSlotId === slot.id
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* My Bookings */}
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Settings className="w-6 h-6 text-primary-400" />
                        My Appointments
                    </h2>

                    {loadingBookings ? (
                        <div className="flex justify-center p-12 glass-card rounded-2xl">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
                        </div>
                    ) : myBookings.length === 0 ? (
                        <div className="text-center py-16 bg-white/50 border border-dashed border-slate-300 rounded-2xl">
                            <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-1">No bookings yet</h3>
                            <p className="text-slate-500">When you book a consultation, it will appear here.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {myBookings.map(booking => {
                                // To fetch actual slot details we need to expand backend or just show link
                                // The current API /user/my-bookings returns booking object which only has slot_id
                                // We don't have the time of the booking out of the box from backend unless we join
                                // But we can just show the booking ID and the meet link for now
                                return (
                                    <div key={booking.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between items-start gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-1 bg-primary-950 text-primary-400 text-xs font-bold rounded-full">
                                                    Booking #{booking.id}
                                                </span>
                                                <span className="text-sm font-medium text-slate-500">Slot ID: {booking.slot_id}</span>
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-800">Doctor Consultation</h4>
                                        </div>

                                        <a
                                            href={booking.meet_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex justify-center items-center gap-2 py-2.5 bg-primary-950 text-primary-400 font-semibold rounded-xl hover:bg-primary-950 transition-colors border border-indigo-200"
                                        >
                                            <Video className="w-4 h-4" /> Connect to Google Meet
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PatientDashboard;
