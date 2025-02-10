import { useState, useEffect } from "react";
import { db } from "../../firebase";
import PropTypes from "prop-types";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const RunForm = ({ selectedRun, setSelectedRun, user }) => {
  const [formData, setFormData] = useState({
    date: "",
    distance: "",
    time: "",
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
    <AnimatePresence mode='wait'>
      <motion.div
        key={selectedRun ? selectedRun.id : "new-run"}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className='bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto'
      >
        {/* Animated Title */}
        <motion.h2
          key={selectedRun ? "editing-title" : "add-title"}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='text-2xl font-bold text-gray-900 text-center mb-2'
        >
          {selectedRun ? "Edit Run" : "Add New Run"}
        </motion.h2>

        {/* Animated "Editing Run from..." Message */}
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

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Date Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <label htmlFor='date' className='block text-gray-700 font-medium'>
              Date:
            </label>
            <input
              id='date'
              type='date'
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none text-white placeholder-gray-500'
            />
          </motion.div>

          {/* Distance Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <label
              htmlFor='distance'
              className='block text-gray-700 font-medium'
            >
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
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none text-white placeholder-gray-500'
            />
          </motion.div>

          {/* Time Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label htmlFor='time' className='block text-gray-700 font-medium'>
              Time (minutes):
            </label>
            <input
              id='time'
              type='number'
              placeholder='Enter time (minutes)'
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
              step='0.1'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none text-white placeholder-gray-500'
            />
          </motion.div>

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
    </AnimatePresence>
  );
};

RunForm.propTypes = {
  selectedRun: PropTypes.object,
  setSelectedRun: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default RunForm;
