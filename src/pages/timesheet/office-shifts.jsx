import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getOfficeShifts, createOfficeShifts, updateOfficeShifts, deleteOfficeShifts } from '../../api/officeShiftsApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const OfficeShifts = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);

    const [OfficeShifts, setOfficeShifts] = useState([]);
    // const [paginated, setPaginated] = useState([]);


    const [form, setForm] = useState({
        shiftName: "",
        days: {
            Monday: { inTime: "", outTime: "" },
            Tuesday: { inTime: "", outTime: "" },
            Wednesday: { inTime: "", outTime: "" },
            Thursday: { inTime: "", outTime: "" },
            Friday: { inTime: "", outTime: "" },
            Saturday: { inTime: "", outTime: "" },
            Sunday: { inTime: "", outTime: "" },
        },
    });


    const formatTime12Hour = (time24) => {
        if (!time24) return "";
        let [hour, min] = time24.split(":").map(Number);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${min.toString().padStart(2, "0")} ${ampm}`;
    };


    useEffect(() => {
        fetcOfficeShifts();
    }, []);

    const fetcOfficeShifts = async () => {
        try {
            const response = await getOfficeShifts();
            setOfficeShifts(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching OfficeShifts:', error);
        }
    };

    const [errors, setErrors] = useState({});
    const validateForm = () => {
        let newErrors = {};

        Object.keys(form).forEach((field) => {
            if (!form[field] || form[field].toString().trim() === "") {
                newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        let displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString();

        switch (fieldName) {
            case "shiftName":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return error;
    };

    const emptyForm = {
        shiftName: "",
        days: {
            Monday: { inTime: "", outTime: "" },
            Tuesday: { inTime: "", outTime: "" },
            Wednesday: { inTime: "", outTime: "" },
            Thursday: { inTime: "", outTime: "" },
            Friday: { inTime: "", outTime: "" },
            Saturday: { inTime: "", outTime: "" },
            Sunday: { inTime: "", outTime: "" },
        },
    };


    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form", form);

        if (validateForm()) {
            try {
                // Convert days object to array
                const payload = {
                    shiftName: form.shiftName,
                    days: Object.entries(form.days).map(([day, times]) => ({
                        day,
                        inTime: times.inTime,
                        outTime: times.outTime,
                    })),
                };

                console.log("Final Payload to API:", payload);

                if (editId) {
                    await updateOfficeShifts(editId, payload); // <-- send payload
                    toast.success("Office Shifts updated successfully!");
                    setEditId(null);
                } else {
                    await createOfficeShifts(payload); // <-- send payload
                    toast.success("Office Shifts saved successfully!");
                }

                fetcOfficeShifts();
                setForm(emptyForm);
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving OfficeShifts:", err);
                toast.error("Office Shifts failed to save!");
            }
        }
    };

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };


    const handleEdit = (row) => {
        // ensure days is an array
        const daysArray = Array.isArray(row.days) ? row.days : [];

        const getDayTimes = (dayName) => {
            const dayObj = daysArray.find(
                (d) => d.day.toLowerCase() === dayName.toLowerCase()
            );
            return {
                inTime: dayObj?.inTime || "",
                outTime: dayObj?.outTime || "",
            };
        };

        setEditId(row._id);
        setForm({
            shiftName: row.shiftName || "",
            days: {
                Monday: getDayTimes("Monday"),
                Tuesday: getDayTimes("Tuesday"),
                Wednesday: getDayTimes("Wednesday"),
                Thursday: getDayTimes("Thursday"),
                Friday: getDayTimes("Friday"),
                Saturday: getDayTimes("Saturday"),
                Sunday: getDayTimes("Sunday"),
            },
        });

        setSelectedRow(row);
        setShowEditModal(true);
    };






    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this OfficeShifts?");
        if (!confirmDelete) return;
        try {
            await deleteOfficeShifts(id);
            fetcOfficeShifts();
        } catch (err) {
            console.error("Error deleting OfficeShifts:", err);
        }
    };




    const columns = [
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleEdit(row)}
                    >
                        <i className="fas fa-edit"></i>
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(row._id)}
                    >
                        <i className="fas fa-trash-alt text-white"></i>
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                        <i className="fas fa-clock"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            wrap: true,
        },
        { name: 'Day', selector: row => row.shiftName, wrap: true },
        {
            name: 'Monday',
            selector: row => {
                const day = row.days.find(d => d.day === "Monday");
                return day ? `${formatTime12Hour(day.inTime)} to ${formatTime12Hour(day.outTime)}` : "";
            },
            wrap: true
        },
        {
            name: 'Tuesday',
            selector: row => {
                const day = row.days.find(d => d.day === "Tuesday");
                return day ? `${formatTime12Hour(day.inTime)} to ${formatTime12Hour(day.outTime)}` : "";
            },
            wrap: true
        },
        {
            name: 'Wednesday',
            selector: row => {
                const day = row.days.find(d => d.day === "Wednesday");
                return day ? `${formatTime12Hour(day.inTime)} to ${formatTime12Hour(day.outTime)}` : "";
            },
            wrap: true
        },
        {
            name: 'Thursday',
            selector: row => {
                const day = row.days.find(d => d.day === "Thursday");
                return day ? `${formatTime12Hour(day.inTime)} to ${formatTime12Hour(day.outTime)}` : "";
            },
            wrap: true
        },
        {
            name: 'Friday',
            selector: row => {
                const day = row.days.find(d => d.day === "Friday");
                return day ? `${formatTime12Hour(day.inTime)} to ${formatTime12Hour(day.outTime)}` : "";
            },
            wrap: true
        },
        {
            name: 'Saturday',
            selector: row => {
                const day = row.days.find(d => d.day === "Saturday");
                return day ? `${formatTime12Hour(day.inTime)} to ${formatTime12Hour(day.outTime)}` : "";
            },
            wrap: true
        },
        {
            name: 'Sunday',
            selector: row => {
                const day = row.days.find(d => d.day === "Sunday");
                return day ? `${formatTime12Hour(day.inTime)} to ${formatTime12Hour(day.outTime)}` : "";
            },
            wrap: true
        },
    ];


    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#2b528c',
                color: 'white',
                fontSize: '15px',
            },
        },
        cells: {
            style: {
                fontSize: '15px',
                whiteSpace: 'normal',
                wordBreak: 'break-word'
            },
        },
        rows: {
            style: {
                minHeight: '60px',
                paddingTop: '10px',
                paddingBottom: '10px',
            },
        },
    };

    const conditionalRowStyles = [
        {
            when: (row, index) => index % 2 === 0,
            style: {
                backgroundColor: 'white',
                minHeight: '70px',
                paddingTop: '12px',
                paddingBottom: '12px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
            },
        },
        {
            when: (row, index) => index % 2 !== 0,
            style: {
                backgroundColor: '#f8f9fa',
                minHeight: '70px',
                paddingTop: '10px',
                paddingBottom: '10px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
            },
        },
    ];

    // const data = [
    //     {
    //         action: '-',
    //         day: 'Morning Shift',
    //         monday: '10:00 am to 06:30 am',
    //         tuesday: '10:00 am to 06:30 am',
    //         wednesday: '10:00 am to 06:30 am',
    //         thursday: '10:00 am to 06:30 am',
    //         friday: '10:00 am to 06:30 am',
    //         saturday: '10:00 am to 02:30 am',
    //         sunday: '-'
    //     },
    //     {
    //         action: '-',
    //         day: 'Morning Shift',
    //         monday: '10:00 am to 06:30 am',
    //         tuesday: '10:00 am to 06:30 am',
    //         wednesday: '10:00 am to 06:30 am',
    //         thursday: '10:00 am to 06:30 am',
    //         friday: '10:00 am to 06:30 am',
    //         saturday: '10:00 am to 02:30 am',
    //         sunday: '-'
    //     }, {
    //         action: '-',
    //         day: 'Morning Shift',
    //         monday: '10:00 am to 06:30 am',
    //         tuesday: '10:00 am to 06:30 am',
    //         wednesday: '10:00 am to 06:30 am',
    //         thursday: '10:00 am to 06:30 am',
    //         friday: '10:00 am to 06:30 am',
    //         saturday: '10:00 am to 02:30 am',
    //         sunday: '-'
    //     },
    // ];

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const totalEntries = OfficeShifts.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    const [paginated, setPaginated] = useState(OfficeShifts.slice(0, rowsPerPage));
  
      const paginate = (data, page) => {
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;
          setPaginated(data.slice(start, end));
          setCurrentPage(page);
      };
  
      const startEntry = (currentPage - 1) * rowsPerPage + 1;
      const endEntry = Math.min(currentPage * rowsPerPage, OfficeShifts.length);
      useEffect(() => {
          const start = (currentPage - 1) * rowsPerPage;
          const end = start + rowsPerPage;
          setPaginated(OfficeShifts.slice(start, end));
      }, [OfficeShifts, currentPage, rowsPerPage]);

    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const [shiftTimes, setShiftTimes] = useState(
        days.reduce((acc, day) => {
            acc[day] = { inTime: "", outTime: "" };
            return acc;
        }, {})
    );


    const handleChange = (day, field, value) => {
        setShiftTimes((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value,
            },
        }));
    };


    const clearDay = (day) => {
        setShiftTimes((prev) => ({
            ...prev,
            [day]: { inTime: "", outTime: "" },
        }));
    };



    return (
        <div className="custom-container">
            <h5>Office Shift</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Office Shift
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Office Shift</span>
                        <button className="btn btn-sm add-btn" onClick={toggleAddForm}>
                            - Hide
                        </button>
                    </div>

                    <div className="container mt-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* Left Column */}
                                <div className="col-md-12">
                                    <div className="row mb-3 ms-1">
                                        <div className="col-md-7">
                                            <label className="form-label">Shift Name</label>
                                            <input type="text" value={form.shiftName}
                                                placeholder='Enter Shift Name'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, shiftName: value });
                                                    validateField("shiftName", value);
                                                }}
                                                className={`form-control ${errors.shiftName ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("shiftName", e.target.value)}

                                            />
                                            {errors.shiftName && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Shift Name is required!</p>)}

                                        </div>
                                    </div>

                                    <div className="container">

                                        {Object.keys(form.days).map((day) => (
                                            <div className="row mb-3 align-items-end ms-1" key={day}>
                                                <div className="col-md-2">
                                                    <label className="form-label">{day}</label>
                                                </div>

                                                <div className="col-md-3">
                                                    <label className="form-label small">In Time</label>
                                                    <input
                                                        type="time"
                                                        className="form-control"
                                                        value={form.days[day].inTime}
                                                        onChange={(e) =>
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                days: {
                                                                    ...prev.days,
                                                                    [day]: { ...prev.days[day], inTime: e.target.value },
                                                                },
                                                            }))
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label className="form-label small">Out Time</label>
                                                    <input
                                                        type="time"
                                                        className="form-control"
                                                        value={form.days[day].outTime}
                                                        onChange={(e) =>
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                days: {
                                                                    ...prev.days,
                                                                    [day]: { ...prev.days[day], outTime: e.target.value },
                                                                },
                                                            }))
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm add-btn mt-4"
                                                        onClick={() =>
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                days: { ...prev.days, [day]: { inTime: "", outTime: "" } },
                                                            }))
                                                        }
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>

                            </div>

                            <div className="text-start mb-2">
                                <button type="submit" className="btn btn-sm add-btn">Save</button>
                            </div>
                        </form>

                    </div>

                </div>
            )}



            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List Office Shifts</span>
                    <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add New'}</button>
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

                {showModal && selectedRow && (
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">View Office Shift</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Location Name:</strong> {selectedRow.locationName}</p>
                                    <p><strong>Company:</strong> {selectedRow.company}</p>
                                    <p><strong>Location Head:</strong> {selectedRow.locationHead}</p>
                                    <p><strong>City:</strong> {selectedRow.city}</p>
                                    <p><strong>Country:</strong> {selectedRow.country}</p>
                                    <p><strong>Added By:</strong> {selectedRow.addedBy}</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showEditModal && selectedRow && (
                    <>

                        <div className="custom-backdrop"></div>
                        <div className="modal show fade d-block" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered edit-modal">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Office Shift</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-12">
                                                    <div className="row mb-3 ms-1">
                                                        <div className="col-md-7">
                                                            <label className="form-label">Shift Name</label>
                                                            <input type="text" value={form.shiftName}
                                                                placeholder='Enter Shift Name'
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, shiftName: value });
                                                                    validateField("shiftName", value);
                                                                }}
                                                                className={`form-control ${errors.shiftName ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("shiftName", e.target.value)}

                                                            />
                                                            {errors.shiftName && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Shift Name is required!</p>)}

                                                        </div>
                                                    </div>

                                                    <div className="container">

                                                        {Object.keys(form.days).map((day) => (
                                                            <div className="row mb-3 align-items-end ms-1" key={day}>
                                                                <div className="col-md-2">
                                                                    <label className="form-label">{day}</label>
                                                                </div>

                                                                <div className="col-md-3">
                                                                    <label className="form-label small">In Time</label>
                                                                    <input
                                                                        type="time"
                                                                        className="form-control"
                                                                        value={form.days[day].inTime}
                                                                        onChange={(e) =>
                                                                            setForm((prev) => ({
                                                                                ...prev,
                                                                                days: {
                                                                                    ...prev.days,
                                                                                    [day]: { ...prev.days[day], inTime: e.target.value },
                                                                                },
                                                                            }))
                                                                        }
                                                                    />
                                                                </div>

                                                                <div className="col-md-3">
                                                                    <label className="form-label small">Out Time</label>
                                                                    <input
                                                                        type="time"
                                                                        className="form-control"
                                                                        value={form.days[day].outTime}
                                                                        onChange={(e) =>
                                                                            setForm((prev) => ({
                                                                                ...prev,
                                                                                days: {
                                                                                    ...prev.days,
                                                                                    [day]: { ...prev.days[day], outTime: e.target.value },
                                                                                },
                                                                            }))
                                                                        }
                                                                    />
                                                                </div>

                                                                <div className="col-md-2">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm add-btn mt-4"
                                                                        onClick={() =>
                                                                            setForm((prev) => ({
                                                                                ...prev,
                                                                                days: { ...prev.days, [day]: { inTime: "", outTime: "" } },
                                                                            }))
                                                                        }
                                                                    >
                                                                        Clear
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}

                                                    </div>
                                                </div>

                                            </div>

                                            <div className="text-end">
                                                <button type="button" className="btn btn-sm btn-light me-2" onClick={() => setShowEditModal(false)}>Close</button>
                                                <button type="submit" className="btn btn-sm add-btn">Update</button>
                                            </div>
                                        </form>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}


            </div>
        </div>
    );
};

export default OfficeShifts;
