import { useState, useEffect } from "react";
import { db } from "../../firebase";
import PropTypes from "prop-types";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const sports = [
  { label: "🏃‍➡️ - Running", value: "running", emoji: "🏃‍♂️" },
  { label: "🛼 - Inline skating", value: "inline_skating", emoji: "🛼" },
  { label: "🚲 - Cycling", value: "cycling", emoji: "🚲" },
];

const RunForm = ({ selectedRun, setSelectedRun, user, clearActiveRun }) => {
  const [formData, setFormData] = useState({
    date: "",
    distance: "",
    time: "",
    sport: sports[0].value, // Default to Running
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedRun) {
      setIsEditing(true);
      setFormData(selectedRun);
    } else {
      setIsEditing(false);
      resetForm();
    }
  }, [selectedRun]);

  const resetForm = () => {
    setFormData({ date: "", distance: "", time: "", sport: sports[0].value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { date, distance, time, sport } = formData;

    if (!distance || distance <= 0 || !time || time <= 0) {
      alert("Please provide valid distance and time values.");
      return;
    }

    const runData = {
      date,
      distance: parseFloat(distance),
      time: parseFloat(time),
      speed: (distance / (time / 60)).toFixed(2),
      sport,
      userId: user?.uid || "unknown",
    };

    try {
      if (selectedRun) {
        await setDoc(doc(db, "runs", selectedRun.id), runData);
      } else {
        await addDoc(collection(db, "runs"), runData);
      }
      resetForm();
      setSelectedRun(null);
      clearActiveRun();
    } catch (error) {
      console.error("Error saving the run:", error);
      alert("An error occurred while saving the run.");
    }
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".form-card") && isEditing) {
      setSelectedRun(null);
      clearActiveRun();
      resetForm();
    }
  };

  return (
    <AnimatePresence mode='wait'>
      {isEditing && (
        <motion.div
          className='fixed inset-0 bg-transparent z-30'
          onClick={handleOutsideClick}
        ></motion.div>
      )}

      <motion.div
        key={selectedRun ? selectedRun.id : "new-run"}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className='bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto relative z-30 form-card'
      >
        <motion.h2
          key={selectedRun ? "editing-title" : "add-title"}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='text-2xl font-bold text-gray-900 text-center mb-2'
        >
          {selectedRun ? "Edit Run" : "Add New Run"}
        </motion.h2>

        {selectedRun && (
          <motion.p
            key={selectedRun.date}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className='text-center text-gray-600 italic mb-4'
          >
            Editing run from{" "}
            <span className='font-semibold'>{selectedRun.date}</span>
          </motion.p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor='date' className='block text-gray-700 font-medium'>
            Date:
          </label>
          <input
            id='date'
            type='date'
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none mb-2'
          />

          <label htmlFor='distance' className='block text-gray-700 font-medium'>
            Distance (km):
          </label>
          <input
            id='distance'
            type='number'
            placeholder='Enter distance (km)'
            value={formData.distance}
            onChange={(e) =>
              setFormData({
                ...formData,
                distance: e.target.value < 0 ? 0 : e.target.value,
              })
            }
            required
            step='0.01'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none mb-2'
          />

          <label htmlFor='time' className='block text-gray-700 font-medium'>
            Time (minutes):
          </label>
          <input
            id='time'
            type='number'
            placeholder='Enter time (minutes)'
            value={formData.time}
            onChange={(e) =>
              setFormData({
                ...formData,
                time: e.target.value < 0 ? 0 : e.target.value,
              })
            }
            required
            step='0.1'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none mb-6'
          />

          {/* ✅ Select Sport */}
          <label htmlFor='sport' className='block text-gray-700 font-medium'>
            Select Sport:
          </label>
          <motion.select
            id='sport'
            value={formData.sport}
            onChange={(e) =>
              setFormData({ ...formData, sport: e.target.value })
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none mb-6'
          >
            {sports.map((sport) => (
              <option key={sport.value} value={sport.value}>
                {sport.label}
              </option>
            ))}
          </motion.select>

          {/* ✅ Action Buttons */}
          <div className='flex justify-between'>
            <button
              type='submit'
              className='w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition font-semibold'
            >
              {selectedRun ? "Update Run" : "Add Run"}
            </button>

            {selectedRun && (
              <button
                type='button'
                onClick={() => {
                  resetForm();
                  setSelectedRun(null);
                  clearActiveRun(); // ✅ Remove active class in RunList
                }}
                className='w-full ml-4 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition font-semibold'
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

RunForm.propTypes = {
  selectedRun: PropTypes.object,
  setSelectedRun: PropTypes.func.isRequired,
  user: PropTypes.object,
  clearActiveRun: PropTypes.func.isRequired,
};

export default RunForm;
