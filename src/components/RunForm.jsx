import { useState, useEffect } from "react";
import { db } from "../../firebase";
import PropTypes from "prop-types";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";

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

    // Validation
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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='date'>Date:</label>
        <input
          id='date'
          type='date'
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor='distance'>Distance (km):</label>
        <input
          id='distance'
          type='number'
          placeholder='Distance (km)'
          value={formData.distance}
          onChange={(e) =>
            setFormData({ ...formData, distance: e.target.value })
          }
          required
          step='0.01'
        />
      </div>

      <div>
        <label htmlFor='time'>Time (minutes):</label>
        <input
          id='time'
          type='number'
          placeholder='Time (minutes)'
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
          step='0.1'
        />
      </div>

      <button type='submit'>{selectedRun ? "Update" : "Add"} Record</button>
      {selectedRun && (
        <button
          type='button'
          onClick={() => {
            resetForm();
            setSelectedRun(null);
          }}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

RunForm.propTypes = {
  selectedRun: PropTypes.object,
  setSelectedRun: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default RunForm;
