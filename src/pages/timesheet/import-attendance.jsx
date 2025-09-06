import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './timesheet.css';
// import Papa from 'papaparse';

const ImportAttendance = () => {
  const [file, setFile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [report, setReport] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/employee')
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setReport([]);
  };

  const isValidDate = (dateStr) => /^\d{4}-\d{2}-\d{2}$/.test(dateStr);

  const isValidTime = (timeStr) => /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(timeStr);

  // const handleImport = () => {
  //   if (!file) return alert('Please select a CSV file.');
  //   if (!selectedEmployee) return alert('Please select an employee.');

  //   Papa.parse(file, {
  //     header: true,
  //     skipEmptyLines: true,
  //     complete: async (results) => {
  //       const dataToSend = [];
  //       const tempReport = [];

  //       results.data.forEach((row, index) => {
  //         const date = row['Attendance Date']?.trim();
  //         let clockIn = row['Clock In Time']?.trim() || '09:00';
  //         let clockOut = row['Clock Out Time']?.trim() || '18:00';
  //         const status = row['Status']?.trim() || 'Present';

  //         let msg = '';

  //         if (!date || !isValidDate(date)) {
  //           msg = 'Invalid or missing date';
  //         } else if (!isValidTime(clockIn)) {
  //           msg = 'Invalid clock in';
  //           clockIn = '09:00';
  //         } else if (!isValidTime(clockOut)) {
  //           msg = 'Invalid clock out';
  //           clockOut = '18:00';
  //         }

  //         const [inH, inM] = clockIn.split(':').map(Number);
  //         const [outH, outM] = clockOut.split(':').map(Number);
  //         const totalWork = (outH + outM / 60) - (inH + inM / 60);

  //         dataToSend.push({
  //           employee_id: selectedEmployee,
  //           attendance_date: date,
  //           attendance_clock_in: clockIn,
  //           attendance_clock_out: clockOut,
  //           attendance_status: status,
  //           attendance_total_work: totalWork.toFixed(2),
  //           attendance_overtime: totalWork > 8 ? (totalWork - 8).toFixed(2) : '0',
  //         });

  //         tempReport.push({
  //           row: index + 1,
  //           date,
  //           clockIn,
  //           clockOut,
  //           status,
  //           msg: msg || 'Ready to import',
  //         });
  //       });

  //       setReport(tempReport);

  //       const validData = dataToSend.filter(d => isValidDate(d.attendance_date));
  //       if (!validData.length) return alert('No valid rows to import');

  //       try {
  //         const res = await axios.post('http://localhost:3000/attendance/import', validData);
  //         alert('Import completed!');
  //         console.log(res.data);
  //       } catch (err) {
  //         console.error(err);
  //         alert('Import failed. Check console.');
  //       }
  //     }
  //   });
  // };

  return (
    <div className="custom-container">
      <h5>Import Attendance</h5>

      <div className="card no-radius">
        <div className="card-header text-dark">Import CSV File Only</div>
        <div className="card-body d-flex flex-column gap-2">

          <label>Select Employee</label>
          <select
            className="form-select form-select-sm w-auto mb-2"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">-- Choose Employee --</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="btn btn-sm add-btn mb-2"
          />
          {/* <button className="btn btn-sm add-btn" onClick={handleImport}>Import</button> */}
          <button className="btn btn-sm add-btn">Import</button>

          {report.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h6>Import Report</h6>
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Status</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {report.map(r => (
                    <tr key={r.row}>
                      <td>{r.row}</td>
                      <td>{r.date}</td>
                      <td>{r.clockIn}</td>
                      <td>{r.clockOut}</td>
                      <td>{r.status}</td>
                      <td>{r.msg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ImportAttendance;
