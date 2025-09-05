import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(false);
 const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const columns = [
        { name: 'Status', selector: row => row.attendance_status || '-', sortable: true },
        { name: 'Employee', selector: row => row.employee_name || row.employee_id || '-', sortable: true },
        { name: 'Clock IN', selector: row => row.attendance_clock_in || '-' },
        { name: 'Clock Out', selector: row => row.attendance_clock_out || '-' },
        { name: 'Late', selector: row => row.attendance_late || '00:00' },
        { name: 'Early Leaving', selector: row => row.attendance_early_leaving || '00:00' },
        { name: 'Overtime', selector: row => row.attendance_overtime || '00:00' },
        { name: 'Total Work', selector: row => row.attendance_total_work || '00:00' },
        { name: 'Total Rest', selector: row => row.attendance_total_rest || '00:00' },
    ];

    const fetchAttendance = async () => {
        if (!selectedDate) return alert('Please select a date');

        setLoading(true);
        try {
            const res = await axios.get('http://localhost:3000/attendance', {
                params: { attendance_date: selectedDate }
            });
            setAttendanceData(res.data);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error fetching attendance');
        }
        setLoading(false);
    };

  const totalEntries = attendanceData.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    const paginatedData = attendanceData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const customStyles = {
        headCells: { style: { backgroundColor: '#2b528c', color: 'white', fontSize: '14px' } },
    };

    const conditionalRowStyles = [
        { when: (row, index) => index % 2 === 0, style: { backgroundColor: 'white' } },
        { when: (row, index) => index % 2 !== 0, style: { backgroundColor: '#f8f9fa' } },
    ];

    return (
        <div className="custom-container">
            <h5>Attendance</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Attendance
            </p>

            <div className="card no-radius mb-3 col-md-5">
                <div className="card-header text-white new-emp-bg fw-bold">Set Date</div>
                <div className="card-body d-flex align-items-start">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <button
                        className="btn btn-sm add-btn ms-4"
                        onClick={fetchAttendance}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Get'}
                    </button>
                </div>
            </div>

            <div className="card no-radius">
                           <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                               <span>Attendance</span>
                           </div>
                           <div className="px-3 mt-4">
                               <div className="d-flex justify-content-between align-items-center mb-2">
                                   <div className="d-flex align-items-center gap-2">
                                       <label htmlFor="entriesSelect" className="mb-0 ms-4">Show</label>
                                       <select
                                           id="entriesSelect"
                                           className="form-select form-select-sm w-auto"
                                           value={rowsPerPage}
                                           onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                       >
                                           <option value="10">10</option>
                                           <option value="25">25</option>
                                           <option value="50">50</option>
                                           <option value="100">100</option>
                                       </select>
                                       <span className="ms-1">entries</span>
                                   </div>
                               </div>
           
                               <DataTable
                                   columns={columns}
                                   data={paginatedData}
                                   fixedHeader
                                   highlightOnHover
                                   customStyles={customStyles}
                                   conditionalRowStyles={conditionalRowStyles}
                                   responsive
                                   subHeader
                                   subHeaderAlign="right"
                                   subHeaderComponent={
                                       <div className="d-flex flex-wrap justify-content-between align-items-center w-100 gap-2">
                                           <div className="d-flex flex-wrap gap-2">
                                               <button className="btn btn-sm btn-outline-dark">Copy</button>
                                               <button className="btn btn-sm btn-outline-dark">CSV</button>
                                               <button className="btn btn-sm btn-outline-dark">PDF</button>
                                               <button className="btn btn-sm btn-outline-dark">Print</button>
                                           </div>
                                           <div className="d-flex align-items-center gap-2">
                                               <label htmlFor="searchInput" className="mb-0">Search:</label>
                                               <input id="searchInput" type="text" className="form-control form-control-sm" onChange={() => { }} />
                                           </div>
                                       </div>
                                   }
                               />
                           </div>
           
                           <div className="p-3">
                               <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
                                   Showing {startEntry} to {endEntry} of {totalEntries} entries
                               </p>
                           </div>
           
                           <div className="d-flex justify-content-end align-items-center p-3">
                               <button
                                   className="btn btn-sm btn-outline-secondary px-3 prev-next me-1"
                                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                   disabled={currentPage === 1}
                               >Prev</button>
           
                               {[...Array(totalPages)].map((_, i) => (
                                   <button
                                       key={i}
                                       className={`btn btn-sm btn-outline-secondary prev-next me-1 ${currentPage === i + 1 ? 'active' : ''}`}
                                       onClick={() => setCurrentPage(i + 1)}
                                   >{i + 1}</button>
                               ))}
           
                               <button
                                   className="btn btn-sm btn-outline-secondary px-3 prev-next"
                                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                   disabled={currentPage === totalPages}
                               >Next</button>
                           </div>
                       </div>
        </div>
    );
};

export default Attendance;
