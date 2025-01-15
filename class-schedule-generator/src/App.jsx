import { useState } from 'react'
import ScheduleForm from './components/ScheduleForm'
import Calendar from './components/Calendar'
import Footer from './components/Footer'

function App() {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const handleAddSchedule = (newSchedules) => {
    if (editingSchedule !== null) {
      // Get the original schedule being edited
      const originalSchedule = schedules[editingSchedule];
      
      // Remove all schedules with the same title as the one being edited
      const remainingSchedules = schedules.filter(schedule => 
        schedule.title !== originalSchedule.title
      );
      
      // Add all the new schedules
      setSchedules([...remainingSchedules, ...newSchedules]);
    } else {
      // Add new schedules
      setSchedules([...schedules, ...newSchedules]);
    }
    setShowForm(false);
    setEditingSchedule(null);
  };

  const handleEdit = (index) => {
    // Get the schedule being edited
    const scheduleToEdit = schedules[index];
    
    // Find all schedules with the same title
    const relatedSchedules = schedules.filter(schedule => 
      schedule.title === scheduleToEdit.title
    );
    
    setEditingSchedule(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    setSchedules(prevSchedules => {
      const newSchedules = [...prevSchedules];
      newSchedules.splice(index, 1);
      return newSchedules;
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-grow py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-black">Arrange Your Class Schedule</h1>
            <button
              onClick={() => {
                setEditingSchedule(null);
                setShowForm(!showForm);
              }}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              {showForm ? 'Close Form' : 'Add Class'}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {showForm && (
              <div className="lg:w-1/3">
                <ScheduleForm
                  onAddSchedule={handleAddSchedule}
                  initialData={editingSchedule !== null ? {
                    ...schedules[editingSchedule],
                    schedules: schedules
                      .filter(s => s.title === schedules[editingSchedule].title)
                      .map(s => ({
                        day: s.day,
                        startTime: s.startTime,
                        endTime: s.endTime
                      }))
                  } : null}
                  editIndex={editingSchedule}
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

      <Footer />
    </div>
  );
}

export default App
