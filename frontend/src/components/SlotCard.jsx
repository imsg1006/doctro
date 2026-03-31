import { Calendar, Clock } from 'lucide-react';

const SlotCard = ({ slot, onAction, actionConfig, children }) => {
    const startDate = new Date(slot.start_time);
    const endDate = new Date(slot.end_time);

    const formatedDate = startDate.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    const formatedTimeStart = startDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
    const formatedTimeEnd = endDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className={`p-5 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md ${slot.is_booked ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-white border-primary-100 hover:border-primary-300'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-3">
                    {slot.doctor && (
                        <div>
                            <h4 className="font-bold text-slate-800 text-lg">{slot.doctor.name || "Unknown Doctor"}</h4>
                            {slot.doctor.specialization && (
                                <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-full uppercase tracking-widest inline-block mt-1">
                                    {slot.doctor.specialization}
                                </span>
                            )}
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <Calendar className="w-5 h-5 text-primary-500" />
                        <span>{formatedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Clock className="w-4 h-4 text-slate-9000" />
                        <span>{formatedTimeStart} - {formatedTimeEnd}</span>
                    </div>
                </div>
                <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${slot.is_booked ? 'bg-amber-100 text-amber-700' : 'bg-primary-900 text-primary-400'}`}>
                        {slot.is_booked ? 'Booked' : 'Available'}
                    </span>
                </div>
            </div>

            {children}

            {actionConfig && onAction && (
                <button
                    onClick={() => onAction(slot.id)}
                    disabled={actionConfig.disabled || slot.is_booked && actionConfig.disableIfBooked}
                    className={`w-full mt-4 py-2.5 rounded-xl font-medium transition-all ${actionConfig.className} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {actionConfig.label}
                </button>
            )}
        </div>
    );
};

export default SlotCard;
