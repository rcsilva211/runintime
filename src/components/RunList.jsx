import { useEffect, useState } from "react";
import { db } from "../../firebase";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setRuns } from "../redux/runsSlice";
import { collection, getDocs } from "firebase/firestore";
import { query, where } from "firebase/firestore";

const RunList = ({ setSelectedRun, user }) => {
  const [loading, setLoading] = useState(true);
  const runs = useSelector((state) => state.runs.runs);
  const dispatch = useDispatch();

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
        dispatch(setRuns(runsData));
      }
      setLoading(false);
    };

    fetchRuns();
  }, [dispatch, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => setSelectedRun(null)}>Add New Record</button>
      <ul>
        {runs.map((run) => (
          <li key={run.id || run.date} onClick={() => setSelectedRun(run)}>
            {run.date} - {run.distance} km - {run.speed} km/h
          </li>
        ))}
      </ul>
    </div>
  );
};

RunList.propTypes = {
  setSelectedRun: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default RunList;
