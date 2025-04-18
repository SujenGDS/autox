import AdminDashboard from "./AdminDash";
import Home from "./Home";

const Dashboard = () => {
  const isAdmin = localStorage.getItem("isAdmin");
  if (isAdmin && isAdmin == "true") {
    return <AdminDashboard />;
  } else {
    return <Home />;
  }
};

export default Dashboard;
