import { useSelector } from "react-redux";

const Profile = () => {
  const runs = useSelector((state) => state.runs.runs);

  const totalDistance = runs.reduce(
    (sum, run) => sum + parseFloat(run.distance),
    0
  );
  const totalSpeed = runs.reduce((sum, run) => sum + parseFloat(run.speed), 0);
  const averageSpeed =
    runs.length > 0 ? (totalSpeed / runs.length).toFixed(2) : 0;

  return (
    <div>
      <h1>Profile</h1>
      <p>
        <strong>Total Distance:</strong> {totalDistance} km
      </p>
      <p>
        <strong>Average Speed:</strong> {averageSpeed} km/h
      </p>
    </div>
  );
};

export default Profile;
