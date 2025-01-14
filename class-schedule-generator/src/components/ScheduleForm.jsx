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
    backgroundColor: '#4F46E5',
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
      schedules: [{ ...emptySchedule }, ...prev.schedules]
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

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Form Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {editIndex !== null ? 'Edit Schedule' : 'Add Schedule'}
          </h2>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Course Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instructor */}
            <div>
              <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
                Instructor
              </label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                placeholder="TBA"
                value={formData.instructor}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Room */}
            <div>
              <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
                Room
              </label>
              <input
                type="text"
                id="room"
                name="room"
                value={formData.room}
                placeholder="TBA"
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Multiple Schedules Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">Class Schedule</h3>
              <button
                type="button"
                onClick={addSchedule}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Schedule
              </button>
            </div>

            {[...formData.schedules].reverse().map((schedule, index) => (
              <div key={formData.schedules.length - 1 - index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Schedule {formData.schedules.length - index}</h4>
                  {formData.schedules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSchedule(formData.schedules.length - 1 - index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Day Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day
                  </label>
                  <select
                    value={schedule.day}
                    onChange={(e) => handleScheduleChange(formData.schedules.length - 1 - index, 'day', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>

                {/* Time Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleScheduleChange(formData.schedules.length - 1 - index, 'startTime', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pr-16"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => toggleAmPm(formData.schedules.length - 1 - index, 'startTime')}
                        className="absolute inset-y-0 right-0 flex items-center hover:bg-gray-200 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-r-md border-l h-full flex items-center">
                          {getAmPm(schedule.startTime)}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleScheduleChange(formData.schedules.length - 1 - index, 'endTime', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pr-16"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => toggleAmPm(formData.schedules.length - 1 - index, 'endTime')}
                        className="absolute inset-y-0 right-0 flex items-center hover:bg-gray-200 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-r-md border-l h-full flex items-center">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => handleChange({ target: { name: 'backgroundColor', value: e.target.value } })}
                className="w-12 h-12 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
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
