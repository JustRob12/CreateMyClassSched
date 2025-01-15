import React, { useState, useEffect } from 'react';

const ScheduleForm = ({ onAddSchedule, initialData, editIndex }) => {
  const emptySchedule = {
    day: '',
    startTime: '07:00',
    endTime: '07:00'
  };

  const emptyForm = {
    title: '',
    instructor: '',
    room: '',
    backgroundColor: '#000000',
    schedules: [{ ...emptySchedule }]
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyForm);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const schedulesList = formData.schedules.map(schedule => ({
      title: formData.title,
      instructor: formData.instructor,
      room: formData.room,
      backgroundColor: formData.backgroundColor,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime
    }));
    onAddSchedule(schedulesList);
    // Reset form after submission
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getAmPm = (time) => {
    if (!time) return 'AM';
    const [hours] = time.split(':');
    const hour = parseInt(hours);
    return hour >= 12 ? 'PM' : 'AM';
  };

  const toggleAmPm = (scheduleIndex, field) => {
    const currentTime = formData.schedules[scheduleIndex][field];
    const [hours, minutes] = currentTime.split(':');
    let hour = parseInt(hours);
    
    if (hour < 12 && getAmPm(currentTime) === 'AM') {
      hour += 12;
    } else if (hour >= 12 && getAmPm(currentTime) === 'PM') {
      hour -= 12;
    }
    
    const newTime = `${hour.toString().padStart(2, '0')}:${minutes}`;
    const newSchedules = [...formData.schedules];
    newSchedules[scheduleIndex] = {
      ...newSchedules[scheduleIndex],
      [field]: newTime
    };
    
    setFormData(prev => ({
      ...prev,
      schedules: newSchedules
    }));
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...formData.schedules];
    newSchedules[index] = {
      ...newSchedules[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      schedules: newSchedules
    }));
  };

  const addSchedule = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [
        { ...emptySchedule }, // Add new empty schedule at the top
        ...prev.schedules.map(schedule => ({ // Keep existing schedules with their data
          day: schedule.day,
          startTime: schedule.startTime,
          endTime: schedule.endTime
        }))
      ]
    }));
  };

  const removeSchedule = (index) => {
    if (formData.schedules.length > 1) {
      setFormData(prev => ({
        ...prev,
        schedules: prev.schedules.filter((_, i) => i !== index)
      }));
    }
  };

  const days = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' }
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto animate-slideIn">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Form Header */}
        <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">
            {editIndex !== null ? 'Edit Schedule' : 'Add Schedule'}
          </h2>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Course Title */}
          <div className="space-y-1">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Course Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
              required
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instructor */}
            <div className="space-y-1">
              <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                Instructor
              </label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                placeholder="TBA"
                value={formData.instructor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
              />
            </div>

            {/* Room */}
            <div className="space-y-1">
              <label htmlFor="room" className="block text-sm font-medium text-gray-700">
                Room
              </label>
              <input
                type="text"
                id="room"
                name="room"
                value={formData.room}
                placeholder="TBA"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
              />
            </div>
          </div>

          {/* Multiple Schedules Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-black">Class Schedule</h3>
              <button
                type="button"
                onClick={addSchedule}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 hover:scale-105"
              >
                Add Schedule
              </button>
            </div>

            {formData.schedules.map((schedule, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-medium text-black">
                    Schedule {formData.schedules.length - index}
                  </h4>
                  {formData.schedules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSchedule(index)}
                      className="text-black hover:text-gray-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Day Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-1">
                    Day
                  </label>
                  <select
                    value={schedule.day}
                    onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                    className="block w-full rounded-md border border-gray-400/50 shadow-sm focus:border-black focus:ring-black"
                    required
                  >
                    <option value="">Select a day</option>
                    {days.map(day => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </div>

                {/* Time Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Start Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                        className="block w-full rounded-md border border-gray-400/50 shadow-sm focus:border-black focus:ring-black pr-16 appearance-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => toggleAmPm(index, 'startTime')}
                        className="absolute inset-y-0 right-0 flex items-center hover:bg-gray-200 transition-colors"
                      >
                        <span className="text-sm font-medium text-black bg-gray-100 px-3 py-1 rounded-r-md border-l h-full flex items-center">
                          {getAmPm(schedule.startTime)}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      End Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                        className="block w-full rounded-md border border-gray-400/50 shadow-sm focus:border-black focus:ring-black pr-16 appearance-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => toggleAmPm(index, 'endTime')}
                        className="absolute inset-y-0 right-0 flex items-center hover:bg-gray-200 transition-colors"
                      >
                        <span className="text-sm font-medium text-black bg-gray-100 px-3 py-1 rounded-r-md border-l h-full flex items-center">
                          {getAmPm(schedule.endTime)}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => handleChange({ target: { name: 'backgroundColor', value: e.target.value } })}
                className="w-12 h-12 rounded-lg cursor-pointer border border-gray-400/50"
              />
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <div className="px-6 py-4 bg-gray-100 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 hover:scale-105 transform active:scale-95"
            >
              {editIndex !== null ? 'Update Schedule' : 'Add Schedule'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ScheduleForm;
