import React, { useState } from 'react';
import './timesheet.css';

const ImportAttendance = () => {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setReport([]);
  };

  // Handle CSV import
  const handleImport = async () => {
    if (!file) {
      alert('Please select a CSV file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/attendance/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setReport(data);
      } else {
        alert(data.message || 'Import failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error while importing attendance.');
    }
  };

  return (
    <div className="custom-container">
      <h5>Import Attendance</h5>
      <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
        <span style={{ color: 'red' }}>Home</span> / Import Attendance
      </p>

      <div className="card no-radius">
        <div className="card-header text-dark">Import CSV File Only</div>
        <div className="card-body d-flex align-items-start">
          <div style={{ color: 'grey', fontSize: '14px' }}>
            <p>The first line in downloaded CSV file should remain as it is. Do not change the column order.</p>
            <p>Correct order: Employee ID, Attendance Date, Clock In Time, Clock Out Time.</p>
          </div>
        </div>

        <div className="text-start ms-4">
          <a href="/sample-csv-attendance.csv" download className="btn btn-sm down-btn mb-2">
            <i className="fas fa-download me-1"></i> Download Sample File
          </a>
        </div>

        <div className="cont">
          <p>Upload File</p>
          <input
            type="file"
            accept=".csv, application/vnd.ms-excel"
            onChange={handleFileChange}
            className="btn btn-sm add-btn mb-2"
          />
          <p style={{ fontSize: '10px' }}>Allowed file size 500 KB</p>
          <button type="button" className="btn btn-sm add-btn" onClick={handleImport}>
            Import
          </button>
        </div>

        {/* Display import report */}
        {report.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h6>Import Report</h6>
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {report.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{row.employee_id}</td>
                    <td>{row.attendance_date}</td>
                    <td>{row.attendance_status || 'Present'}</td>
                    <td>{row.msg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportAttendance;
