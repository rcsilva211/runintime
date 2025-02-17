import { useEffect, useState } from "react";
import { db } from "../../firebase";
import PropTypes from "prop-types";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setRuns } from "../redux/runsSlice";

const sports = [
  { label: "🏃‍➡️ - Running", value: "running", emoji: "🏃‍♂️" },
  { label: "🛼 - Inline skating", value: "inline_skating", emoji: "🛼" },
  { label: "🚲 - Cycling", value: "cycling", emoji: "🚲" },
];

const RunList = ({ setSelectedRun, user, closeSidebar, isOpen }) => {
  const [loading, setLoading] = useState(true);
  const [activeRun, setActiveRun] = useState(null);
  const [deleteRunId, setDeleteRunId] = useState(null);

  const dispatch = useDispatch();
  const runs = useSelector((state) => state.runs.runs);

  useEffect(() => {
    if (user) {
      const runsQuery = query(
        collection(db, "runs"),
        where("userId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(runsQuery, (querySnapshot) => {
        const runsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        runsData.sort((a, b) => new Date(a.date) - new Date(b.date));

        dispatch(setRuns(runsData)); // Store in Redux
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, dispatch]);

  if (loading) {
    return (
      <div className='text-center mt-12 bg-white text-lg animate-pulse'>
        Loading runs...
      </div>
    );
  }

  const formatDate = (dateString) =>
    new Intl.DateTimeFormat("en-GB").format(new Date(dateString));

  const getMonthYear = (dateString) =>
    new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(
      new Date(dateString)
    );

  const confirmDelete = async () => {
    if (!deleteRunId) return;
    try {
      await deleteDoc(doc(db, "runs", deleteRunId));
      dispatch(setRuns(runs.filter((run) => run.id !== deleteRunId)));
    } catch (error) {
      console.error("Error deleting run:", error);
    }
    setDeleteRunId(null);
  };

  const groupedRuns = runs.reduce((acc, run) => {
    const month = getMonthYear(run.date);
    if (!acc[month]) acc[month] = { totalDistance: 0, runs: [] };
    acc[month].runs.push(run);
    acc[month].totalDistance += parseFloat(run.distance) || 0;
    return acc;
  }, {});

  const handleOverlayClick = (e) => {
    if (!e.target.closest(".sidebar")) {
      closeSidebar();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className='fixed top-0 left-0 w-full md:w-auto bg-white shadow-lg z-50 flex flex-col h-screen md:relative md:max-w-lg sidebar'
          >
            <div className='sticky top-0 bg-white p-4 flex items-center justify-between border-b'>
              <h2 className='text-2xl font-bold text-gray-900'>Run History</h2>

              <button
                onClick={closeSidebar}
                className='md:hidden bg-gray-800 text-white p-2 rounded-md'
              >
                <FaTimes className='text-lg' />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto px-4 py-2'>
              {runs.length === 0 && (
                <div className='text-center text-gray-500 text-lg'>
                  No runs available. Start running now!
                </div>
              )}

              {Object.entries(groupedRuns).map(
                ([month, { totalDistance, runs }]) => (
                  <div key={month} className='mb-4'>
                    <h3 className='text-lg font-semibold text-gray-800 border-b-2 border-gray-300 pb-1 flex justify-between'>
                      <span>🏃 {month}</span>
                      <span className='text-red-600 font-bold'>
                        {totalDistance.toFixed(1)} km
                      </span>
                    </h3>

                    <ul className='space-y-3 mt-3'>
                      {runs.map((run) => {
                        const sportEmoji =
                          sports.find((s) => s.value === run.sport)?.emoji ||
                          "❓";

                        return (
                          <motion.li
                            key={run.id || run.date}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRun(run);
                              setActiveRun(run.id);
                              setTimeout(() => {
                                closeSidebar();
                              }, 100);
                            }}
                            className={`relative p-4 rounded-lg shadow-md cursor-pointer transition-all run-item 
                    ${
                      activeRun === run.id
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 hover:bg-gray-300 text-black"
                    }`}
                          >
                            {/* ✅ Delete Button */}
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteRunId(run.id);
                              }}
                              className='absolute top-2 right-2 bg-gray-300 text-gray-600 p-1 rounded-full hover:bg-red-600 hover:text-white transition'
                            >
                              <FaTrash className='text-sm' />
                            </motion.button>

                            <p className='text-lg font-semibold'>
                              {formatDate(run.date)}
                            </p>
                            <p className='text-gray-700'>
                              Distance:{" "}
                              <span className='font-semibold'>
                                {run.distance} km
                              </span>
                            </p>
                            <p className='text-gray-700'>
                              Speed:{" "}
                              <span className='font-semibold'>
                                {run.speed} km/h
                              </span>
                            </p>

                            <span className='absolute bottom-2 right-2 text-2xl'>
                              {sportEmoji}
                            </span>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </>
      )}

      {/* ✅ Delete Confirmation Modal - Moved Here */}
      <AnimatePresence>
        {deleteRunId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4'
            style={{ zIndex: 100 }}
            onClick={() => setDeleteRunId(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className='bg-white p-6 rounded-lg shadow-lg max-w-sm w-full'
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className='text-xl font-semibold text-gray-900'>
                Delete Run?
              </h3>
              <p className='text-gray-600 mt-2'>
                Are you sure you want to delete this run? This action cannot be
                undone.
              </p>
              <div className='flex justify-end mt-4 space-x-2'>
                <button
                  onClick={() => setDeleteRunId(null)}
                  className='px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition'
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition'
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='hidden top-8 md:flex md:flex-col md:relative md:max-w-lg sidebar'>
        <div className='sticky top-0 bg-white p-4 flex items-center justify-between border-b'>
          <h2 className='text-2xl font-bold text-gray-900'>Run History</h2>
        </div>

        <div className='flex-1 overflow-y-auto px-4 py-2'>
          {runs.length === 0 && (
            <div className='text-center text-gray-500 text-lg'>
              No runs available. Start running now!
            </div>
          )}

          {Object.entries(groupedRuns).map(
            ([month, { totalDistance, runs }]) => (
              <div key={month} className='mb-4'>
                <h3 className='text-lg font-semibold text-gray-800 border-b-2 border-gray-300 pb-1 flex justify-between'>
                  <span>🏃 {month}</span>
                  <span className='text-red-600 font-bold'>
                    {totalDistance.toFixed(1)} km
                  </span>
                </h3>

                <ul className='space-y-3 mt-3'>
                  {runs.map((run) => {
                    const sportEmoji =
                      sports.find((s) => s.value === run.sport)?.emoji || "❓";

                    return (
                      <motion.li
                        key={run.id || run.date}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRun(run);
                          setActiveRun(run.id);
                        }}
                        className={`relative p-4 rounded-lg shadow-md cursor-pointer transition-all run-item 
                        ${
                          activeRun === run.id
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 hover:bg-gray-300 text-black"
                        }`}
                      >
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteRunId(run.id);
                          }}
                          className='absolute top-2 right-2 bg-gray-300 text-gray-600 p-1 rounded-full hover:bg-red-600 hover:text-white transition'
                        >
                          <FaTrash className='text-sm' />
                        </motion.button>

                        <p className='text-lg font-semibold'>
                          {formatDate(run.date)}
                        </p>
                        <p className='text-gray-700'>
                          Distance:{" "}
                          <span className='font-semibold'>
                            {run.distance} km
                          </span>
                        </p>
                        <p className='text-gray-700'>
                          Speed:{" "}
                          <span className='font-semibold'>
                            {run.speed} km/h
                          </span>
                        </p>

                        <span className='absolute bottom-2 right-2 text-2xl'>
                          {sportEmoji}
                        </span>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};

RunList.propTypes = {
  setSelectedRun: PropTypes.func.isRequired,
  user: PropTypes.object,
  closeSidebar: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default RunList;
