import React, { useState, useRef, useEffect } from 'react';

const Calendar = ({ schedules, onEdit, onDelete, onAdd }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [downloadSize, setDownloadSize] = useState('pc'); // 'pc' or 'mobile'
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const calendarRef = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatScheduleTime = (time) => {
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    
    if (hour > 12) {
      hour -= 12;
    } else if (hour === 0) {
      hour = 12;
    }
    
    return `${hour}:${minutes} ${ampm}`;
  };

  // Group schedules by day
  const schedulesByDay = days.reduce((acc, day) => {
    acc[day] = schedules
      .filter(schedule => schedule.day === day)
      .map((schedule, index) => ({
        ...schedule,
        originalIndex: schedules.findIndex(s => s === schedule)
      }))
      .sort((a, b) => {
        const timeA = parseInt(a.startTime.split(':')[0]);
        const timeB = parseInt(b.startTime.split(':')[0]);
        return timeA - timeB;
      });
    return acc;
  }, {});

  const getTextColor = (backgroundColor) => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'text-gray-800' : 'text-white';
  };

  const handleDeleteClick = (index) => {
    setShowConfirmDelete(index);
    setTimeout(() => {
      setShowConfirmDelete(null);
    }, 3000);
  };

  const handleDownload = async () => {
  
    try {
      setIsDownloading(true);
      const html2canvas = (await import('html2canvas')).default;
      const calendar = calendarRef.current;
      
      if (calendar) {
        // Add temporary class for download size
        calendar.classList.add(downloadSize === 'mobile' ? 'mobile-download' : 'pc-download');
        
        const canvas = await html2canvas(calendar, {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: downloadSize === 'mobile' ? 390 : 1920,
        });
        
        // Remove temporary class
        calendar.classList.remove(downloadSize === 'mobile' ? 'mobile-download' : 'pc-download');
        
        // Create download link
        const link = document.createElement('a');
        link.download = `class-schedule-${downloadSize}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download schedule. Please make sure html2canvas is installed.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddSchedule = (newSchedules) => {
    if (editingIndex !== null) {
      // Remove the old schedule
      const filteredSchedules = schedules.filter((_, index) => index !== editingIndex);
      // Add all the new schedules
      onAdd([...filteredSchedules, ...newSchedules]);
    } else {
      // Add new schedules to the existing ones
      onAdd([...schedules, ...newSchedules]);
    }
    setShowForm(false);
    setEditingIndex(null);
  };

  const handleEditSchedule = (scheduleIndex) => {
    const schedule = schedules[scheduleIndex];
    setEditingIndex(scheduleIndex);
    setShowForm(true);
  };

  const handleDeleteSchedule = (scheduleIndex) => {
    onAdd(schedules.filter((_, index) => index !== scheduleIndex));
  };

  return (
    <div className="space-y-4">
      {/* Download Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Class Schedule</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Download Size:</label>
            <select
              value={downloadSize}
              onChange={(e) => setDownloadSize(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              disabled={isDownloading}
            >
              <option value="pc">PC Size</option>
              <option value="mobile">Mobile Size</option>
            </select>
          </div>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white w-full sm:w-auto justify-center ${
              isDownloading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Schedule
              </>
            )}
          </button>
        </div>
      </div>

      {/* Calendar View Toggle for Mobile */}
      {isMobileView && (
        <div className="px-4">
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            onChange={(e) => {
              const element = document.getElementById(e.target.value);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <option value="">Jump to day...</option>
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      )}

      {/* Calendar */}
      <div className="relative">
        <div 
          ref={calendarRef}
          className="w-full bg-white rounded-lg shadow-lg p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
        >
          <div className={`grid ${isMobileView ? 'grid-cols-1 gap-8' : 'grid-cols-5 gap-4'}`}>
            {days.map(day => (
              <div key={day} id={day} className="flex flex-col min-w-[250px] sm:min-w-0">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center pb-2 border-b border-gray-200 sticky top-0 bg-white">
                  {day}
                </h2>
                <div className="space-y-3 flex-1">
                  {schedulesByDay[day].map((schedule) => (
                    <div
                      key={schedule.originalIndex}
                      className="relative group"
                    >
                      {/* Main Schedule Card */}
                      <div
                        className="p-3 rounded-lg transition-all duration-200 hover:shadow-md break-words"
                        style={{ backgroundColor: schedule.backgroundColor || '#4F46E5' }}
                      >
                        <div className={`space-y-1 ${getTextColor(schedule.backgroundColor || '#4F46E5')}`}>
                          <h3 className="font-bold text-sm">{schedule.title}</h3>
                          <p className="text-xs">{schedule.instructor}</p>
                          <p className="text-xs">{schedule.room}</p>
                          <p className="text-xs font-semibold">
                            {formatScheduleTime(schedule.startTime)} - {formatScheduleTime(schedule.endTime)}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={`${isMobileView ? 'opacity-100 static mt-2 flex justify-end' : 'absolute -top-2 -right-2 opacity-0 group-hover:opacity-100'} transition-opacity flex gap-1`}>
                        <button
                          onClick={() => handleEditSchedule(schedule.originalIndex)}
                          className="bg-white text-gray-700 p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                          title="Edit Schedule"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(schedule.originalIndex)}
                          className="bg-white text-gray-700 p-1 rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Delete Schedule"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Delete Confirmation */}
                      {showConfirmDelete === schedule.originalIndex && (
                        <div className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center gap-2 z-10">
                          <button
                            onClick={() => handleDeleteSchedule(schedule.originalIndex)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setShowConfirmDelete(null)}
                            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {schedulesByDay[day].length === 0 && (
                    <div className="text-gray-500 text-center text-sm py-4">
                      No classes
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
