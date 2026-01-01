import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Salary() {
  const { emp_id } = useParams();
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (emp_id) {
      fetchSalaryDetails(emp_id);
    }
  }, [emp_id]);

  const fetchSalaryDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/salary/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSalaryDetails(data);
    } catch (error) {
      console.error("Error fetching salary details:", error);
      setMessage("Error fetching salary details.");
    }
  };

  if (!emp_id) {
    return <div>Please select an employee to view salary.</div>;
  }

  return (
    <div>
      <h2>Salary Details for Employee ID: {emp_id}</h2>
      {message && <p>{message}</p>}
      {salaryDetails ? (
        <div>
          <p>Basic Salary: {salaryDetails.basic}</p>
          <p>Absent Days: {salaryDetails.absent_days}</p>
          <p>Deduction: {salaryDetails.deduction}</p>
          <p>Final Salary: {salaryDetails.final_salary}</p>
        </div>
      ) : (
        <p>Loading salary details...</p>
      )}
    </div>
  );
}

export default Salary;
