import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

const Calendar = ({ schedules, onEdit, onDelete, onAdd }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const calendarRef = useRef(null);
  const isMobileView = window.innerWidth < 768;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Removed setIsMobileView since it's not being used
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatScheduleTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  // Group schedules by day
  const schedulesByDay = days.reduce((acc, day) => {
    acc[day] = schedules
      .filter(schedule => schedule.day === day)
      .map((schedule, idx) => ({
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
    setIsDownloading(true);
    try {
      const calendar = calendarRef.current;
      const canvas = await html2canvas(calendar, {
        scale: 2,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc, element) => {
          // Remove any hover effects or transitions
          const styles = document.createElement('style');
          styles.innerHTML = `
            * {
              transition: none !important;
              transform: none !important;
              animation: none !important;
            }
          `;
          element.appendChild(styles);
          
          // Make sure all schedule items are visible
          element.style.overflow = 'visible';
          element.querySelectorAll('.group').forEach(el => {
            el.style.opacity = '1';
          });
        }
      });

      // Convert to PNG and download
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'my-class-schedule.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
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

  const handleDeleteAll = (scheduleIndex) => {
    const scheduleToDelete = schedules[scheduleIndex];
    const allRelatedIndexes = schedules
      .map((s, index) => s.title === scheduleToDelete.title ? index : -1)
      .filter(index => index !== -1)
      .sort((a, b) => b - a); // Sort in descending order to delete from end to start
    
    // Delete all schedules with the same title
    allRelatedIndexes.forEach(index => onDelete(index));
    setShowConfirmDelete(null);
  };

  return (
    <div className="space-y-4">
      {/* Download Button */}
      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isDownloading ? (
            <span className="flex items-center">
              Downloading
              <span className="ml-2 animate-pulse">...</span>
            </span>
          ) : (
            'Download Schedule'
          )}
        </button>
      </div>

      {/* Calendar Grid */}
      <div 
        ref={calendarRef} 
        className="bg-white rounded-lg shadow-lg"
      >
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Day Headers */}
          {days.map((day) => (
            <div key={day} className="bg-gray-50 p-1 sm:p-2 text-center border-b border-gray-200">
              <h3 className="text-xs sm:text-sm font-semibold text-black">{day}</h3>
            </div>
          ))}

          {/* Schedule Cells */}
          {days.map((day) => (
            <div key={day} className="bg-white p-1 sm:p-2 min-h-[16rem] flex flex-col">
              {schedulesByDay[day].map((schedule) => (
                <div
                  key={`${schedule.title}-${schedule.originalIndex}`}
                  data-schedule
                  data-color={schedule.backgroundColor || '#000000'}
                  style={{ backgroundColor: schedule.backgroundColor || '#000000' }}
                  className="p-1 sm:p-2 mb-1 last:mb-0 rounded-lg relative group text-[10px] sm:text-sm transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg animate-fadeIn"
                >
                  <div className={`space-y-0.5 sm:space-y-1 ${getTextColor(schedule.backgroundColor || '#000000')}`}>
                    <h3 className="font-bold">{schedule.title}</h3>
                    <p>{schedule.instructor}</p>
                    <p>{schedule.room}</p>
                    <p className="font-semibold">
                      {formatScheduleTime(schedule.startTime)} - {formatScheduleTime(schedule.endTime)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className={`${isMobileView ? 'opacity-100 static mt-1 flex justify-end' : 'absolute -top-2 -right-2 opacity-0 group-hover:opacity-100'} transition-all duration-200 flex gap-1`}>
                    <button
                      onClick={() => onEdit(schedule.originalIndex)}
                      className="bg-white text-black p-1 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                      title="Edit Schedule"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(schedule.originalIndex)}
                      className="bg-white text-black p-1 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                      title="Delete Schedule"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 animate-modalSlideIn">
            <h3 className="text-lg font-semibold text-black mb-4">Delete Schedule</h3>
            <p className="text-gray-600 mb-6">
              Would you like to delete just this schedule or all schedules with the same name?
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  onDelete(showConfirmDelete);
                  setShowConfirmDelete(null);
                }}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Delete Only This Schedule
              </button>
              <button
                onClick={() => handleDeleteAll(showConfirmDelete)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Delete All Similar Schedules
              </button>
              <button
                onClick={() => setShowConfirmDelete(null)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
