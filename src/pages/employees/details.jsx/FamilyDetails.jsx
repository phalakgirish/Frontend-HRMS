import React from "react";
import { useState, useRef, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { getFamilyDetail, createFamilyDetail, updateFamilyDetail, deleteFamilyDetail } from "./apis/familyDetailsApi";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const FamilyDetails = ({ mode }) => {
    const { empId } = useParams();
    const [paginated, setPaginated] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [familyList, setFamilyList] = useState([]);
    const [form, setForm] = useState({
        family_relation: "",
        family_name: "",
        family_primary_contact: "",
        family_dependent_contact: "",
        family_email_work: "",
        family_email_personal: "",
        family_address: "",
        family_mobile: "",
        family_phone_work: "",
        family_city: "",
        family_state: "",
        family_pincode: "",
        family_country: "",
        family_dob: "",
    });
    const [editId, setEditId] = useState(null);

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };



    // Reset form
    const resetForm = () => {
        setForm({
            family_relation: "",
            family_name: "",
            family_primary_contact: "",
            family_dependent_contact: "",
            family_email_work: "",
            family_email_personal: "",
            family_address: "",
            family_mobile: "",
            family_phone_work: "",
            family_city: "",
            family_state: "",
            family_pincode: "",
            family_country: "",
            family_dob: "",
        });
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!empId) return toast.error("Employee ID missing");

        const payload = { ...form, employeeId: empId };
        console.log("this is sent data:", payload);

        try {
            if (editId) {
                await updateFamilyDetail(editId, payload);
                toast.success("Family detail updated!");
            } else {
                await createFamilyDetail(payload);
                toast.success("Family detail added!");
            }

            await fetchFamily();
            resetForm();
            setShowEditModal(false);
        } catch (err) {
            console.error("Error saving family detail:", err);
            toast.error("Failed to save!");
        }
    };

    const fetchFamily = async () => {
        if (!empId) return;
        try {
            const res = await getFamilyDetail(empId);
            console.log("Family list:", res.data);
            setFamilyList(res.data);
        } catch (err) {
            console.error("Error fetching family:", err);
        }
    };

    useEffect(() => {
        fetchFamily();
    }, [empId]);


    const handleEdit = (row) => {
        setForm({
            family_relation: row.family_relation || "",
            family_name: row.family_name || "",
            family_primary_contact: row.family_primary_contact || false,
            family_dependent_contact: row.family_dependent_contact || false,
            family_email_work: row.family_email_work || "",
            family_email_personal: row.family_email_personal || "",
            family_address: row.family_address || "",
            family_mobile: row.family_mobile || "",
            family_phone_work: row.family_phone_work || "",
            family_city: row.family_city || "",
            family_state: row.family_state || "",
            family_pincode: row.family_pincode || "",
            family_country: row.family_country || "",
            family_dob: row.family_dob ? row.family_dob.split("T")[0] : "", // For date input
        });

        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            await deleteFamilyDetail(id);
            fetchFamily();
            toast.success("Deleted successfully!");
        } catch (err) {
            console.error("Error deleting:", err);
            toast.error("Failed to delete!");
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
        { name: 'Name', selector: row => row.family_name || '-' },
        { name: 'Relation', selector: row => row.family_relation || '-' },
        { name: 'Email', selector: row => row.family_email_work || '-' },
        { name: 'Mobile', selector: row => row.family_mobile || '-' },
        { name: 'Date of Birth', selector: row => row.family_dob || '-' }

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

    const totalEntries = familyList.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    // console.log('Paginated data:', paginated);

    const paginate = (data, page) => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(data.slice(start, end));
        setCurrentPage(page);
    };
    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

    useEffect(() => {
        paginate(familyList, currentPage);
    }, [familyList, currentPage, rowsPerPage]);


    return (
        <div>
            {mode === "edit" && (

                <div className="container-fluid mt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Relation</label>
                                    <select
                                        name="family_relation"
                                        className="form-control"
                                        value={form.family_relation}
                                        onChange={(e) => setForm({ ...form, family_relation: e.target.value })}
                                    >
                                        <option value="">Select One</option>
                                        <option value="Self">Self</option>
                                        <option value="Parent">Parent</option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Child">Child</option>
                                        <option value="Sibling">Sibling</option>
                                        <option value="In Laws">In Laws</option>
                                    </select>
                                </div>

                                <div className="mb-3 d-flex gap-3 align-items-center">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            id="primaryContact"
                                            checked={form.family_primary_contact || false}
                                            onChange={(e) =>
                                                setForm({ ...form, family_primary_contact: e.target.checked })
                                            }
                                            style={{ width: "16px", height: "16px" }}
                                        />

                                        <label className="form-check-label ms-2" htmlFor="primaryContact">
                                            Primary Contact
                                        </label>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            id="dependantContact"
                                            checked={form.family_dependent_contact || false}
                                            onChange={(e) =>
                                                setForm({ ...form, family_dependent_contact: e.target.checked })
                                            }
                                            style={{ width: "16px", height: "16px" }}
                                        />



                                        <label className="form-check-label ms-2" htmlFor="dependant">
                                            Dependant
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="form-control"
                                        name="family_name"
                                        value={form.family_name}
                                        onChange={(e) => setForm({ ...form, family_name: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3 col-md-12">
                                    <label>Phone</label>
                                    <div className="d-flex gap-4">
                                        <input
                                            type="text"
                                            placeholder="Work"
                                            className="form-control mb-3"
                                            name="family_phone_work"
                                            value={form.family_phone_work}
                                            onChange={(e) => setForm({ ...form, family_phone_work: e.target.value })}
                                        />
                                        <input type="text" className="form-control" style={{ width: "150px" }} placeholder="Ext" />
                                    </div>
                                </div>

                                <div className="mb-3 col-md-12">
                                    <input
                                        type="text"
                                        placeholder="Mobile"
                                        className="form-control mb-3"
                                        name="family_mobile"
                                        value={form.family_mobile}
                                        onChange={(e) => setForm({ ...form, family_mobile: e.target.value })}
                                    />
                                    <input type="text" className="form-control" placeholder="Home" />
                                </div>

                                <div className="mb-3 col-md-12">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        placeholder="Mobile"
                                        className="form-control mb-3"
                                        name="family_dob"
                                        value={form.family_dob}
                                        onChange={(e) => setForm({ ...form, family_dob: e.target.value })}
                                    />
                                </div>


                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">

                                <div className="mb-3">
                                    <label>Email</label>
                                    <input type="text" className="form-control mb-3" placeholder="Work"
                                        name="family_email_work"
                                        value={form.family_email_work}
                                        onChange={(e) => setForm({ ...form, family_email_work: e.target.value })}
                                    />
                                    <input type="text" className="form-control" placeholder="Personal"
                                        name="family_email_personal"
                                        value={form.family_email_personal}
                                        onChange={(e) => setForm({ ...form, family_email_personal: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Address</label>
                                    <input type="text" className="form-control mb-3" placeholder="Address Line 1"
                                        name="family_address"
                                        value={form.family_address}
                                        onChange={(e) => setForm({ ...form, family_address: e.target.value })}
                                    />
                                    <input type="text" className="form-control" placeholder="Address Line 2" />
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <input type="text" className="form-control" placeholder="City"
                                            name="family_city"
                                            value={form.family_city}
                                            onChange={(e) => setForm({ ...form, family_city: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <input type="text" className="form-control" placeholder="State"
                                            name="family_state"
                                            value={form.family_state}
                                            onChange={(e) => setForm({ ...form, family_state: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <input type="text" className="form-control" placeholder="Zip Code"
                                            name="family_pincode"
                                            value={form.family_pincode}
                                            onChange={(e) => setForm({ ...form, family_pincode: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label>Country</label>
                                    <select
                                        name="family_country"
                                        className="form-control"
                                        value={form.family_country}
                                        onChange={(e) => setForm({ ...form, family_country: e.target.value })}
                                    >
                                        <option value="">Select Country</option>
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="GB">United Kingdom</option>
                                        <option value="AU">Australia</option>
                                        <option value="IN">India</option>
                                        <option value="DE">Germany</option>
                                        <option value="FR">France</option>
                                        <option value="JP">Japan</option>
                                        <option value="CN">China</option>
                                        <option value="BR">Brazil</option>
                                        <option value="ZA">South Africa</option>
                                        <option value="RU">Russia</option>
                                        <option value="MX">Mexico</option>
                                        <option value="IT">Italy</option>
                                        <option value="ES">Spain</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        <div className="text-start mb-4">
                            <button type="submit" className="btn btn-sm add-btn">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List All Family Details</span>
                    {/* <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add New'}</button> */}
                </div>


                <div className="px-3 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                            <label htmlFor="entriesSelect" className="mb-0 ms-4">Show</label>
                            <select
                                id="entriesSelect"
                                className="form-select form-select-sm w-auto"
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
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
                                    <h5 className="modal-title">View Promotion</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Relation:</strong> {selectedRow.family_relation}</p>
                                    <p><strong>Email(Work):</strong> {selectedRow.family_email_work}</p>
                                    <p><strong>Email(Personal):</strong> {selectedRow.family_email_personal}</p>
                                    <p><strong>Name:</strong> {selectedRow.family_name}</p>
                                    <p><strong>Address:</strong> {selectedRow.family_address}</p>
                                    <p><strong>Phone:</strong> {selectedRow.family_phone_work}</p>
                                    <p><strong>Mobile:</strong> {selectedRow.family_mobile}</p>
                                    <p><strong>Country:</strong> {selectedRow.family_country}</p>
                                    <p><strong>Date of Birth:</strong> {selectedRow.family_dob}</p>

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
                                        <h5 className="modal-title">Edit Promotion</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Relation</label>
                                                        <select
                                                            name="family_relation"
                                                            className="form-control"
                                                            value={form.family_relation}
                                                            onChange={(e) => setForm({ ...form, family_relation: e.target.value })}
                                                        >
                                                            <option value="">Select One</option>
                                                            <option value="Self">Self</option>
                                                            <option value="Parent">Parent</option>
                                                            <option value="Spouse">Spouse</option>
                                                            <option value="Child">Child</option>
                                                            <option value="Sibling">Sibling</option>
                                                            <option value="In Laws">In Laws</option>
                                                        </select>
                                                    </div>

                                                    <div className="mb-3 d-flex gap-3 align-items-center">
                                                        <div className="form-check">
                                                            <input
                                                                type="checkbox"
                                                                id="primaryContact"
                                                                checked={form.family_primary_contact || false}
                                                                onChange={(e) =>
                                                                    setForm({ ...form, family_primary_contact: e.target.checked })
                                                                }
                                                                style={{ width: "16px", height: "16px" }}
                                                            />

                                                            <label className="form-check-label ms-2" htmlFor="primaryContact">
                                                                Primary Contact
                                                            </label>
                                                        </div>

                                                        <div className="form-check">
                                                            <input
                                                                type="checkbox"
                                                                id="dependantContact"
                                                                checked={form.family_dependent_contact || false}
                                                                onChange={(e) =>
                                                                    setForm({ ...form, family_dependent_contact: e.target.checked })
                                                                }
                                                                style={{ width: "16px", height: "16px" }}
                                                            />



                                                            <label className="form-check-label ms-2" htmlFor="dependant">
                                                                Dependant
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Name"
                                                            className="form-control"
                                                            name="family_name"
                                                            value={form.family_name}
                                                            onChange={(e) => setForm({ ...form, family_name: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="mb-3 col-md-12">
                                                        <label>Phone</label>
                                                        <div className="d-flex gap-4">
                                                            <input
                                                                type="text"
                                                                placeholder="Work"
                                                                className="form-control mb-3"
                                                                name="family_phone_work"
                                                                value={form.family_phone_work}
                                                                onChange={(e) => setForm({ ...form, family_phone_work: e.target.value })}
                                                            />
                                                            <input type="text" className="form-control" style={{ width: "150px" }} placeholder="Ext" />
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 col-md-12">
                                                        <input
                                                            type="text"
                                                            placeholder="Mobile"
                                                            className="form-control mb-3"
                                                            name="family_mobile"
                                                            value={form.family_mobile}
                                                            onChange={(e) => setForm({ ...form, family_mobile: e.target.value })}
                                                        />
                                                        <input type="text" className="form-control" placeholder="Home" />
                                                    </div>

                                                    <div className="mb-3 col-md-12">
                                                        <label>Date of Birth</label>
                                                        <input
                                                            type="date"
                                                            placeholder="Mobile"
                                                            className="form-control mb-3"
                                                            name="family_dob"
                                                            value={form.family_dob}
                                                            onChange={(e) => setForm({ ...form, family_dob: e.target.value })}
                                                        />
                                                    </div>


                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">

                                                    <div className="mb-3">
                                                        <label>Email</label>
                                                        <input type="text" className="form-control mb-3" placeholder="Work"
                                                            name="family_email_work"
                                                            value={form.family_email_work}
                                                            onChange={(e) => setForm({ ...form, family_email_work: e.target.value })}
                                                        />
                                                        <input type="text" className="form-control" placeholder="Personal"
                                                            name="family_email_personal"
                                                            value={form.family_email_personal}
                                                            onChange={(e) => setForm({ ...form, family_email_personal: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Address</label>
                                                        <input type="text" className="form-control mb-3" placeholder="Address Line 1"
                                                            name="family_address"
                                                            value={form.family_address}
                                                            onChange={(e) => setForm({ ...form, family_address: e.target.value })}
                                                        />
                                                        <input type="text" className="form-control" placeholder="Address Line 2" />
                                                    </div>

                                                    <div className="row mb-3">
                                                        <div className="col-md-4">
                                                            <input type="text" className="form-control" placeholder="City"
                                                                name="family_city"
                                                                value={form.family_city}
                                                                onChange={(e) => setForm({ ...form, family_city: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <input type="text" className="form-control" placeholder="State"
                                                                name="family_state"
                                                                value={form.family_state}
                                                                onChange={(e) => setForm({ ...form, family_state: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <input type="text" className="form-control" placeholder="Zip Code"
                                                                name="family_pincode"
                                                                value={form.family_pincode}
                                                                onChange={(e) => setForm({ ...form, family_pincode: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Country</label>
                                                        <select
                                                            name="family_country"
                                                            className="form-control"
                                                            value={form.family_country}
                                                            onChange={(e) => setForm({ ...form, family_country: e.target.value })}
                                                        >
                                                            <option value="">Select Country</option>
                                                            <option value="US">United States</option>
                                                            <option value="CA">Canada</option>
                                                            <option value="GB">United Kingdom</option>
                                                            <option value="AU">Australia</option>
                                                            <option value="IN">India</option>
                                                            <option value="DE">Germany</option>
                                                            <option value="FR">France</option>
                                                            <option value="JP">Japan</option>
                                                            <option value="CN">China</option>
                                                            <option value="BR">Brazil</option>
                                                            <option value="ZA">South Africa</option>
                                                            <option value="RU">Russia</option>
                                                            <option value="MX">Mexico</option>
                                                            <option value="IT">Italy</option>
                                                            <option value="ES">Spain</option>
                                                        </select>
                                                    </div>
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
export default FamilyDetails;