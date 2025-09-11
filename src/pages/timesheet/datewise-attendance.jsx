import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const DatewiseAttendance = () => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [employees, setEmployees] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    useEffect(() => {
        axios.get('http://localhost:3000/employee')
            .then(res => setEmployees(res.data))
            .catch(err => console.error(err));
    }, []);

    const fetchAttendance = () => {

        if (!fromDate || !toDate || !employeeId) {
            alert("Please select from date, to date, and employee");
            return;
        }


        axios.get('http://localhost:3000/attendance/datewise', {
            params: {
                emp_id: employeeId,
                startDate: fromDate,
                endDate: toDate
            }
        })
            .then(res => setAttendanceData(res.data))
            .catch(err => console.error(err));
    };

    const columns = [
        { name: 'Status', selector: row => row.attendance_status },
        {
            name: 'Date', selector: row => new Date(row.attendance_date).toLocaleDateString()
        },
        { name: 'Clock IN', selector: row => row.attendance_clock_in },
        { name: 'Clock Out', selector: row => row.attendance_clock_out },
        { name: 'Late', selector: row => row.attendance_late || '00:00' },
        { name: 'Early Leaving', selector: row => row.attendance_early_leaving || '00:00' },
        { name: 'Overtime', selector: row => row.attendance_overtime || '00:00' },
        { name: 'Total Work', selector: row => row.attendance_total_work || '00:00' },
        { name: 'Total Rest', selector: row => row.attendance_total_rest || '00:00' },
    ];

    const customStyles = {
        headCells: { style: { backgroundColor: '#2b528c', color: 'white', fontSize: '14px' } },
    };

    const conditionalRowStyles = [
        { when: (row, index) => index % 2 === 0, style: { backgroundColor: 'white' } },
        { when: (row, index) => index % 2 !== 0, style: { backgroundColor: '#f8f9fa' } },
    ];

    const totalEntries = attendanceData.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    const [paginated, setPaginated] = useState(attendanceData.slice(0, rowsPerPage));

    const paginate = (data, page) => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(data.slice(start, end));
        setCurrentPage(page);
    };

    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, attendanceData.length);
    useEffect(() => {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(attendanceData.slice(start, end));
    }, [attendanceData, currentPage, rowsPerPage]);

    return (
        <div className="custom-container">
            <h5>Date Wise Attendance</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Date Wise Attendance
            </p>

            <div className="card no-radius mb-3 col-md-7">
                <div className="card-header text-white new-emp-bg fw-bold">Select Date & Employee</div>
                <div className="card-body d-flex align-items-start gap-2">
                    <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                    <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                </div>
                <div className="card-body d-flex align-items-start gap-2">
                    <select
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="form-control"
                    >
                        <option value="" disabled>Select Employee</option>
                        {employees.map(emp => (
                            <option key={emp._id} value={emp._id}>
                                {emp.firstName} {emp.lastName}
                            </option>
                        ))}
                    </select>

                    <button className="btn btn-sm add-btn" onClick={fetchAttendance}>Get</button>
                </div>
            </div>

            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>Attendance</span>
                </div>
                <div className="px-3">
                    <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
                        <div className="d-flex align-items-center gap-2">
                            <label htmlFor="entriesSelect" className="mb-0 ms-4">Show</label>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span className="ms-1">entries</span>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={paginated}
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
                                    <input
                                        id="searchInput"
                                        type="text"
                                        className="form-control form-control-sm"
                                        onChange={() => { }}
                                    />
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
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={`btn btn-sm btn-outline-secondary prev-next me-1 ${currentPage === i + 1 ? 'active' : ''
                                }`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        className="btn btn-sm btn-outline-secondary px-3 prev-next"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DatewiseAttendance;
