import React from 'react';
import { Clock, BookOpen } from 'lucide-react';
import { formatDuration, formatDateTime } from '../utils/time';

const getRelativeDate = (date) => {
    const sessionDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (sessionDate.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (sessionDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return formatDateTime(sessionDate, { month: 'short', day: 'numeric' });
    }
};

const SessionHistory = ({ sessions = [] }) => {

    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Recent Sessions</h2>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
                {sessions.length === 0 ? (
                    <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-white/30 mx-auto mb-3" />
                        <p className="text-white/60">No sessions yet</p>
                        <p className="text-white/40 text-sm">Start your first study session!</p>
                    </div>
                ) : (
                    sessions.map((session, index) => (
                        <div
                            key={session.id || index}
                            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span className="text-white font-medium">
                                        {getRelativeDate(session.date)}
                                    </span>
                                    <span className="text-white/60 text-sm">
                                        at {formatDateTime(session.date, { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <span className="text-blue-400 font-semibold">
                                    {formatDuration(session.duration)}
                                </span>
                            </div>

                            {session.notes && session.notes !== 'No notes added' && (
                                <p className="text-white/70 text-sm italic">
                                    "{session.notes}"
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SessionHistory;