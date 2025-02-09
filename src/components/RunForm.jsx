import { useState, useEffect } from "react";
import { db } from "../../firebase";
import PropTypes from "prop-types";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { motion } from "framer-motion";

const RunForm = ({ selectedRun, setSelectedRun, user }) => {
  const [formData, setFormData] = useState({
    date: "",
    distance: "",
    time: "",
  });

  useEffect(() => {
    if (selectedRun) {
      setFormData(selectedRun);
    } else {
      resetForm();
    }
  }, [selectedRun]);

  const resetForm = () => {
    setFormData({ date: "", distance: "", time: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { date, distance, time } = formData;

    if (!distance || distance <= 0 || !time || time <= 0) {
      alert("Please provide valid distance and time values.");
      return;
    }

    const runData = {
      date,
      distance: parseFloat(distance),
      time: parseFloat(time),
      speed: (distance / (time / 60)).toFixed(2),
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
    } catch (error) {
      console.error("Error saving the run:", error);
      alert("An error occurred while saving the run.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto'
    >
      <h2 className='text-2xl font-bold text-gray-900 text-center mb-4'>
        {selectedRun ? "Edit Run" : "Add New Run"}
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Date Field */}
        <div>
          <label htmlFor='date' className='block text-gray-700 font-medium'>
            Date:
          </label>
          <input
            id='date'
            type='date'
            value={formData.date}
            placeholder='Select date'
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none text-white placeholder-white'
          />
        </div>

        {/* Distance Field */}
        <div>
          <label htmlFor='distance' className='block text-gray-700 font-medium'>
            Distance (km):
          </label>
          <input
            id='distance'
            type='number'
            placeholder='Enter distance (km)'
            value={formData.distance}
            onChange={(e) =>
              setFormData({ ...formData, distance: e.target.value })
            }
            required
            step='0.01'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none text-white placeholder-white'
          />
        </div>

        {/* Time Field */}
        <div>
          <label htmlFor='time' className='block text-gray-700 font-medium'>
            Time (minutes):
          </label>
          <input
            id='time'
            type='number'
            placeholder='Enter time (minutes)'
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
            step='0.1'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none text-white placeholder-white'
          />
        </div>

        {/* Action Buttons */}
        <div className='flex justify-between'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type='submit'
            className='w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition font-semibold'
          >
            {selectedRun ? "Update Run" : "Add Run"}
          </motion.button>

          {selectedRun && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type='button'
              onClick={() => {
                resetForm();
                setSelectedRun(null);
              }}
              className='w-full ml-4 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition font-semibold'
            >
              Cancel
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

RunForm.propTypes = {
  selectedRun: PropTypes.object,
  setSelectedRun: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default RunForm;
