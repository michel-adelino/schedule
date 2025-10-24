import React, { useState } from 'react';
import { Dancer } from '../../types/dancer';
import { ScheduledRoutine } from '../../types/schedule';
import { X, Mail, Download, Copy, Check } from 'lucide-react';
import { formatTime, getDayName } from '../../utils/timeUtils';

interface EmailScheduleModalProps {
  dancers: Dancer[];
  scheduledRoutines: ScheduledRoutine[];
  isOpen: boolean;
  onClose: () => void;
}

export const EmailScheduleModal: React.FC<EmailScheduleModalProps> = ({
  dancers,
  scheduledRoutines,
  isOpen,
  onClose
}) => {
  const [selectedDancer, setSelectedDancer] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const selectedDancerData = dancers.find(d => d.id === selectedDancer);
  
  const getDancerSchedule = (dancerId: string) => {
    return scheduledRoutines.filter(routine =>
      routine.routine.dancers.some(dancer => dancer.id === dancerId)
    );
  };

  const formatScheduleText = (dancer: Dancer, routines: ScheduledRoutine[]) => {
    const scheduleText = `
Hi ${dancer.name},

Here's your rehearsal schedule for this week:

${routines.length === 0 ? 'No rehearsals scheduled this week.' : routines.map(routine => {
  const dayName = getDayName(routine.startTime.day);
  const startTime = formatTime(routine.startTime.hour, routine.startTime.minute);
  const endTime = formatTime(routine.endTime.hour, routine.endTime.minute);
  
  return `${dayName} - ${startTime} to ${endTime}
  Routine: ${routine.routine.songTitle}
  Room: ${routine.roomId}
  Teacher: ${routine.routine.teacher.name}`;
}).join('\n\n')}

Please arrive 10 minutes early for warm-up.

Best regards,
Dance Studio Team
    `.trim();

    return scheduleText;
  };

  const handleCopyToClipboard = async () => {
    if (!selectedDancerData) return;
    
    const routines = getDancerSchedule(selectedDancer);
    const scheduleText = formatScheduleText(selectedDancerData, routines);
    
    try {
      await navigator.clipboard.writeText(scheduleText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedDancerData) return;
    
    const routines = getDancerSchedule(selectedDancer);
    const scheduleText = formatScheduleText(selectedDancerData, routines);
    
    // Create a simple text file download
    const blob = new Blob([scheduleText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDancerData.name}_schedule.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const routines = selectedDancer ? getDancerSchedule(selectedDancer) : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Email Schedules</h2>
              <p className="text-sm text-gray-600">Send personalized schedules to dancers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Dancer Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Dancer
              </label>
              <select
                value={selectedDancer}
                onChange={(e) => setSelectedDancer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a dancer...</option>
                {dancers.map(dancer => (
                  <option key={dancer.id} value={dancer.id}>
                    {dancer.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Schedule Preview */}
            {selectedDancer && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Schedule for {selectedDancerData?.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyToClipboard}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>

                {routines.length === 0 ? (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-gray-600">No rehearsals scheduled for this dancer</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {routines.map(routine => (
                      <div key={routine.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {routine.routine.songTitle}
                          </h4>
                          <div className="text-sm text-gray-600">
                            {getDayName(routine.startTime.day)} • {formatTime(routine.startTime.hour, routine.startTime.minute)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Room: {routine.roomId}</div>
                          <div>Teacher: {routine.routine.teacher.name}</div>
                          <div>Duration: {routine.duration} minutes</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Email Preview */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Email Preview:</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {selectedDancerData ? formatScheduleText(selectedDancerData, routines) : 'Select a dancer to preview...'}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
