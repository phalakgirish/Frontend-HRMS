import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './organization.css';
import { getLocation, createLocation, updateLocation, deleteLocation } from '../../api/locationApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Location = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editId, setEditId] = useState(null);

    //from backend
    const [Location, setLoction] = useState([]);
    // const [paginated, setPaginated] = useState([]);


    const [form, setForm] = useState({
        company: '',
        locationName: '',
        email: '',
        phone: '',
        faxNumber: '',
        locationHead: '',
        locationHrManager: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        bankBranch: '',
        bankName: '',
        bankCode: '',
        bankAccountNo: '',
        medical: '',
        pfEmployer: '',
        basiSalary: '',
        hra: '',
        lta: '',
        allowance: '',
        esc: '',
        gratuity: '',
        addedBy: '',
    });

    const [errors, setErrors] = useState({});
    // const validateForm = () => {
    //     let newErrors = {};

    //     Object.keys(form).forEach((field) => {
    //         if (!form[field] || form[field].toString().trim() === "") {
    //             newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
    //         }
    //     });

    //     if (!form.company) newErrors.company = "Company is required";
    //     if (!form.locationName.trim()) newErrors.locationName = "Location Name is required";
    //     if (!form.email) {
    //         newErrors.email = "Email is required";
    //     } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    //         newErrors.email = "Invalid email format";
    //     }

    //     if (!form.phone) {
    //         newErrors.phone = "Phone number is required";
    //     } else if (!/^\d{10}$/.test(form.phone)) {
    //         newErrors.phone = "Phone must be 10 digits";
    //     }

    //     if (form.bankAccountNo && !/^\d+$/.test(form.bankAccountNo)) {
    //         newErrors.bankAccountNo = "Account No must be numeric";
    //     }

    //     if (form.zipCode && !/^\d+$/.test(form.zipCode)) {
    //         newErrors.zipCode = "Zip Code must be numeric";
    //     }

    //     // Percentage fields validation
    //     ["medical", "basiSalary", "hra", "lta", "allowance", "esc", "gratuity"].forEach(field => {
    //         if (form[field] && (isNaN(form[field]) || form[field] < 0 || form[field] > 100)) {
    //             newErrors[field] = "Must be a number between 0 and 100";
    //         }
    //     });

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };


    const validateForm = () => {
        let valid = true;
        Object.keys(form).forEach((key) => {
            const error = validateField(key, form[key]);
            if (error) valid = false;
        });
        return valid;
    };

    const validateField = (fieldName, value = "") => {
        let error = "";
        const displayName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        value = value.toString();

        switch (fieldName) {
            case "company":
                if (!value.trim()) error = "Company Name is required";
                break;

            case "locationName":
                if (!value.trim()) {
                    error = "Location Name is required";
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    error = "Location must contain only letters";
                }
                break;

            case "addedBy": {
                if (!value || value.trim() === "") {
                    error = "Added By field is required";
                }
                break;
            }

            case "locationHead": {
                if (!value || value.trim() === "") {
                    error = "Location Head is required";
                }
                break;
            }

            case "locationHrManager": {
                if (!value || value.trim() === "") {
                    error = "Location HR Manager is required";
                }
                break;
            }

            case "address": {
                if (!value || value.trim() === "") {
                    error = "Address is required";
                }
                break;
            }

            case "city": {
                const displayName = "City";
                if (!value || value.trim() === "") {
                    error = `${displayName} is required`;
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                    error = `${displayName} must contain only letters`;
                }
                break;
            }

            case "state": {
                const displayName = "State";
                if (!value || value.trim() === "") {
                    error = `${displayName} is required`;
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                    error = `${displayName} must contain only letters`;
                }
                break;
            }

            case "country": {
                const displayName = "Country";
                if (!value || value.trim() === "") {
                    error = `${displayName} is required`;
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                    error = `${displayName} must contain only letters`;
                }
                break;
            }

            case "bankBranch":
                if (!value.trim()) {
                    error = "Bank Branch is required";
                } else if (!/^[a-zA-Z0-9\s\-\&]+$/.test(value)) {
                    error = "Bank Branch contains invalid characters";
                }
                break;

            case "bankName":
                if (!value.trim()) error = "Bank Name is required";
                break;

            case "bankCode":
                const displayBankCode = "Bank Code";
                if (!value.trim()) {
                    error = `${displayBankCode} is required`;
                } else if (!/^\d+$/.test(value)) {
                    error = `${displayBankCode} must be numeric`;
                } else if (value.length < 3 || value.length > 12) {
                    error = `${displayBankCode} must be between 3 and 12 digits`;
                }
                break;

            case "faxNumber":
                if (!value.trim()) {
                    error = "Fax Number is required";
                } else if (!/^\d+$/.test(value)) {
                    error = "Fax Number must be numeric";
                } else if (value.length < 6 || value.length > 15) {
                    error = "Fax Number must be between 6 and 15 digits";
                }
                break;

            case "phone":
                if (!value.trim()) error = "Phone number is required";
                else if (!/^\d+$/.test(value)) error = "Phone must be numeric";
                else if (value.length !== 10) error = "Phone must be exactly 10 digits";
                break;

            case "email":
                if (!value || !value.toString().trim()) {
                    error = "Email is required";
                } else {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(value)) {
                        error = "Invalid email format";
                    }
                }
                break;

            case "bankAccountNo":
                const displayBankAccNo = "Bank Account Number";
                if (!value.trim()) {
                    error = `${displayBankAccNo} is required`;
                } else if (!/^\d+$/.test(value)) {
                    error = `${displayBankAccNo} must be numeric`;
                } else if (value.length < 9 || value.length > 12) {
                    error = `${displayBankAccNo} must be between 9 and 18 digits`;
                }
                break;

            case "zipCode": {
                const displayName = "Zip Code";
                if (!value || value.trim() === "") {
                    error = `${displayName} is required`;
                } else if (!/^\d+$/.test(value)) {
                    error = `${displayName} must be numeric`;
                }
                break;
            }

            case "medical":

            case "basiSalary":
                if (!value.trim()) {
                    error = `Basic Salary is required`;
                }
                else if (!/^\d+$/.test(value)) {
                    error = `Basic Salary must be a number without alphabets or special characters`;
                }
                // else if (Number(value) < 0 || Number(value) > 99) {
                //     error = `Basic Salary must be between 0 and 99`;
                // }
                break;

            case "pfEmployer":
                if (!value.trim()) {
                    error = `PF Employer is required`;
                }
                else if (!/^\d+$/.test(value)) {
                    error = `PF Employer must be a number without alphabets or special characters`;
                }
                else if (Number(value) < 0 || Number(value) > 99) {
                    error = `PF Employer must be between 0 and 99`;
                }
                break;

            case "hra":
                if (!value.trim()) {
                    error = `HRA is required`;
                }
                else if (!/^\d+$/.test(value)) {
                    error = `HRA must be a number without alphabets or special characters`;
                }
                else if (Number(value) < 0 || Number(value) > 99) {
                    error = `HRA must be between 0 and 99`;
                }
                break;

            case "lta":
                if (!value.trim()) {
                    error = `LTA is required`;
                }
                else if (!/^\d+$/.test(value)) {
                    error = `LTA must be a number without alphabets or special characters`;
                }
                else if (Number(value) < 0 || Number(value) > 99) {
                    error = `LTA must be between 0 and 99`;
                }
                break;

            case "allowance":
                if (!value.trim()) {
                    error = `Conveyance Allowance is required`;
                }
                else if (!/^\d+$/.test(value)) {
                    error = `Conveyance Allowance must be a number without alphabets or special characters`;
                }
                else if (Number(value) < 0 || Number(value) > 99) {
                    error = `Conveyance Allowance must be between 0 and 99`;
                }
                break;

            case "esc":
                if (!value.trim()) {
                    error = `ESC is required`;
                }
                else if (!/^\d+$/.test(value)) {
                    error = `ESC must be a number without alphabets or special characters`;
                }
                else if (Number(value) < 0 || Number(value) > 99) {
                    error = `ESC must be between 0 and 99`;
                }
                break;

            case "gratuity":
                if (!value.trim()) {
                    error = `Gratuity is required`;
                }
                else if (!/^\d+$/.test(value)) {
                    error = `Gratuity must be a number without alphabets or special characters`;
                }
                else if (Number(value) < 0 || Number(value) > 99) {
                    error = `Gratuity must be between 0 and 99`;
                }
                break;


            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [fieldName]: error }));

        return error;
    };



    useEffect(() => {
        fetchLocation();
    }, []);

    const fetchLocation = async () => {
        try {
            const response = await getLocation();
            setLoction(response.data);
            // paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching Location:', error);
        }
    };

    const emptyForm = {
        company: '',
        locationName: '',
        email: '',
        phone: '',
        faxNumber: '',
        locationHead: '',
        locationHrManager: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        bankBranch: '',
        bankName: '',
        bankCode: '',
        bankAccountNo: '',
        medical: '',
        pfEmployer: '',
        basiSalary: '',
        hra: '',
        lta: '',
        allowance: '',
        esc: '',
        gratuity: '',
        addedBy: '',
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
        // Prepare payload: keep strings as-is, convert only numeric fields
        const payload = {
            ...form,
            zipCode: form.zipCode ? Number(form.zipCode) : undefined,
            basiSalary: form.basiSalary ? Number(form.basiSalary) : undefined,
            hra: form.hra ? Number(form.hra) : undefined,
            lta: form.lta ? Number(form.lta) : undefined,
            allowance: form.allowance ? Number(form.allowance) : undefined,
            esc: form.esc ? Number(form.esc) : undefined,
            gratuity: form.gratuity ? Number(form.gratuity) : undefined,
            medical: form.medical ? Number(form.medical) : undefined,
            pfEmployer: form.pfEmployer ? Number(form.pfEmployer) : undefined,
        };

        if (editId) {
            console.log("Updating ID:", editId, payload);
            await updateLocation(editId, payload);
            toast.success("Location updated successfully!");
            setEditId(null);
        } else {
            await createLocation(payload);
            toast.success("Location saved successfully!");
        }

        fetchLocation();

        // Reset form
        setForm({
            company: '',
            locationName: '',
            email: '',
            phone: '',
            faxNumber: '',
            locationHead: '',
            locationHrManager: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            bankBranch: '',
            bankName: '',
            bankCode: '',
            bankAccountNo: '',
            medical: '',
            pfEmployer: '',
            basiSalary: '',
            hra: '',
            lta: '',
            allowance: '',
            esc: '',
            gratuity: '',
            addedBy: '',
        });

        setShowEditModal(false);
    } catch (err) {
        console.error("Error saving Location:", err.response || err);
        toast.error("Failed to save location!");
    }
};


    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };


    const handleEdit = (row) => {
        setEditId(row._id);
        setForm({
            company: row.company || "",
            locationName: row.locationName || "",
            email: row.email || "",
            phone: row.phone || "",
            faxNumber: row.faxNumber || "",
            locationHead: row.locationHead || "",
            locationHrManager: row.locationHrManager || "",
            address: row.address || "",
            city: row.city || "",
            state: row.state || "",
            zipCode: row.zipCode || "",
            country: row.country || "",
            bankBranch: row.bankBranch || "",
            bankName: row.bankName || "",
            bankCode: row.bankCode || "",
            bankAccountNo: row.bankAccountNo || "",
            medical: row.medical || "",
            pfEmployer: row.pfEmployer || "",
            basiSalary: row.basiSalary || "",
            hra: row.hra || "",
            lta: row.lta || "",
            allowance: row.allowance || "",
            esc: row.esc || "",
            gratuity: row.gratuity || "",
            addedBy: row.addedBy || "",
        });
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Location?");
        if (!confirmDelete) return;
        try {
            await deleteLocation(id);
            fetchLocation();
        } catch (err) {
            console.error("Error deleting Location:", err);
        }
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
        { name: 'Location Name', selector: row => row.locationName, sortable: true },
        { name: 'Location Head', selector: row => row.locationHead },
        { name: 'Company', selector: row => row.company },
        { name: 'City', selector: row => row.city },
        { name: 'Country', selector: row => row.country },
        { name: 'Added By', selector: row => row.addedBy },
    ];

    // const data = [
    //     {
    //         action: '-',
    //         locationName: 'Head Office - Mumbai',
    //         locationHead: 'Manoj Kumar Sinha',
    //         company: 'UBI Services Ltd.',
    //         city: 'Mumbai',
    //         country: 'India',
    //         addedBy: 'Admin Admin'
    //     },
    //     {
    //         action: '-',
    //         locationName: 'Head Office - Bangalore',
    //         locationHead: 'Sanjay Gupta',
    //         company: 'UBI Services Ltd.',
    //         city: 'Bangalore',
    //         country: 'India',
    //         addedBy: 'Admin Admin'
    //     },
    //     // Add more records as needed
    // ];

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

    const totalEntries = Location.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    const [paginated, setPaginated] = useState(Location.slice(0, rowsPerPage));
   
       const paginate = (data, page) => {
           const start = (page - 1) * rowsPerPage;
           const end = start + rowsPerPage;
           setPaginated(data.slice(start, end));
           setCurrentPage(page);
       };
   
       const startEntry = (currentPage - 1) * rowsPerPage + 1;
       const endEntry = Math.min(currentPage * rowsPerPage, Location.length);
       useEffect(() => {
           const start = (currentPage - 1) * rowsPerPage;
           const end = start + rowsPerPage;
           setPaginated(Location.slice(start, end));
       }, [Location, currentPage, rowsPerPage]);

    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

    return (
        <div className="custom-container">
            <h5>Locations</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Locations
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Location</span>
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
                                        <div className="mb-3">
                                            <label>Company</label>
                                            <select
                                                id="company"
                                                value={form.company}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, company: value });
                                                    validateField("company", value);
                                                }}
                                                className={`form-control ${errors.company ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("company", e.target.value)}

                                            >
                                                <option value="">Company</option>
                                                <option value="UBI Services Ltd.">UBI Services Ltd.</option>
                                            </select>
                                            {errors.company && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.company}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label>Location Name</label>
                                        <input
                                            type="text"
                                            value={form.locationName}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, locationName: value });
                                                validateField("locationName", value);


                                            }}
                                            className={`form-control ${errors.locationName ? "is-invalid" : ""}`}
                                            placeholder="Location Name"
                                            onBlur={(e) => validateField("locationName", e.target.value)}

                                        />
                                        {errors.locationName && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.locationName}</p>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label>Email</label>
                                        <input type="email" value={form.email} onChange={(e) => {
                                            const { value } = e.target;
                                            setForm({ ...form, email: value });
                                            validateField("email", value);
                                        }}
                                            className="form-control" placeholder="Email"
                                            onBlur={(e) => validateField("email", e.target.value)}

                                        />
                                        {errors.email && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.email}</p>
                                        )}
                                    </div>


                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Phone</label>
                                            <input type="text" value={form.phone} onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, phone: value });
                                                validateField("phone", value);
                                            }}
                                                className="form-control" placeholder="Phone"
                                                onBlur={(e) => validateField("phone", e.target.value)}
                                            />
                                            {errors.phone && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.phone}</p>
                                            )}

                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Fax Number</label>
                                            <input
                                                type="text"
                                                value={form.faxNumber}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, faxNumber: value });
                                                    validateField("faxNumber", value);
                                                }}
                                                className={`form-control ${errors.faxNumber ? "is-invalid" : ""}`}
                                                placeholder="Fax Number"
                                                onBlur={(e) => validateField("faxNumber", e.target.value)}
                                            />
                                            {errors.faxNumber && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.faxNumber}</p>
                                            )}
                                        </div>

                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Bank Branch</label>
                                            <input
                                                type="text"
                                                value={form.bankBranch}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, bankBranch: value });
                                                    validateField("bankBranch", value);
                                                }}
                                                className={`form-control ${errors.bankBranch ? "is-invalid" : ""}`}
                                                placeholder="Bank Branch"
                                                onBlur={(e) => validateField("bankBranch", e.target.value)}
                                            />
                                            {errors.bankBranch && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.bankBranch}</p>
                                            )}
                                        </div>


                                        <div className="col-md-6 mb-3">
                                            <label>Bank Name</label>
                                            <input
                                                type="text"
                                                value={form.bankName}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, bankName: value });
                                                    validateField("bankName", value);
                                                }}
                                                className={`form-control ${errors.bankName ? "is-invalid" : ""}`}
                                                placeholder="Bank Name"
                                                onBlur={(e) => validateField("bankName", e.target.value)}
                                            />
                                            {errors.bankName && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                    {errors.bankName}
                                                </p>
                                            )}
                                        </div>

                                    </div>


                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Bank Code</label>
                                            <input
                                                type="text"
                                                value={form.bankCode}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, bankCode: value });
                                                    validateField("bankCode", value);
                                                }}
                                                className={`form-control ${errors.bankCode ? "is-invalid" : ""}`}
                                                placeholder="Bank Code"
                                                onBlur={(e) => validateField("bankCode", e.target.value)}
                                            />
                                            {errors.bankCode && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                    {errors.bankCode}
                                                </p>
                                            )}
                                        </div>


                                        <div className="col-md-6 mb-3">
                                            <label>Bank Account No.</label>
                                            <input
                                                type="text"
                                                value={form.bankAccountNo}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, bankAccountNo: value });
                                                    validateField("bankAccountNo", value);
                                                }}
                                                className={`form-control ${errors.bankAccountNo ? "is-invalid" : ""}`}
                                                placeholder="Bank Account No."
                                                onBlur={(e) => validateField("bankAccountNo", e.target.value)}
                                            />
                                            {errors.bankAccountNo && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                    {errors.bankAccountNo}
                                                </p>
                                            )}
                                        </div>

                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Medical (%)</label>
                                            <input
                                                type="text"
                                                value={form.medical}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, medical: value });
                                                    validateField("medical", value);
                                                }}
                                                className={`form-control ${errors.medical ? "is-invalid" : ""}`}
                                                placeholder="Medical (%)"
                                                onBlur={(e) => validateField("medical", e.target.value)}
                                            />
                                            {errors.medical && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.medical}</p>
                                            )}
                                        </div>


                                        <div className="col-md-6 mb-3">
                                            <label>PF Employer.</label>
                                            <input
                                                type="text"
                                                value={form.pfEmployer}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, pfEmployer: value });
                                                    validateField("pfEmployer", value);
                                                }}
                                                className={`form-control ${errors.pfEmployer ? "is-invalid" : ""}`}
                                                placeholder="PF Employer."
                                                onBlur={(e) => validateField("pfEmployer", e.target.value)}
                                            />
                                            {errors.pfEmployer && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                    {errors.pfEmployer}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label>Added By</label>
                                        <select
                                            id="addedBy"
                                            value={form.addedBy}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, addedBy: value });
                                                validateField("addedBy", value); // real-time validation
                                            }}
                                            className={`form-control ${errors.addedBy ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("addedBy", e.target.value)}
                                        >
                                            <option value="">Added By</option>
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
                                        {errors.addedBy && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                {errors.addedBy}
                                            </p>
                                        )}
                                    </div>



                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">
                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Location Head</label>
                                            <select
                                                id="locationHead"
                                                value={form.locationHead}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, locationHead: value });
                                                    validateField("locationHead", value);
                                                }}
                                                className={`form-control ${errors.locationHead ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("locationHead", e.target.value)}
                                            >
                                                <option value="">Location Head</option>
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
                                            {errors.locationHead && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.locationHead}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Location HR Manager</label>
                                            <select
                                                id="locationHr"
                                                value={form.locationHrManager}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, locationHrManager: value });
                                                    validateField("locationHrManager", value);
                                                }}
                                                className={`form-control ${errors.locationHrManager ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("locationHrManager", e.target.value)}
                                            >
                                                <option value="">Location HR Manager</option>
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
                                            {errors.locationHrManager && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.locationHrManager}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label>Address Line 1</label>
                                        <input
                                            type="text"
                                            value={form.address}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, address: value });
                                                validateField("address", value);
                                            }}
                                            className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                            placeholder="Address Line 1"
                                            onBlur={(e) => validateField("address", e.target.value)}
                                        />
                                        {errors.address && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.address}</p>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label>Address Line 2</label>
                                        <input
                                            type="text"
                                            value={form.address2 || ""}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, address2: value });
                                            }}
                                            className="form-control"
                                            placeholder="Address Line 2"

                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label>City</label>
                                            <input
                                                type="text"
                                                value={form.city}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, city: value });
                                                    validateField("city", value);
                                                }}
                                                className={`form-control ${errors.city ? "is-invalid" : ""}`}
                                                placeholder="City"
                                                onBlur={(e) => validateField("city", e.target.value)}
                                            />
                                            {errors.city && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                    {errors.city}
                                                </p>
                                            )}
                                        </div>


                                        <div className="col-md-4 mb-3">
                                            <label>State / Province</label>
                                            <input
                                                type="text"
                                                value={form.state}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, state: value });
                                                    validateField("state", value);
                                                }}
                                                className={`form-control ${errors.state ? "is-invalid" : ""}`}
                                                placeholder="State / Province"
                                                onBlur={(e) => validateField("state", e.target.value)}
                                            />
                                            {errors.state && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                    {errors.state}
                                                </p>
                                            )}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label>Zip Code</label>
                                            <input
                                                type="text"
                                                value={form.zipCode}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, zipCode: value });
                                                    validateField("zipCode", value);
                                                }}
                                                className={`form-control ${errors.zipCode ? "is-invalid" : ""}`}
                                                placeholder="Zip Code"
                                                onBlur={(e) => validateField("zipCode", e.target.value)}
                                            />
                                            {errors.zipCode && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                    {errors.zipCode}
                                                </p>
                                            )}
                                        </div>

                                    </div>

                                    <div className="mb-3">
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            value={form.country}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, country: value });
                                                validateField("country", value);
                                            }}
                                            className={`form-control ${errors.country ? "is-invalid" : ""}`}
                                            placeholder="Country"
                                            onBlur={(e) => validateField("country", e.target.value)}
                                        />
                                        {errors.country && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                {errors.country}
                                            </p>
                                        )}
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Basic Salary</label>
                                            <input
                                                type="text"
                                                value={form.basiSalary}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, basiSalary: value });
                                                    validateField("basiSalary", value);
                                                }}
                                                className={`form-control ${errors.basiSalary ? "is-invalid" : ""}`}
                                                placeholder="Basic Salary"
                                                onBlur={(e) => validateField("basiSalary", e.target.value)}
                                            />
                                            {errors.basiSalary && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.basiSalary}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>HRA (%)</label>
                                            <input
                                                type="text"
                                                value={form.hra}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, hra: value });
                                                    validateField("hra", value);
                                                }}
                                                className={`form-control ${errors.hra ? "is-invalid" : ""}`}
                                                placeholder="HRA (%)"
                                                onBlur={(e) => validateField("hra", e.target.value)}
                                            />
                                            {errors.hra && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.hra}</p>
                                            )}
                                        </div>
                                    </div>


                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>LTA (%)</label>
                                            <input
                                                type="text"
                                                value={form.lta}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, lta: value });
                                                    validateField("lta", value);
                                                }}
                                                className={`form-control ${errors.lta ? "is-invalid" : ""}`}
                                                placeholder="LTA (%)"
                                                onBlur={(e) => validateField("lta", e.target.value)}
                                            />
                                            {errors.lta && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.lta}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Conveyance Allowance (%)</label>
                                            <input
                                                type="text"
                                                value={form.allowance}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, allowance: value });
                                                    validateField("allowance", value);
                                                }}
                                                className={`form-control ${errors.allowance ? "is-invalid" : ""}`}
                                                placeholder="Conveyance Allowance (%)"
                                                onBlur={(e) => validateField("allowance", e.target.value)}
                                            />
                                            {errors.allowance && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.allowance}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>ESC (%)</label>
                                            <input
                                                type="text"
                                                value={form.esc}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, esc: value });
                                                    validateField("esc", value);
                                                }}
                                                className={`form-control ${errors.esc ? "is-invalid" : ""}`}
                                                placeholder="ESC (%)"
                                                onBlur={(e) => validateField("esc", e.target.value)}
                                            />
                                            {errors.esc && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.esc}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Gratuity (%)</label>
                                            <input
                                                type="text"
                                                value={form.gratuity}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, gratuity: value });
                                                    validateField("gratuity", value);
                                                }}
                                                className={`form-control ${errors.gratuity ? "is-invalid" : ""}`}
                                                placeholder="Gratuity (%)"
                                                onBlur={(e) => validateField("gratuity", e.target.value)}
                                            />
                                            {errors.gratuity && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.gratuity}</p>
                                            )}
                                        </div>
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
                    <span>List All Locations</span>
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
                                    <h5 className="modal-title">Location Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Company:</strong> {selectedRow.company}</p>
                                    <p><strong>Location Name:</strong> {selectedRow.locationName}</p>
                                    <p><strong>Email:</strong> {selectedRow?.email ? String(selectedRow.email).replace(/<[^>]+>/g, '') : ''} </p>
                                    <p><strong>Phone:</strong> {selectedRow?.phone ? String(selectedRow.phone).replace(/<[^>]+>/g, '') : ''} </p>
                                    <p><strong>Fax Number:</strong> {selectedRow?.faxNumber ? String(selectedRow.faxNumber).replace(/<[^>]+>/g, '') : ''} </p>
                                    <p><strong>Location Head:</strong> {selectedRow.locationHead}</p>
                                    <p><strong>Location HR Manager:</strong> {selectedRow?.locationHrManager ? String(selectedRow.locationHrManager).replace(/<[^>]+>/g, '') : ''} </p>
                                    <p><strong>Address:</strong> {selectedRow?.address ? String(selectedRow.address).replace(/<[^>]+>/g, '') : ''} </p>
                                    <p><strong>City:</strong> {selectedRow.city}</p>
                                    <p><strong>State / Province:</strong> {selectedRow?.state ? String(selectedRow.state).replace(/<[^>]+>/g, '') : ''} </p>
                                    <p><strong>Zip Code / Postal Code:</strong> {selectedRow?.zipCode ? String(selectedRow.zipCode).replace(/<[^>]+>/g, '') : ''} </p>
                                    <p><strong>Country:</strong> {selectedRow.country}</p>
                                    <p><strong>Bank Branch:</strong> {selectedRow?.bankBranch ? String(selectedRow.bankBranch).replace(/<[^>]+>/g, '') : ''} </p>
                                    <p><strong>Bank Name:</strong> {selectedRow?.bankName ? String(selectedRow.bankName).replace(/<[^>]+>/g, '') : ''} </p>
                                    <p><strong>Bank Code:</strong> {selectedRow?.bankCode ? String(selectedRow.bankCode).replace(/<[^>]+>/g, '') : ''} </p>
                                    <p><strong>Bank Account No:</strong> {selectedRow?.bankAccountNo ? String(selectedRow.bankAccountNo).replace(/<[^>]+>/g, '') : ''}</p>

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
                                        <h5 className="modal-title">Edit Location</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <div className="mb-3">
                                                            <label>Company</label>
                                                            <select
                                                                id="company"
                                                                value={form.company}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, company: value });
                                                                    validateField("company", value);
                                                                }}
                                                                className={`form-control ${errors.company ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("company", e.target.value)}

                                                            >
                                                                <option value="">Company</option>
                                                                <option value="UBI Services Ltd.">UBI Services Ltd.</option>
                                                            </select>
                                                            {errors.company && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.company}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Location Name</label>
                                                        <input
                                                            type="text"
                                                            value={form.locationName}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, locationName: value });
                                                                validateField("locationName", value);


                                                            }}
                                                            className={`form-control ${errors.locationName ? "is-invalid" : ""}`}
                                                            placeholder="Location Name"
                                                            onBlur={(e) => validateField("locationName", e.target.value)}

                                                        />
                                                        {errors.locationName && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.locationName}</p>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Email</label>
                                                        <input type="email" value={form.email} onChange={(e) => {
                                                            const { value } = e.target;
                                                            setForm({ ...form, email: value });
                                                            validateField("email", value);
                                                        }}
                                                            className="form-control" placeholder="Email"
                                                            onBlur={(e) => validateField("email", e.target.value)}

                                                        />
                                                        {errors.email && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.email}</p>
                                                        )}
                                                    </div>


                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Phone</label>
                                                            <input type="text" value={form.phone} onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, phone: value });
                                                                validateField("phone", value);
                                                            }}
                                                                className="form-control" placeholder="Phone"
                                                                onBlur={(e) => validateField("phone", e.target.value)}
                                                            />
                                                            {errors.phone && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.phone}</p>
                                                            )}

                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Fax Number</label>
                                                            <input
                                                                type="text"
                                                                value={form.faxNumber}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, faxNumber: value });
                                                                    validateField("faxNumber", value);
                                                                }}
                                                                className={`form-control ${errors.faxNumber ? "is-invalid" : ""}`}
                                                                placeholder="Fax Number"
                                                                onBlur={(e) => validateField("faxNumber", e.target.value)}
                                                            />
                                                            {errors.faxNumber && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.faxNumber}</p>
                                                            )}
                                                        </div>

                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Bank Branch</label>
                                                            <input
                                                                type="text"
                                                                value={form.bankBranch}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, bankBranch: value });
                                                                    validateField("bankBranch", value);
                                                                }}
                                                                className={`form-control ${errors.bankBranch ? "is-invalid" : ""}`}
                                                                placeholder="Bank Branch"
                                                                onBlur={(e) => validateField("bankBranch", e.target.value)}
                                                            />
                                                            {errors.bankBranch && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.bankBranch}</p>
                                                            )}
                                                        </div>


                                                        <div className="col-md-6 mb-3">
                                                            <label>Bank Name</label>
                                                            <input
                                                                type="text"
                                                                value={form.bankName}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, bankName: value });
                                                                    validateField("bankName", value);
                                                                }}
                                                                className={`form-control ${errors.bankName ? "is-invalid" : ""}`}
                                                                placeholder="Bank Name"
                                                                onBlur={(e) => validateField("bankName", e.target.value)}
                                                            />
                                                            {errors.bankName && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                    {errors.bankName}
                                                                </p>
                                                            )}
                                                        </div>

                                                    </div>


                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Bank Code</label>
                                                            <input
                                                                type="text"
                                                                value={form.bankCode}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, bankCode: value });
                                                                    validateField("bankCode", value);
                                                                }}
                                                                className={`form-control ${errors.bankCode ? "is-invalid" : ""}`}
                                                                placeholder="Bank Code"
                                                                onBlur={(e) => validateField("bankCode", e.target.value)}
                                                            />
                                                            {errors.bankCode && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                    {errors.bankCode}
                                                                </p>
                                                            )}
                                                        </div>


                                                        <div className="col-md-6 mb-3">
                                                            <label>Bank Account No.</label>
                                                            <input
                                                                type="text"
                                                                value={form.bankAccountNo}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, bankAccountNo: value });
                                                                    validateField("bankAccountNo", value);
                                                                }}
                                                                className={`form-control ${errors.bankAccountNo ? "is-invalid" : ""}`}
                                                                placeholder="Bank Account No."
                                                                onBlur={(e) => validateField("bankAccountNo", e.target.value)}
                                                            />
                                                            {errors.bankAccountNo && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                    {errors.bankAccountNo}
                                                                </p>
                                                            )}
                                                        </div>

                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Medical (%)</label>
                                                            <input
                                                                type="text"
                                                                value={form.medical}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, medical: value });
                                                                    validateField("medical", value);
                                                                }}
                                                                className={`form-control ${errors.medical ? "is-invalid" : ""}`}
                                                                placeholder="Medical (%)"
                                                                onBlur={(e) => validateField("medical", e.target.value)}
                                                            />
                                                            {errors.medical && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.medical}</p>
                                                            )}
                                                        </div>


                                                        <div className="col-md-6 mb-3">
                                                            <label>PF Employer.</label>
                                                            <input
                                                                type="text"
                                                                value={form.pfEmployer}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, pfEmployer: value });
                                                                    validateField("pfEmployer", value);
                                                                }}
                                                                className={`form-control ${errors.pfEmployer ? "is-invalid" : ""}`}
                                                                placeholder="PF Employer."
                                                                onBlur={(e) => validateField("pfEmployer", e.target.value)}
                                                            />
                                                            {errors.pfEmployer && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                    {errors.pfEmployer}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Added By</label>
                                                        <select
                                                            id="addedBy"
                                                            value={form.addedBy}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, addedBy: value });
                                                                validateField("addedBy", value); // real-time validation
                                                            }}
                                                            className={`form-control ${errors.addedBy ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("addedBy", e.target.value)}
                                                        >
                                                            <option value="">Added By</option>
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
                                                        {errors.addedBy && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                {errors.addedBy}
                                                            </p>
                                                        )}
                                                    </div>



                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">
                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Location Head</label>
                                                            <select
                                                                id="locationHead"
                                                                value={form.locationHead}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, locationHead: value });
                                                                    validateField("locationHead", value);
                                                                }}
                                                                className={`form-control ${errors.locationHead ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("locationHead", e.target.value)}
                                                            >
                                                                <option value="">Location Head</option>
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
                                                            {errors.locationHead && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.locationHead}</p>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Location HR Manager</label>
                                                            <select
                                                                id="locationHr"
                                                                value={form.locationHrManager}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, locationHrManager: value });
                                                                    validateField("locationHrManager", value);
                                                                }}
                                                                className={`form-control ${errors.locationHrManager ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("locationHrManager", e.target.value)}
                                                            >
                                                                <option value="">Location HR Manager</option>
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
                                                            {errors.locationHrManager && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.locationHrManager}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Address Line 1</label>
                                                        <input
                                                            type="text"
                                                            value={form.address}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, address: value });
                                                                validateField("address", value);
                                                            }}
                                                            className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                                            placeholder="Address Line 1"
                                                            onBlur={(e) => validateField("address", e.target.value)}
                                                        />
                                                        {errors.address && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.address}</p>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Address Line 2</label>
                                                        <input
                                                            type="text"
                                                            value={form.address2 || ""}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, address2: value });
                                                            }}
                                                            className="form-control"
                                                            placeholder="Address Line 2"

                                                        />
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-4 mb-3">
                                                            <label>City</label>
                                                            <input
                                                                type="text"
                                                                value={form.city}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, city: value });
                                                                    validateField("city", value);
                                                                }}
                                                                className={`form-control ${errors.city ? "is-invalid" : ""}`}
                                                                placeholder="City"
                                                                onBlur={(e) => validateField("city", e.target.value)}
                                                            />
                                                            {errors.city && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                    {errors.city}
                                                                </p>
                                                            )}
                                                        </div>


                                                        <div className="col-md-4 mb-3">
                                                            <label>State / Province</label>
                                                            <input
                                                                type="text"
                                                                value={form.state}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, state: value });
                                                                    validateField("state", value);
                                                                }}
                                                                className={`form-control ${errors.state ? "is-invalid" : ""}`}
                                                                placeholder="State / Province"
                                                                onBlur={(e) => validateField("state", e.target.value)}
                                                            />
                                                            {errors.state && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                    {errors.state}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="col-md-4 mb-3">
                                                            <label>Zip Code</label>
                                                            <input
                                                                type="text"
                                                                value={form.zipCode}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, zipCode: value });
                                                                    validateField("zipCode", value);
                                                                }}
                                                                className={`form-control ${errors.zipCode ? "is-invalid" : ""}`}
                                                                placeholder="Zip Code"
                                                                onBlur={(e) => validateField("zipCode", e.target.value)}
                                                            />
                                                            {errors.zipCode && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                    {errors.zipCode}
                                                                </p>
                                                            )}
                                                        </div>

                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Country</label>
                                                        <input
                                                            type="text"
                                                            value={form.country}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, country: value });
                                                                validateField("country", value);
                                                            }}
                                                            className={`form-control ${errors.country ? "is-invalid" : ""}`}
                                                            placeholder="Country"
                                                            onBlur={(e) => validateField("country", e.target.value)}
                                                        />
                                                        {errors.country && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                {errors.country}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Basic Salary (%)</label>
                                                            <input
                                                                type="text"
                                                                value={form.basiSalary}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, basiSalary: value });
                                                                    validateField("basiSalary", value);
                                                                }}
                                                                className={`form-control ${errors.basiSalary ? "is-invalid" : ""}`}
                                                                placeholder="Basic Salary (%)"
                                                                onBlur={(e) => validateField("basiSalary", e.target.value)}
                                                            />
                                                            {errors.basiSalary && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.basiSalary}</p>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>HRA (%)</label>
                                                            <input
                                                                type="text"
                                                                value={form.hra}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, hra: value });
                                                                    validateField("hra", value);
                                                                }}
                                                                className={`form-control ${errors.hra ? "is-invalid" : ""}`}
                                                                placeholder="HRA (%)"
                                                                onBlur={(e) => validateField("hra", e.target.value)}
                                                            />
                                                            {errors.hra && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.hra}</p>
                                                            )}
                                                        </div>
                                                    </div>


                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>LTA (%)</label>
                                                            <input
                                                                type="text"
                                                                value={form.lta}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, lta: value });
                                                                    validateField("lta", value);
                                                                }}
                                                                className={`form-control ${errors.lta ? "is-invalid" : ""}`}
                                                                placeholder="LTA (%)"
                                                                onBlur={(e) => validateField("lta", e.target.value)}
                                                            />
                                                            {errors.lta && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.lta}</p>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Conveyance Allowance (%)</label>
                                                            <input
                                                                type="text"
                                                                value={form.allowance}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, allowance: value });
                                                                    validateField("allowance", value);
                                                                }}
                                                                className={`form-control ${errors.allowance ? "is-invalid" : ""}`}
                                                                placeholder="Conveyance Allowance (%)"
                                                                onBlur={(e) => validateField("allowance", e.target.value)}
                                                            />
                                                            {errors.allowance && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.allowance}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>ESC (%)</label>
                                                            <input
                                                                type="text"
                                                                value={form.esc}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, esc: value });
                                                                    validateField("esc", value);
                                                                }}
                                                                className={`form-control ${errors.esc ? "is-invalid" : ""}`}
                                                                placeholder="ESC (%)"
                                                                onBlur={(e) => validateField("esc", e.target.value)}
                                                            />
                                                            {errors.esc && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.esc}</p>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Gratuity (%)</label>
                                                            <input
                                                                type="text"
                                                                value={form.gratuity}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, gratuity: value });
                                                                    validateField("gratuity", value);
                                                                }}
                                                                className={`form-control ${errors.gratuity ? "is-invalid" : ""}`}
                                                                placeholder="Gratuity (%)"
                                                                onBlur={(e) => validateField("gratuity", e.target.value)}
                                                            />
                                                            {errors.gratuity && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.gratuity}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="text-end">
                                                <button type="button" className="btn btn-sm btn-light me-2" onClick={() => { resetForm(); setShowEditModal(false) }}>Close</button>
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

export default Location;
