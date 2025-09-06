import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    getUpdateAttendance,
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

    const [updateAttendance, setUpdateAttendance] = useState([]);
    const [paginated, setPaginated] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [form, setForm] = useState({
        date: '',
        employee: '',
        attendance_clock_in: '',
        attendance_clock_out: '',
        attendance_status: 'Present',
    });
    const [errors, setErrors] = useState({});
    const [employees, setEmployees] = useState([]);

    // Fetch employees
    useEffect(() => {
        axios
            .get('http://localhost:3000/employee')
            .then((res) => setEmployees(res.data))
            .catch((err) => console.error(err));
    }, []);

    // Fetch attendance
    useEffect(() => {
        fetchUpdateAttendance();
    }, []);

    const fetchUpdateAttendance = async () => {
        try {
            const res = await getUpdateAttendance();
                console.log('Attendance data:', res.data); // <--- check here

            setUpdateAttendance(res.data);
            paginate(res.data, 1);
        } catch (err) {
            console.error(err);
        }
    };

    // Pagination
    const paginate = (data, page) => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(data.slice(start, end));
        setCurrentPage(page);
    };

    const totalEntries = updateAttendance.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);

    // Validation
    const validateField = (field, value = '') => {
        let error = '';
        if (!value.trim()) error = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        setErrors((prev) => ({ ...prev, [field]: error }));
        return !error;
    };

    const validateForm = () => {
        const validDate = validateField('date', form.date);
        const validEmployee = validateField('employee', form.employee);
        return validDate && validEmployee;
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const payload = {
                employee_id: form.employee,
                attendance_date: form.date,
                attendance_clock_in: form.attendance_clock_in,
                attendance_clock_out: form.attendance_clock_out,
                attendance_status: form.attendance_status,
            };

            if (editId) {
                await updateUpdateAttendance(editId, payload);
                toast.success('Attendance updated successfully!');
            } else {
                await createUpdateAttendance(payload);
                toast.success('Attendance added successfully!');
            }

            setShowEditModal(false);
            fetchUpdateAttendance();
            setEditId(null);
            setForm({
                date: '',
                employee: '',
                attendance_clock_in: '',
                attendance_clock_out: '',
                attendance_status: 'Present',
            });
        } catch (err) {
            console.error(err);
            toast.error('Failed to save attendance!');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            await deleteUpdateAttendance(id);
            fetchUpdateAttendance();
            toast.success('Deleted successfully!');
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
  setForm({
    date: row.attendance_date?.split('T')[0] || '',
    employee: row.employee_id?._id || '',
    attendance_clock_in: row.attendance_clock_in || '',
    attendance_clock_out: row.attendance_clock_out || '',
    attendance_late: row.attendance_late || '',
    attendance_early_leaving: row.attendance_early_leaving || '',
    attendance_overtime: row.attendance_overtime || '',
    attendance_total_work: row.attendance_total_work || '',
    attendance_total_rest: row.attendance_total_rest || '',
    attendance_status: row.attendance_status || 'Present',
  });
  setEditId(row._id);
  setShowEditModal(true);
};

    const columns = [
  {
    name: 'Action',
    cell: (row) => (
      <div className="d-flex gap-1">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
          <i className="fas fa-edit"></i>
        </button>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => handleView(row)}>
          <i className="fas fa-eye"></i>
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row._id)}>
          <i className="fas fa-trash-alt text-white"></i>
        </button>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
  { name: 'Date', selector: row => row.attendance_date ? new Date(row.attendance_date).toLocaleDateString() : '-' },
  { name: 'Employee', selector: row => row.employee_id ? `${row.employee_id.firstName} ${row.employee_id.lastName}` : '-' },
  { name: 'Clock In', selector: row => row.attendance_clock_in || '00:00' },
  { name: 'Clock Out', selector: row => row.attendance_clock_out || '00:00' },
  { name: 'Late', selector: row => row.attendance_late || '00:00' },
  { name: 'Early Leaving', selector: row => row.attendance_early_leaving || '00:00' },
  { name: 'Overtime', selector: row => row.attendance_overtime || '0' },
  { name: 'Total Work', selector: row => row.attendance_total_work || '0' },
  { name: 'Total Rest', selector: row => row.attendance_total_rest || '0' },
  { name: 'Status', selector: row => row.attendance_status || '-' },
];

    const customStyles = {
        headCells: { style: { backgroundColor: '#2b528c', color: 'white', fontSize: '14px' } },
    };

    const conditionalRowStyles = [
        { when: (_, index) => index % 2 === 0, style: { backgroundColor: 'white' } },
        { when: (_, index) => index % 2 !== 0, style: { backgroundColor: '#f8f9fa' } },
    ];

    return (
        <div className="custom-container">
            <ToastContainer />
            <h5>Update Attendance</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Update Attendance
            </p>

            <div className="row g-4">
                {/* Form */}
                <div className="col-12 col-lg-4">
                    <div className="card no-radius h-100">
                        <div className="card-header text-white new-emp-bg">Update Attendance</div>
                        <form className="p-3" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>Date</label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                    value={form.date}
                                    onChange={(e) => {
                                        setForm({ ...form, date: e.target.value });
                                        validateField('date', e.target.value);
                                    }}
                                />
                                {errors.date && <p className="text-danger">{errors.date}</p>}
                            </div>

                            <div className="mb-3">
                                <label>Employee</label>
                                <select
                                    className={`form-control ${errors.employee ? 'is-invalid' : ''}`}
                                    value={form.employee}
                                    onChange={(e) => {
                                        setForm({ ...form, employee: e.target.value });
                                        validateField('employee', e.target.value);
                                    }}
                                >
                                    <option value="">Choose an Employee...</option>
                                    {employees.map((emp) => (
                                        <option key={emp._id} value={emp._id}>
                                            {emp.firstName} {emp.lastName}
                                        </option>
                                    ))}
                                </select>
                                {errors.employee && <p className="text-danger">{errors.employee}</p>}
                            </div>

                            <div className="mb-3">
                                <label>Clock In</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={form.attendance_clock_in || ''}
                                    onChange={(e) => setForm({ ...form, attendance_clock_in: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Clock Out</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={form.attendance_clock_out || ''}
                                    onChange={(e) => setForm({ ...form, attendance_clock_out: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Status</label>
                                <select
                                    className="form-control"
                                    value={form.attendance_status || 'Present'}
                                    onChange={(e) => setForm({ ...form, attendance_status: e.target.value })}
                                >
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Leave">Leave</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-sm add-btn">
                                {editId ? 'Update' : 'Save'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Table */}
                <div className="col-12 col-lg-8">
                    <div className="card no-radius h-100">
                        <div className="card-header text-white new-emp-bg">List All Attendance</div>
                        <div className="px-3 mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <label htmlFor="entriesSelect">Show</label>
                                    <select
                                        id="entriesSelect"
                                        className="form-select form-select-sm w-auto"
                                        value={rowsPerPage}
                                        onChange={(e) => {
                                            setRowsPerPage(Number(e.target.value));
                                            paginate(updateAttendance, 1);
                                        }}
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={30}>30</option>
                                    </select>
                                    <span>entries</span>
                                </div>
                                <div style={{ fontSize: '14px' }}>
                                    Showing {startEntry} to {endEntry} of {totalEntries} entries
                                </div>
                            </div>

                            <DataTable
                                columns={columns}
                                data={paginated}
                                customStyles={customStyles}
                                conditionalRowStyles={conditionalRowStyles}
                                pagination={false}
                                highlightOnHover
                                pointerOnHover
                            />

                            <div className="d-flex justify-content-end gap-2 mt-3">
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    disabled={currentPage === 1}
                                    onClick={() => paginate(updateAttendance, currentPage - 1)}
                                >
                                    Previous
                                </button>
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => paginate(updateAttendance, currentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Modal */}
            {showViewModal && selectedRow && (
                <div className="modal show fade d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">View Attendance</h5>
                                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    <strong>Employee:</strong> {selectedRow.employee_id?.firstName}{' '}
                                    {selectedRow.employee_id?.lastName}
                                </p>
                                <p>
                                    <strong>Date:</strong> {new Date(selectedRow.attendance_date).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Clock In:</strong> {selectedRow.attendance_clock_in || '00:00'}
                                </p>
                                <p>
                                    <strong>Clock Out:</strong> {selectedRow.attendance_clock_out || '00:00'}
                                </p>
                                <p>
                                    <strong>Status:</strong> {selectedRow.attendance_status}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal is same as form on left side */}
            {/* Edit Modal */}
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
                                        setForm({ date: '', employee: '', attendance_clock_in: '', attendance_clock_out: '', attendance_status: 'Present' });
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSubmit(e); // Calls your existing submit logic
                                    }}
                                >
                                    <div className="mb-3">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={form.date}
                                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label>Employee</label>
                                        <select
                                            className="form-control"
                                            value={form.employee}
                                            onChange={(e) => setForm({ ...form, employee: e.target.value })}
                                        >
                                            <option value="">Select Employee</option>
                                            {employees.map((emp) => (
                                                <option key={emp._id} value={emp._id}>
                                                    {emp.firstName} {emp.lastName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label>Clock In</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            value={form.attendance_clock_in || ''}
                                            onChange={(e) => setForm({ ...form, attendance_clock_in: e.target.value })}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label>Clock Out</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            value={form.attendance_clock_out || ''}
                                            onChange={(e) => setForm({ ...form, attendance_clock_out: e.target.value })}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label>Status</label>
                                        <select
                                            className="form-control"
                                            value={form.attendance_status}
                                            onChange={(e) => setForm({ ...form, attendance_status: e.target.value })}
                                        >
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                            <option value="Leave">Leave</option>
                                        </select>
                                    </div>

                                    <button type="submit" className="btn btn-sm add-btn">
                                        Update
                                    </button>
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
