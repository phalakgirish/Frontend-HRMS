import React, { useState, useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
import './employees.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getAwards, createAwards, updateAwards, deleteAwards, createAward, updateAward } from '../../api/awardsApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Awards = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const editorRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setForm(prev => ({ ...prev, awardPhoto: file }));

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        if (file) reader.readAsDataURL(file);
    };



    //from backend
    const [awards, setAwards] = useState([]);
    // const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        employeeId: '',
        employeeName: '',
        awardName: '',
        gift: '',
        cashPrice: '',
        monthYear: '',
        awardPhoto: null,
        description: '',
        date: '',
        awardInfo: ''
    });

    const [errors, setErrors] = useState({});
    const validateForm = () => {
        let newErrors = {};
        const requiredFields = [
            "employeeId",
            "employeeName",
            "awardName",
            "gift",
            "cashPrice",
            "monthYear",
            "description",
            "date",
            "awardInfo"
        ];

        requiredFields.forEach((field) => {
            if (!form[field] || form[field].toString().trim() === "") {
                newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    useEffect(() => {
        fetchAwards();
    }, []);

    const fetchAwards = async () => {
        try {
            const response = await getAwards();
            setAwards(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching Awards:', error);
        }
    };


    const validateField = (fieldName, value = "") => {
        let error = "";

        let displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString().trim();

        switch (fieldName) {
            case "employeeId":
                displayName = "Employee Id";
                if (!value) {
                    error = `${displayName} is required`;
                } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                    error = `${displayName} must not contain special characters`;
                }
                break;

            case "employeeName":
            case "awardName":
            case "gift":
            case "date":
            case "monthYear":
            case "awardPhoto":
            case "description":
            case "awardInfo":
                if (!value) error = `${displayName} is required`;
                break;

            case "cashPrice":
                if (!value) {
                    error = `${displayName} is required`;
                } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    error = `${displayName} must be a valid number`;
                }
                break;

            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return error;
    };

    // const handleSubmit = async (e) => {

    //     e.preventDefault();
    //     if (validateForm()) {

    //         try {
    //             if (editId) {
    //                 await updateAwards(editId, form);
    //                 toast.success("Awards updated successfully!");

    //             } else {
    //                 await createAwards(form);
    //                 toast.success("Awards saved successfully!");

    //             }
    //             setForm(selectedRow);

    //             setForm({
    //                 employeeId: '',
    //                 employeeName: '',
    //                 awardName: '',
    //                 gift: '',
    //                 cashPrice: '',
    //                 monthYear: '',
    //                 awardPhoto: null,
    //                 description: '',
    //                 awardInfo: '',
    //                 date: ''
    //             });
    //             setEditId("");
    //             setSelectedRow(null);
    //             setShowEditModal(false);

    //             fetchAwards();
    //         } catch (err) {
    //             console.error("Error saving Awards:", err);
    //             toast.error("Awards failed to save!");

    //         }
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const payload = new FormData();
            for (let key in form) {
                if (form[key] !== null && form[key] !== undefined) {
                    payload.append(key, form[key]);
                }
            }

            if (editId) {
                await updateAward(editId, payload);
                toast.success("Awards updated successfully!");
            } else {
                await createAward(payload);
                toast.success("Awards saved successfully!");
            }

            resetForm();
            fetchAwards();

        } catch (err) {
            console.error("Error saving Awards:", err.response || err);
            toast.error("Awards failed to save!");
        }
    };

    useEffect(() => {
        if (selectedRow) {
            setForm({
                ...selectedRow,
                cashPrice: selectedRow.cashPrice !== undefined && selectedRow.cashPrice !== null
                    ? String(selectedRow.cashPrice)
                    : '',
                date: selectedRow.date || ''
            });
        }
    }, [selectedRow]);

    const emptyForm = {
        employeeId: '',
        employeeName: '',
        awardName: '',
        gift: '',
        cashPrice: '',
        monthYear: '',
        awardPhoto: null,
        description: '',
        date: '',
        awardInfo: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };

    const handleEdit = (row) => {
        setForm({
            employeeId: row.employeeId,
            employeeName: row.employeeName,
            awardName: row.awardName,
            gift: row.gift,
            cashPrice: row.cashPrice,
            monthYear: row.monthYear,
            awardPhoto: row.awardPhoto,
            description: row.description,
            awardInfo: row.awardInfo,
            date: row.date
        });
        setPreview(null);
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Awards?");
        if (!confirmDelete) return;
        try {
            await deleteAwards(id);
            fetchAwards();
        } catch (err) {
            console.error("Error deleting Awards:", err);
        }
    };

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };


    const columns = [
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleView(row)}
                    >
                        <i className="fas fa-eye"></i>
                    </button>
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
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        { name: 'Employee ID', selector: row => row.employeeId, sortable: true },
        { name: 'Employee Name', selector: row => row.employeeName },
        { name: 'Award Name', selector: row => row.awardName },
        { name: 'Gift', selector: row => row.gift },
        { name: 'Cash Price', selector: row => row.cashPrice },
        { name: 'Month Year', selector: row => row.monthYear },
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#2b528c',
                color: 'white',
                fontSize: '14px',
            },
        },
    };

    const conditionalRowStyles = [
        {
            when: (row, index) => index % 2 === 0,
            style: {
                backgroundColor: 'white',
            },
        },
        {
            when: (row, index) => index % 2 !== 0,
            style: {
                backgroundColor: '#f8f9fa',
            },
        },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const totalEntries = awards.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
     const [paginated, setPaginated] = useState(awards.slice(0, rowsPerPage));
   
       const paginate = (data, page) => {
           const start = (page - 1) * rowsPerPage;
           const end = start + rowsPerPage;
           setPaginated(data.slice(start, end));
           setCurrentPage(page);
       };
   
       const startEntry = (currentPage - 1) * rowsPerPage + 1;
       const endEntry = Math.min(currentPage * rowsPerPage, awards.length);
       useEffect(() => {
           const start = (currentPage - 1) * rowsPerPage;
           const end = start + rowsPerPage;
           setPaginated(awards.slice(start, end));
       }, [awards, currentPage, rowsPerPage]);

    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

    return (
        <div className="custom-container">
            <h5>Awards</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Awards
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Award</span>
                        <button className="btn btn-sm add-btn" onClick={toggleAddForm}>
                            - Hide
                        </button>
                    </div>

                    <div className="container mt-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* Left Column */}
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label>Employee Id</label>
                                        <input type="text" value={form.employeeId}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, employeeId: value });
                                                validateField("employeeId", value);
                                            }}
                                            className={`form-control ${errors.employeeId ? "is-invalid" : ""}`}
                                            placeholder="Employee Id"
                                            onBlur={(e) => validateField("employeeId", e.target.value)}

                                        />
                                        {errors.employeeId && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.employeeId}</p>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label>Employee</label>
                                        <select id="resignEmployee" value={form.employeeName}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, employeeName: value });
                                                validateField("employeeName", value);
                                            }}
                                            className={`form-control ${errors.employeeName ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("employeeName", e.target.value)}
                                        >
                                            <option value="">Select Name</option>
                                            <option value="Admin">Admin Admin</option>
                                            <option value="Anjali Patle">Anjali Patle</option>
                                            <option value="Amit Kumar">Amit Kumar</option>
                                            <option value="Aniket Rane">Aniket Rane</option>
                                            <option value="Shubham Kadam">Shubham Kadam</option>
                                            <option value="Abhijieet Tawate">Abhijieet Tawate</option>
                                            <option value="Pravin Bildlan">Pravin Bildlan</option>
                                            <option value="Amit Pednekar">Amit Pednekar</option>
                                            <option value="Mahendra Chaudhary">Mahendra Chaudhary</option>
                                            <option value="Hamsa Dhwjaa">Hamsa Dhwjaa</option>
                                            <option value="Manoj Kumar Sinha">Manoj Kumar Sinha</option>
                                        </select>
                                        {errors.employeeName && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.employeeName}</p>
                                        )}
                                    </div>


                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Award Type</label>
                                            <select id="awardType" value={form.awardName}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, awardName: value });
                                                    validateField("awardName", value);
                                                }}
                                                className={`form-control ${errors.awardName ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("awardName", e.target.value)}
                                            >
                                                <option value="">Award Type</option>
                                                <option value="Performer of the year">Performer of the year</option>
                                                <option value="Most Consistent Employee">Most Consistent Employee</option>
                                                <option value="Employee of the Month">Employee of the Month</option>
                                                <option value="Employee of the Year">Employee of the Year</option>
                                                <option value="Hard Worker Award">Hard Worker Award</option>
                                                <option value="Certificate of Excellence">Certificate of Excellence</option>
                                                <option value="Certificate of Project Completion">Certificate of Project Completion</option>
                                                <option value="Outstanding Leadership">Outstanding Leadership</option>
                                            </select>
                                            {errors.awardName && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.awardName}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Date</label>
                                            <input type="date" value={form.date}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, date: value });
                                                    validateField("date", value);
                                                }}
                                                className={`form-control ${errors.date ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("date", e.target.value)}

                                            />
                                            {errors.date && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.date}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label>Month & Year</label>
                                        <input type="date" value={form.monthYear}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, monthYear: value });
                                                validateField("monthYear", value);
                                            }}
                                            className={`form-control ${errors.monthYear ? "is-invalid" : ""}`}
                                            placeholder="Month & Year"
                                            onBlur={(e) => validateField("monthYear", e.target.value)}
                                        />
                                        {errors.monthYear && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.monthYear}</p>
                                        )}
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Gift</label>
                                            <input type="text" value={form.gift}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, gift: value });
                                                    validateField("gift", value);
                                                }}
                                                className={`form-control ${errors.gift ? "is-invalid" : ""}`}
                                                placeholder="Gift"
                                                onBlur={(e) => validateField("gift", e.target.value)}

                                            />
                                            {errors.gift && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.gift}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Cash</label>
                                            <input type="number" value={form.cashPrice}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, cashPrice: value });
                                                    validateField("cashPrice", value);
                                                }}
                                                className={`form-control ${errors.cashPrice ? "is-invalid" : ""}`}
                                                placeholder="Cash"
                                                onBlur={(e) => validateField("cashPrice", e.target.value)}

                                            />
                                            {errors.cashPrice && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.cashPrice}</p>
                                            )}
                                        </div>
                                    </div>

                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">

                                    <label>Description</label>
                                    <CKEditor
                                        key={editorKey}
                                        editor={ClassicEditor}
                                        data={form.description}
                                        onReady={(editor) => {
                                            editorRef.current = editor;
                                        }}
                                        onChange={(event, editor) => {
                                            const newData = editor.getData();
                                            setForm(prev => ({ ...prev, description: newData }));
                                        }}
                                    />
                                    {errors.description && (
                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                            {errors.description}
                                        </p>
                                    )}

                                    <div className="col-md-12 mb-3 mt-2">
                                        <label>Award Photo</label>
                                        <input type="file" onChange={handleFileChange} className="form-control" placeholder="Title" />
                                        <label style={{ fontSize: '12px' }}>Upload files only: gif,png,jpg,jpeg</label>
                                    </div>

                                    {preview && (
                                        <div className="mt-2">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                style={{ maxWidth: '100px', borderRadius: '5px', border: '1px solid #ccc' }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="awardInfo">Award Information</label>
                                    <textarea
                                        id="awardInfo"
                                        rows="3"
                                        value={form.awardInfo || ""}
                                        onChange={(e) => {
                                            const { value } = e.target;
                                            setForm({ ...form, awardInfo: value });
                                            validateField("awardInfo", value);
                                        }}
                                        className={`form-control mb-2 ${errors.awardInfo ? "is-invalid" : ""}`}
                                        placeholder="Award Information"
                                        onBlur={(e) => validateField("awardInfo", e.target.value)}

                                    />
                                    {errors.awardInfo && (
                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.awardInfo}</p>
                                    )}
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
                    <span>List All Awards</span>
                    <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add New'}</button>
                </div>


               <div className="px-3">
                                <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
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
                                    <h5 className="modal-title">View Awards</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Employee:</strong> {selectedRow.employeeName}</p>
                                    <p><strong>Award Type:</strong> {selectedRow.awardName}</p>
                                    <p><strong>Date:</strong> {selectedRow.monthYear}</p>
                                    <p><strong>Gift:</strong> {selectedRow.gift}</p>
                                    <p><strong>Cash Price:</strong> {selectedRow.cashPrice}</p>

                                    <p><strong>Award Photo:</strong></p>
                                    {selectedRow.awardPhoto ? (
                                        <img
                                            src={`http://localhost:3000${selectedRow.awardPhoto}`}
                                            alt="Award"
                                            style={{ maxWidth: '200px', height: '150px', borderRadius: '5px' }}
                                        />

                                    ) : (
                                        <p>No photo uploaded</p>
                                    )}


                                    {/* <p><strong>Award Information:</strong> {selectedRow.awardInfo}</p> */}
                                    {/* <p><strong>Description:</strong> {selectedRow.description}</p> */}

                                    <p className='mt-2'>
                                        <strong>Award Information:</strong> {(selectedRow?.awardInfo || '').replace(/<[^>]+>/g, '')}
                                    </p>

                                    <p>
                                        <strong>Description:</strong> {(selectedRow?.description || '').replace(/<[^>]+>/g, '')}
                                    </p>


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
                                        <h5 className="modal-title">Edit Award</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Employee Id</label>
                                                        <input type="text" value={form.employeeId}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, employeeId: value });
                                                                validateField("employeeId", value);
                                                            }}
                                                            className={`form-control ${errors.employeeId ? "is-invalid" : ""}`}
                                                            placeholder="Employee Id"
                                                            onBlur={(e) => validateField("employeeId", e.target.value)}

                                                        />
                                                        {errors.employeeId && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.employeeId}</p>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Employee</label>
                                                        <select id="resignEmployee" value={form.employeeName}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, employeeName: value });
                                                                validateField("employeeName", value);
                                                            }}
                                                            className={`form-control ${errors.employeeName ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("employeeName", e.target.value)}
                                                        >
                                                            <option value="">Select Name</option>
                                                            <option value="Admin">Admin Admin</option>
                                                            <option value="Anjali Patle">Anjali Patle</option>
                                                            <option value="Amit Kumar">Amit Kumar</option>
                                                            <option value="Aniket Rane">Aniket Rane</option>
                                                            <option value="Shubham Kadam">Shubham Kadam</option>
                                                            <option value="Abhijieet Tawate">Abhijieet Tawate</option>
                                                            <option value="Pravin Bildlan">Pravin Bildlan</option>
                                                            <option value="Amit Pednekar">Amit Pednekar</option>
                                                            <option value="Mahendra Chaudhary">Mahendra Chaudhary</option>
                                                            <option value="Hamsa Dhwjaa">Hamsa Dhwjaa</option>
                                                            <option value="Manoj Kumar Sinha">Manoj Kumar Sinha</option>
                                                        </select>
                                                        {errors.employeeName && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.employeeName}</p>
                                                        )}
                                                    </div>


                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Award Type</label>
                                                            <select id="awardType" value={form.awardName}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, awardName: value });
                                                                    validateField("awardName", value);
                                                                }}
                                                                className={`form-control ${errors.awardName ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("awardName", e.target.value)}
                                                            >
                                                                <option value="">Award Type</option>
                                                                <option value="Performer of the year">Performer of the year</option>
                                                                <option value="Most Consistent Employee">Most Consistent Employee</option>
                                                                <option value="Employee of the Month">Employee of the Month</option>
                                                                <option value="Employee of the Year">Employee of the Year</option>
                                                                <option value="Hard Worker Award">Hard Worker Award</option>
                                                                <option value="Certificate of Excellence">Certificate of Excellence</option>
                                                                <option value="Certificate of Project Completion">Certificate of Project Completion</option>
                                                                <option value="Outstanding Leadership">Outstanding Leadership</option>
                                                            </select>
                                                            {errors.awardName && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.awardName}</p>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Date</label>
                                                            <input type="date" value={form.date}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, date: value });
                                                                    validateField("date", value);
                                                                }}
                                                                className={`form-control ${errors.date ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("date", e.target.value)}

                                                            />
                                                            {errors.date && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.date}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Month & Year</label>
                                                        <input type="date" value={form.monthYear}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, monthYear: value });
                                                                validateField("monthYear", value);
                                                            }}
                                                            className={`form-control ${errors.monthYear ? "is-invalid" : ""}`}
                                                            placeholder="Month & Year"
                                                            onBlur={(e) => validateField("monthYear", e.target.value)}
                                                        />
                                                        {errors.monthYear && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.monthYear}</p>
                                                        )}
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Gift</label>
                                                            <input type="text" value={form.gift}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, gift: value });
                                                                    validateField("gift", value);
                                                                }}
                                                                className={`form-control ${errors.gift ? "is-invalid" : ""}`}
                                                                placeholder="Gift"
                                                                onBlur={(e) => validateField("gift", e.target.value)}

                                                            />
                                                            {errors.gift && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.gift}</p>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Cash</label>
                                                            <input type="number" value={form.cashPrice}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, cashPrice: value });
                                                                    validateField("cashPrice", value);
                                                                }}
                                                                className={`form-control ${errors.cashPrice ? "is-invalid" : ""}`}
                                                                placeholder="cashPrice"
                                                                onBlur={(e) => validateField("cashPrice", e.target.value)}

                                                            />
                                                            {errors.cashPrice && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.cashPrice}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">

                                                    <label>Description</label>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={form.description || ""}
                                                        onChange={(event, editor) => {
                                                            const newData = editor.getData();
                                                            setForm({ ...form, description: newData });
                                                        }}
                                                        onBlur={() => validateField("description", form.description)}
                                                    />
                                                    {errors.description && (
                                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                            {errors.description}
                                                        </p>
                                                    )}

                                                    <div className="col-md-12 mb-3 mt-2">
                                                        <label>Award Photo</label>
                                                        <input type="file" onChange={handleFileChange} className="form-control" placeholder="Title" />
                                                        <label style={{ fontSize: '12px' }}>Upload files only: gif,png,jpg,jpeg</label>
                                                    </div>

                                                    {preview && (
                                                        <div className="mt-2">
                                                            <img
                                                                src={preview}
                                                                alt="Preview"
                                                                style={{ maxWidth: '100px', borderRadius: '5px', border: '1px solid #ccc' }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label htmlFor="awardInfo">Award Information</label>
                                                    <textarea
                                                        id="awardInfo"
                                                        rows="3"
                                                        value={form.awardInfo || ""}
                                                        onChange={(e) => {
                                                            const { value } = e.target;
                                                            setForm({ ...form, awardInfo: value });
                                                            validateField("awardInfo", value);
                                                        }}
                                                        className={`form-control mb-2 ${errors.awardInfo ? "is-invalid" : ""}`}
                                                        placeholder="Award Information"
                                                        onBlur={(e) => validateField("awardInfo", e.target.value)}

                                                    />
                                                    {errors.awardInfo && (
                                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.awardInfo}</p>
                                                    )}
                                                </div>


                                            </div>

                                            <div className="text-end">
                                                <button type="button" className="btn btn-sm btn-light me-2" onClick={() => { resetForm(); setShowEditModal(false) }}>Close</button>
                                                <button type="submit" onClick={(e) => handleSubmit(e)} className="btn btn-sm add-btn">Update</button>
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

export default Awards;
