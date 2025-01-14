import { useState } from 'react'
import ScheduleForm from './components/ScheduleForm'
import Calendar from './components/Calendar'

function App() {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const handleAddSchedule = (newSchedule) => {
    if (editingSchedule !== null) {
      // Update existing schedule
      setSchedules(schedules.map((schedule, index) => 
        index === editingSchedule ? newSchedule : schedule
      ));
      setEditingSchedule(null);
    } else {
      // Add new schedule
      setSchedules([...schedules, newSchedule]);
    }
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setEditingSchedule(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Class Schedule</h1>
          <button
            onClick={() => {
              setEditingSchedule(null);
              setShowForm(!showForm);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {showForm ? 'Close Form' : 'Add Class'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {showForm && (
            <div className="lg:w-1/3">
              <ScheduleForm 
                onAddSchedule={handleAddSchedule} 
                initialData={editingSchedule !== null ? schedules[editingSchedule] : null}
                isEditing={editingSchedule !== null}
              />
            </div>
          )}
          
          <div className={showForm ? 'lg:w-2/3' : 'w-full'}>
            <Calendar 
              schedules={schedules} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
