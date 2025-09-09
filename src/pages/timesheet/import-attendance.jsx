import React, { useState } from 'react';
import './timesheet.css';
import Papa from "papaparse";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImportAttendance = () => {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setReport([]);
  };

  const handlePreview = () => {
    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const mapped = result.data.map((row) => ({
          employee_id: row["Employee ID"],
          attendance_date: row["Attendance Date"],
          attendance_clock_in: row["Clock In Time"],
          attendance_clock_out: row["Clock Out Time"],
          attendance_status: "Present", // default
        }));
        setReport(mapped);
      },
    });
  };

  const handleImport = () => {
    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const records = results.data.map(r => ({
          employee_id: r["Employee ID"],
          attendance_date: r["Attendance Date"],
          attendance_clock_in: r["Clock In Time"] || "09:00",
          attendance_clock_out: r["Clock Out Time"] || "18:00",
          attendance_reason: r["Attendance Reason"] || "",
        }));

        try {
          const res = await fetch("http://localhost:3000/attendance/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(records),
          });

          const data = await res.json();
          if (res.ok) {
            setReport(data.results || []);
            toast.success("Attendance imported successfully!");
          } else {
            toast.error(data.message || "Import failed.");
          }
          data.results.forEach(r => {
            if (r.msg && r.msg.includes("Duplicate")) {
              toast.warn(`Duplicate skipped: Employee ID ${r.employee_id}, Date ${r.attendance_date}`);
            }
          });
          setFile(null);
          setReport([]);
        } catch (err) {
          console.error(err);
          alert("Error while importing attendance.");
        }
      }
    });
  };


  return (
    <div className="custom-container">
      <h5>Import Attendance</h5>
      <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
        <span style={{ color: 'red' }}>Home</span> / Import Attendance
      </p>

      <div className="card no-radius">
        <div className="card-header text-dark">Import CSV File Only</div>

        <div className="cont">
          <p>Upload File</p>
          <input
            type="file"
            accept=".csv, application/vnd.ms-excel"
            onChange={handleFileChange}
            className="btn btn-sm add-btn mb-2"
          />
          <p style={{ fontSize: '10px' }}>Allowed file size 500 KB</p>

          <button type="button" className="btn btn-sm add-btn me-2" onClick={handlePreview}>
            Preview
          </button>
          <button type="button" className="btn btn-sm add-btn" onClick={handleImport}>
            Import
          </button>
        </div>

        {report.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h6>Import Preview</h6>
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee ID</th>
                  <th>Attendance Date</th>
                  <th>Clock In Time</th>
                  <th>Clock Out Time</th>
                </tr>
              </thead>
              <tbody>
                {report.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{row.employee_id}</td>
                    <td>{row.attendance_date}</td>
                    <td>{row.attendance_clock_in}</td>
                    <td>{row.attendance_clock_out}</td>
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
