import { useEffect, useState } from "react";
import { db } from "../../firebase";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setRuns } from "../redux/runsSlice";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";

const RunList = ({ setSelectedRun, user }) => {
  const [loading, setLoading] = useState(true);
  const runs = useSelector((state) => state.runs.runs);
  const dispatch = useDispatch();
  const [activeRun, setActiveRun] = useState(null);

  useEffect(() => {
    const fetchRuns = async () => {
      setLoading(true);
      if (user) {
        const runsQuery = query(
          collection(db, "runs"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(runsQuery);
        const runsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort runs by date (newest first)
        runsData.sort((a, b) => new Date(b.date) - new Date(a.date));

        dispatch(setRuns(runsData));
      }
      setLoading(false);
    };

    fetchRuns();
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className='text-center text-gray-500 text-lg animate-pulse'>
        Loading runs...
      </div>
    );
  }

  // Function to format date to "DD-MM-YYYY"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB").format(date); // "DD-MM-YYYY"
  };

  // Function to get "Month YYYY" for grouping runs
  const getMonthYear = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Group runs by month
  const groupedRuns = runs.reduce((acc, run) => {
    const month = getMonthYear(run.date);
    if (!acc[month]) acc[month] = [];
    acc[month].push(run);
    return acc;
  }, {});

  return (
    <div className='w-full h-full max-w-lg mx-auto bg-white p-6 shadow-lg flex flex-col overflow-hidden'>
      <h2 className='text-2xl font-bold text-gray-900 mb-4'>Run History</h2>

      {/* Scrollable Runs List */}
      <div className='flex-1 overflow-y-auto'>
        {groupedRuns.length === 0 && (
          <p className='text-black text-center mt-2'>
            No runs recorded this month.
          </p>
        )}
        {Object.entries(groupedRuns).map(([month, monthRuns]) => (
          <div key={month} className='mb-4'>
            <h3 className='text-lg font-semibold text-gray-800 border-b-2 border-gray-300 pb-1'>
              🏃 {month}
            </h3>

            <ul className='space-y-3 mt-3'>
              {monthRuns.map((run) => (
                <motion.li
                  key={run.id || run.date}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedRun(run);
                    setActiveRun(run.id);
                  }}
                  className={`p-4 rounded-lg shadow-md cursor-pointer transition-all 
                    ${
                      activeRun === run.id
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-black"
                    }`}
                >
                  <p className='text-lg font-semibold'>
                    {formatDate(run.date)}
                  </p>
                  <p className='text-gray-700'>
                    Distance:{" "}
                    <span className='font-semibold'>{run.distance} km</span>
                  </p>
                  <p className='text-gray-700'>
                    Speed:{" "}
                    <span className='font-semibold'>{run.speed} km/h</span>
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

RunList.propTypes = {
  setSelectedRun: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default RunList;
