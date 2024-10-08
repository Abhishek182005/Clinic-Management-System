import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch appointment history from the server
    axios
      .get("http://localhost:5000/history")
      .then((response) => setHistory(response.data))
      .catch((error) => console.error("Error fetching history:", error));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    // Update the status on the server
    axios
      .post(`http://localhost:5000/history/update-status/${id}`, {
        status: newStatus,
      })
      .then(() => {
        // Update the status in the state
        setHistory((prevHistory) =>
          prevHistory.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
      })
      .catch((error) => console.error("Error updating status:", error));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Visited":
        return "text-success"; // Green for Visited
      case "Not Visited":
        return "text-secondary"; // Gray for Not Visited
      case "Cancelled":
        return "text-danger"; // Red for Cancelled
      default:
        return ""; // Default class
    }
  };

  return (
    <div className='container'>
      <h1 className='text-center mb-4'>Appointment History</h1>
      <div className='table-responsive'>
        <table className='table table-striped table-bordered'>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item._id}>
                <td>{item.patientName}</td>
                <td>{item.doctorName}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td className={getStatusClass(item.status)}>{item.status}</td>
                <td>
                  <div className='btn-group' role='group'>
                    <button
                      onClick={() => handleStatusChange(item._id, "Visited")}
                      className='btn btn-success me-2'
                    >
                      Visited
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(item._id, "Not Visited")
                      }
                      className='btn btn-secondary me-2'
                    >
                      Not Visited
                    </button>
                    <button
                      onClick={() => handleStatusChange(item._id, "Cancelled")}
                      className='btn btn-danger'
                    >
                      Cancelled
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;
