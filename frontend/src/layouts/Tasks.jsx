import React, { useEffect, useState } from "react";
import { MdDelete, MdKeyboardArrowRight } from "react-icons/md";
import { LiaCalendarWeekSolid } from "react-icons/lia";
import { Modal } from "flowbite-react";
import toast from "react-hot-toast";

function getDefaultDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${date}T${hours}:${minutes}`;
}

function groupTasksByMonth(tasks) {
  return tasks.reduce((acc, task) => {
    const date = new Date(task.time);
    const monthYear = date.toLocaleString("default", { month: "long", year: "numeric" });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(task);
    return acc;
  }, {});
}

export default function Tasks({ id, name, showTaskModal, setShowTaskModal }) {

  const [tasks, setTasks] = useState([]);
  const [taskDetails, setTaskDetails] = useState({
    notes: "",
    time: getDefaultDateTime(),
  });

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/task/getTasks/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTasks();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTask = async () => {
    try {
      const response = await fetch(`/api/task/createTask/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskDetails),
      });
      const newTask = await response.json();
      if (!response.ok) {
        toast.error(newTask.message);
        return;
      }
      setTasks((prev) => [...prev, newTask]);
      setShowTaskModal(false);
      setTaskDetails({ notes: "", time: getDefaultDateTime() });
      toast.success('Task has been created!');
    } catch (error) {
      toast.error(error.message)
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/task/deleteTask/${taskId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete task.');

      await fetchTasks();
      toast.success('Task deleted successfully');
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to delete task');
    }
  };

  const currentDateTime = new Date();
  const upcomingTasks = tasks.filter((task) => new Date(task.time) > currentDateTime);
  const finishedTasks = groupTasksByMonth(tasks.filter((task) => new Date(task.time) <= currentDateTime));

  return (
    <div>
      <div className="w-full flex justify-end">
        <button
          className="bg-gray-700 rounded-md px-3 py-2 text-sm text-white hover:bg-gray-900 transition-colors duration-150"
          onClick={() => setShowTaskModal(true)}
        >
          Create Task
        </button>
      </div>

      {/* Upcoming Tasks */}
      <p className="text-gray-700 mt-5">Upcoming</p>
      {upcomingTasks.length > 0 ? (
        upcomingTasks.map((task) => (
          <div key={task.id} className="bg-white shadow-md rounded-md p-5 mt-5 border">
            <div className="flex flex-col md:items-center md:justify-between md:flex-row-reverse">
              <div className="flex items-center gap-2">
                <p className="text-xs text-teal-500 flex gap-1 items-center">
                  <LiaCalendarWeekSolid className="text-lg" />
                  {new Date(task.time).toLocaleString()}
                </p>
                <button className="bg-red-500 text-white px-1 py-1 rounded-md hover:bg-red-600 text-xs transition-colors duration-150" onClick={() => handleDeleteTask(task.id)} title='Delete Task'>
                  <MdDelete />
                </button>
              </div>
              <p className="text-gray-800 text-sm flex gap-1 items-center mt-2 md:mt-0">
                <MdKeyboardArrowRight className="text-lg" />
                Task assigned for <span className="font-semibold capitalize">{name}</span>
              </p>
            </div>
            <p className="text-gray-800 text-sm pl-[21px] mt-3">{task.notes}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 mt-5">No upcoming tasks.</p>
      )}

      {/* Finished Tasks */}
      {Object.keys(finishedTasks).length > 0 && (
        <>
          {Object.entries(finishedTasks).map(([monthYear, tasks]) => (
            <div key={monthYear} className="mt-5">
              <p className="text-gray-600 font-semibold">{monthYear}</p>
              {tasks.map((task) => (
                <div key={task.id} className="bg-white shadow-md rounded-md p-5 mt-3 border">
                  <div className="flex flex-col md:items-center md:justify-between md:flex-row-reverse">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-teal-500 flex gap-1 items-center">
                        <LiaCalendarWeekSolid className="text-lg" />
                        {new Date(task.time).toLocaleString()}
                      </p>
                      <button className="bg-red-500 text-white px-1 py-1 rounded-md hover:bg-red-600 text-xs transition-colors duration-150" onClick={() => handleDeleteTask(task.id)} title='Delete Task'>
                        <MdDelete />
                      </button>
                    </div>
                    <p className="text-gray-800 text-sm flex gap-1 items-center mt-2 md:mt-0">
                      <MdKeyboardArrowRight className="text-lg" />
                      Task completed for <span className="font-semibold capitalize">{name}</span>
                    </p>
                  </div>
                  <p className="text-gray-800 text-sm pl-[21px] mt-3">{task.notes}</p>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Modal */}
      <Modal show={showTaskModal} onClose={() => setShowTaskModal(false)}>
        <Modal.Header>Create Task</Modal.Header>
        <Modal.Body>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={taskDetails.notes}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Task Time</label>
              <input
                type="datetime-local"
                name="time"
                value={taskDetails.time}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleCreateTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={() => setShowTaskModal(false)}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
