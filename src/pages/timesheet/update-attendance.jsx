import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    createUpdateAttendance,
    updateUpdateAttendance,
    deleteUpdateAttendance,
} from '../../api/updateAttendanceApi';
import axios from 'axios';

const UpdateAttendance = () => {
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [editId, setEditId] = useState(null);
    const [employeeId, setEmployeeId] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [attendance, setAttendance] = useState('')
    const [form, setForm] = useState({
        date: '',
        employee: '',
        attendance_clock_in: '',
        attendance_clock_out: '',
        attendance_total_work: '',
        attendance_late: '',
        attendance_early_leaving: '',
        attendance_overtime: '',
        attendance_total_rest: '',
        attendance_status: '',
        attendance_reason: ''
    });

    const [errors, setErrors] = useState({});
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:3000/employee')
            .then((res) => setEmployees(res.data || []))
            .catch((err) => console.error(err));
    }, []);

    const calcTotalWork = (inTime, outTime) => {
        if (!inTime || !outTime) return '';
        const [ih, im] = inTime.split(':').map(Number);
        const [oh, om] = outTime.split(':').map(Number);
        let total = (oh + om / 60) - (ih + im / 60);
        if (Number.isNaN(total)) return '';
        if (total < 0) total += 24;
        return total.toFixed(2);
    };

    const fetchAttendance = () => {
        if (!selectedDate || !employeeId) {
            alert('Please select date and employee');
            return;
        }

        axios
            .get('http://localhost:3000/attendance/datewise', {
                params: {
                    emp_id: employeeId,
                    startDate: selectedDate,
                    endDate: selectedDate,
                },
            })
            .then((res) => {
                setAttendanceData(res.data || []);
                setCurrentPage(1); setForm({
                    date: '',
                    employee: '',
                    attendance_clock_in: '',
                    attendance_clock_out: '',
                    attendance_total_work: '',
                    attendance_late: '',
                    attendance_early_leaving: '',
                    attendance_overtime: '',
                    attendance_total_rest: '',
                    attendance_status: 'Present',
                    attendance_reason: '',
                });

                setShowEditModal(false);
                setShowViewModal(false);
                setEditId(null);
                setSelectedRow(null);
            })
            .catch((err) => {
                console.error(err);
                setAttendanceData([]);
            });
    };

    const resetForm = () => {
        setSelectedDate('');
        setEmployeeId('');
        setAttendanceData([]);
        setCurrentPage(1);
    };

    const totalEntries = attendanceData.length;
    const totalPages = Math.max(1, Math.ceil(totalEntries / rowsPerPage));
    const paginatedData = attendanceData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);

    const customStyles = {
        headCells: { style: { backgroundColor: '#2b528c', color: 'white', fontSize: '14px' } },
    };

    const conditionalRowStyles = [
        { when: (_, i) => i % 2 === 0, style: { backgroundColor: 'white' } },
        { when: (_, i) => i % 2 !== 0, style: { backgroundColor: '#f8f9fa' } },
    ];

    const validateField = (field, value = '') => {
        let error = '';
        if (!String(value || '').trim()) error = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        setErrors((prev) => ({ ...prev, [field]: error }));
        return !error;
    };

    const validateForm = () => {
        const validDate = validateField('date', form.date);
        const validEmployee = validateField('employee', form.employee);
        return validDate && validEmployee;
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (!validateForm()) return;

    //     try {
    //         const totalWork = form.attendance_total_work || calcTotalWork(form.attendance_clock_in, form.attendance_clock_out) || 0;

    //         const payload = {
    //             attendance_clock_in: form.attendance_clock_in,
    //             attendance_clock_out: form.attendance_clock_out,
    //             attendance_status: form.attendance_status,
    //             attendance_reason: form.attendance_reason || '',
    //             attendance_total_work: Number(totalWork),
    //             attendance_late: Number(form.attendance_late) || 0,
    //             attendance_early_leaving: Number(form.attendance_early_leaving) || 0,
    //             attendance_overtime: Number(form.attendance_overtime) || 0,
    //             attendance_total_rest: Number(form.attendance_total_rest) || 0
    //         };

    //         if (editId) {
    //             await updateUpdateAttendance(editId, payload);
    //             toast.success('Attendance updated successfully!');
    //         } else {
    //             const createPayload = {
    //                 ...payload,
    //                 employee_id: form.employee,
    //                 attendance_date: form.date
    //             };
    //             await createUpdateAttendance(createPayload);
    //             toast.success('Attendance added successfully!');
    //         }

    //         fetchAttendance();
    //         setShowEditModal(false);
    //         setEditId(null);
    //         setSelectedRow(null);

    //         setForm({
    //             date: '',
    //             employee: '',
    //             attendance_clock_in: '',
    //             attendance_clock_out: '',
    //             attendance_total_work: '',
    //             attendance_late: '',
    //             attendance_early_leaving: '',
    //             attendance_overtime: '',
    //             attendance_total_rest: '',
    //             attendance_status: 'Present',
    //             attendance_reason: ''
    //         });
    //     } catch (err) {
    //         console.error('Attendance save error:', err);
    //         toast.error('Failed to save attendance!');
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (!form.attendance_clock_in || !form.attendance_clock_out) {
                toast.error('Clock In and Clock Out times are required');
                return;
            }

            const [inH, inM] = form.attendance_clock_in.split(':').map(Number);
            const [outH, outM] = form.attendance_clock_out.split(':').map(Number);
            const clockInMin = inH * 60 + inM;
            const clockOutMin = outH * 60 + outM;

            const officeStart = 9 * 60;
            const officeEnd = 18 * 60;

            const attendanceLate = Math.max(clockInMin - officeStart, 0);
            const attendanceEarlyLeaving = Math.max(officeEnd - clockOutMin, 0);
            const totalWorkMin = clockOutMin - clockInMin;
            const attendanceOvertime = totalWorkMin > 480 ? (totalWorkMin - 480) / 60 : 0;
            const attendanceTotalRest = Math.max(480 - totalWorkMin, 0) / 60;

            const payload = {
                attendance_clock_in: form.attendance_clock_in,
                attendance_clock_out: form.attendance_clock_out,
                attendance_status: form.attendance_status,
                attendance_reason: form.attendance_reason || '',
                attendance_total_work: (totalWorkMin / 60).toFixed(2),
                attendance_late: attendanceLate.toFixed(2),
                attendance_early_leaving: attendanceEarlyLeaving.toFixed(2),
                attendance_overtime: attendanceOvertime.toFixed(2),
                attendance_total_rest: attendanceTotalRest.toFixed(2),
            };

            if (editId) {
                await updateUpdateAttendance(editId, payload);
                toast.success('Attendance updated successfully!');
            } else {
                const createPayload = {
                    ...payload,
                    employee_id: form.employee,
                    attendance_date: form.date
                };
                await createUpdateAttendance(createPayload);
                toast.success('Attendance added successfully!');
            }

            fetchAttendance();
            setShowEditModal(false);
            setEditId(null);
            setSelectedRow(null);

            setForm({
                date: '',
                employee: '',
                attendance_clock_in: '',
                attendance_clock_out: '',
                attendance_total_work: '',
                attendance_late: '',
                attendance_early_leaving: '',
                attendance_overtime: '',
                attendance_total_rest: '',
                attendance_status: 'Present',
                attendance_reason: ''
            });

        } catch (err) {
            console.error('Attendance save error:', err);
            toast.error('Failed to save attendance!');
        }
    };


    //   const handleDelete = async (id) => {
    //   if (!window.confirm('Are you sure you want to delete this record?')) return;

    //   try {
    //     await deleteUpdateAttendance(id);
    //     toast.success('Deleted successfully!');
    //     fetchAttendance();
    //   } catch (err) {
    //     console.error(err);
    //     toast.error('Failed to delete record!');
    //   }
    // };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;

        try {
            await deleteUpdateAttendance(id);
            toast.success('Deleted successfully!');

            fetchAttendance();
            resetForm();
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete record!');
        }
    };


    const handleView = (row) => {
        setSelectedRow(row);
        setShowViewModal(true);
    };

    const handleEdit = (row) => {
        console.log("Row in handleEdit:", row);

        setSelectedRow(row);
        const empId = row.employee_id
            ? typeof row.employee_id === 'string'
                ? row.employee_id
                : row.employee_id._id || row.employee_id.id || ''
            : '';

        const dateStr = row.attendance_date
            ? (typeof row.attendance_date === 'string'
                ? row.attendance_date.split('T')[0]
                : new Date(row.attendance_date).toISOString().split('T')[0])
            : '';

        setForm({
            date: dateStr,
            employee: empId,
            attendance_clock_in: row.attendance_clock_in || '',
            attendance_clock_out: row.attendance_clock_out || '',
            attendance_total_work: row.attendance_total_work || calcTotalWork(row.attendance_clock_in, row.attendance_clock_out) || '',
            attendance_late: row.attendance_late || '',
            attendance_early_leaving: row.attendance_early_leaving || '',
            attendance_overtime: row.attendance_overtime || '',
            attendance_total_rest: row.attendance_total_rest || '',
            attendance_status: row.attendance_status || 'Present',
            attendance_reason: row.attendance_reason || '',
        });



        setEditId(row._id || row.id || '');
        setShowEditModal(true);
    };

    const columns = [
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleView(row)}>
                        <i className="fas fa-eye"></i>
                    </button>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                        <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row._id || row.id)}>
                        <i className="fas fa-trash-alt text-white"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        { name: 'In Time', selector: (r) => r.attendance_clock_in || '00:00' },
        { name: 'Out Time', selector: (r) => r.attendance_clock_out || '00:00' },
        { name: 'Total Work', selector: (r) => r.attendance_total_work || '0' },
        { name: 'Reason', selector: (r) => r.attendance_reason || '-' },
    ];

    const onChangeClockIn = (val) => {
        setForm((prev) => {
            const next = { ...prev, attendance_clock_in: val };
            next.attendance_total_work = calcTotalWork(next.attendance_clock_in, next.attendance_clock_out);
            return next;
        });
    };
    const onChangeClockOut = (val) => {
        setForm((prev) => {
            const next = { ...prev, attendance_clock_out: val };
            next.attendance_total_work = calcTotalWork(next.attendance_clock_in, next.attendance_clock_out);
            return next;
        });
    };

    return (
        <div className="custom-container">
            <h5>Update Attendance</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>+
                
                <span style={{ color: 'red' }}>Home</span> / Update Attendance
            </p>

            <div className="row g-4">
                <div className="col-12 col-lg-4">
                    <div className="card no-radius h-100">
                        <div className="card-header text-white new-emp-bg">Update Attendance</div>

                        <div className="p-3">
                            <div className="mb-3">
                                <label>Date</label>
                                <input type="date" className="form-control" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label>Employee</label>
                                <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="form-control">
                                    <option value="">Select Employee</option>
                                    {employees.map((emp) => (
                                        <option key={emp._id} value={emp._id}>
                                            {emp.firstName} {emp.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="text-start mb-2">
                                <button type="button" className="btn btn-sm add-btn" onClick={fetchAttendance}>
                                    Get
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-8">
                    <div className="card no-radius">
                        <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                            <span>List all Updated Attendance</span>
                        </div>

                        <div className="px-3 mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <label htmlFor="entriesSelect" className="mb-0 ms-4">Show</label>
                                    <select id="entriesSelect" className="form-select form-select-sm w-auto" value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
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
                            />
                        </div>

                        <div className="p-3">
                            <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
                                Showing {startEntry} to {endEntry} of {totalEntries} entries
                            </p>
                        </div>

                        <div className="d-flex justify-content-end align-items-center p-3">
                            <button className="btn btn-sm btn-outline-secondary px-3 prev-next me-1" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} className={`btn btn-sm btn-outline-secondary prev-next me-1 ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                            ))}

                            <button className="btn btn-sm btn-outline-secondary px-3 prev-next" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
                        </div>
                    </div>
                </div>
            </div>

            {showViewModal && selectedRow && (
                <div className="modal show fade d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">View Attendance</h5>
                                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Employee:</strong> {selectedRow.employee_id?.firstName || selectedRow.employee_id}</p>
                                <p><strong>Date:</strong> {new Date(selectedRow.attendance_date).toLocaleDateString()}</p>
                                <p><strong>Clock In:</strong> {selectedRow.attendance_clock_in || '00:00'}</p>
                                <p><strong>Clock Out:</strong> {selectedRow.attendance_clock_out || '00:00'}</p>
                                <p><strong>Status:</strong> {selectedRow.attendance_status}</p>
                                <p><strong>Reason:</strong> {selectedRow.attendance_reason}</p>

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && selectedRow && (
                <div className="modal show fade d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Attendance</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditId(null);
                                        setSelectedRow(null);
                                        setForm({
                                            date: '',
                                            employee: '',
                                            attendance_clock_in: '',
                                            attendance_clock_out: '',
                                            attendance_total_work: '',
                                            attendance_reason: '',
                                            attendance_status: 'Present',
                                        });
                                    }}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label>Date</label>
                                        <input type="date" className="form-control" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                                    </div>

                                    <div className="mb-3">
                                        <label>Employee</label>
                                        <select className="form-control" value={form.employee || ''} onChange={(e) => setForm({ ...form, employee: e.target.value })}>
                                            <option value="">Select Employee</option>
                                            {employees.map((emp) => <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>)}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label>In Time</label>
                                        <input type="time" className="form-control" value={form.attendance_clock_in || ''} onChange={(e) => onChangeClockIn(e.target.value)} />
                                    </div>

                                    <div className="mb-3">
                                        <label>Out Time</label>
                                        <input type="time" className="form-control" value={form.attendance_clock_out || ''} onChange={(e) => onChangeClockOut(e.target.value)} />
                                    </div>

                                    <div className="mb-3">
                                        <label>Total Work (hours)</label>
                                        <input type="text" className="form-control" value={form.attendance_total_work || ''} onChange={(e) => setForm({ ...form, attendance_total_work: e.target.value })} />
                                    </div>

                                    <div className="mb-3">
                                        <label>Reason</label>
                                        <input type="text" className="form-control" value={form.attendance_reason || ''} onChange={(e) => setForm({ ...form, attendance_reason: e.target.value })} />
                                    </div>

                                    <div className="mb-3">
                                        <label>Status</label>
                                        <select className="form-control" value={form.attendance_status || 'Present'} onChange={(e) => setForm({ ...form, attendance_status: e.target.value })}>
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                            <option value="Leave">Leave</option>
                                        </select>
                                    </div>

                                    <button type="submit" className="btn btn-sm add-btn">Update</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateAttendance;
