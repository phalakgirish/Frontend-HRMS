import React from "react";
import { useState, useRef, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { getAssets, createAssets, updateAssets, deleteAssets } from "./apis/assetsApi";
import { toast } from "react-toastify";


const Assets = ({ employeeId, mode }) => {


    useEffect(() => {
    }, [employeeId]);

    const [paginated, setPaginated] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [assetsList, setAssetsList] = useState([]);

    const [form, setForm] = useState({
        assets_type_id: '',
        assets_brand: "",
        assets_model_no: "",
        assets_serial_no: "",
        assets_issued_date: '',
        assets_cost: '',
        assets_quality: '',
        assets_insurance: '',
        assets_remark: ''
    });
    const [editId, setEditId] = useState(null);

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };



    // Reset form
    const resetForm = () => {
        setForm({
            assets_type_id: '',
            assets_brand: "",
            assets_model_no: "",
            assets_serial_no: "",
            assets_issued_date: '',
            assets_cost: '',
            assets_quality: '',
            assets_insurance: '',
            assets_remark: ''
        });
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!employeeId) return toast.error("Employee ID missing");

        const payload = { ...form, employeeId: employeeId };
        console.log("this is sent data:", payload);

        try {
            if (editId) {
                await updateAssets(editId, payload);
                toast.success("Assets detail updated!");
            } else {
                await createAssets(payload);
                toast.success("Assets detail added!");
            }

            await fetchAssets();
            resetForm();
            setShowEditModal(false);
        } catch (err) {
            console.error("Error saving Assets detail:", err);
            toast.error("Failed to save!");
        }
    };

    const fetchAssets = async () => {
        if (!employeeId) return;
        try {
            const res = await getAssets(employeeId);
            console.log("Assets list:", res.data);
            setAssetsList(res.data);
        } catch (err) {
            console.error("Error fetching Assets:", err);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, [employeeId]);


    const handleEdit = (row) => {
        setForm({
            assets_type_id: row.assets_type_id,
            assets_brand: row.assets_brand,
            assets_model_no: row.assets_model_no,
            assets_serial_no: row.assets_serial_no,
            assets_issued_date: row.assets_issued_date ? new Date(row.assets_issued_date).toISOString().split("T")[0] : "",
            assets_cost: row.assets_cost,
            assets_quality: row.assets_quality,
            assets_insurance: row.assets_insurance,
            assets_remark: row.assets_remark
        });

        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            await deleteAssets(id);
            fetchAssets();
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
        { name: 'Assets Type', selector: row => row.assets_type_id },
        { name: 'Brand', selector: row => row.assets_brand },
        { name: 'Model No', selector: row => row.assets_model_no },
        { name: 'Serial No', selector: row => row.assets_serial_no },
        { name: 'Cost', selector: row => row.assets_cost },
        { name: 'Quantity', selector: row => row.assets_quality },
        { name: 'Insurance', selector: row => row.assets_insurance }

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

    const totalEntries = assetsList.length;
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
        paginate(assetsList, currentPage);
    }, [assetsList, currentPage, rowsPerPage]);


    return (
        <div>
            {mode === "edit" && (

                <div className="container-fluid mt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Assets Type</label>
                                    <select
                                        name="assets_type_id"
                                        className="form-select"
                                        value={form.assets_type_id}
                                        onChange={(e) => setForm({ ...form, assets_type_id: e.target.value })}
                                    >
                                        <option value="">Select One</option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Laptop">Laptop</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label>Model Number</label>
                                    <input
                                        type="text" placeholder='Model Number'
                                        className="form-control"
                                        name="assets_model_no"
                                        value={form.assets_model_no}
                                        onChange={(e) => setForm({ ...form, assets_model_no: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Issue Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="assets_issued_date"
                                        value={form.assets_issued_date}
                                        onChange={(e) => setForm({ ...form, assets_issued_date: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Quantity</label>
                                    <input
                                        type="text" placeholder='Quantity'
                                        className="form-control"
                                        name="assets_quality"
                                        value={form.assets_quality}
                                        onChange={(e) => setForm({ ...form, assets_quality: e.target.value })}
                                    />
                                </div>
                            </div>


                            {/* Right Column */}
                            <div className="col-md-6">

                                <div className="mb-3">
                                    <label>Brand</label>
                                    <input
                                        type="text" placeholder='Brand'
                                        className="form-control"
                                        name="assets_brand"
                                        value={form.assets_brand}
                                        onChange={(e) => setForm({ ...form, assets_brand: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Serial No</label>
                                    <input
                                        type="text" placeholder='Serial No'
                                        className="form-control"
                                        name="assets_serial_no"
                                        value={form.assets_serial_no}
                                        onChange={(e) => setForm({ ...form, assets_serial_no: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Cost</label>
                                    <input
                                        type="text" placeholder='Cost'
                                        className="form-control"
                                        name="assets_cost"
                                        value={form.assets_cost}
                                        onChange={(e) => setForm({ ...form, assets_cost: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Insurance</label>
                                    <input
                                        type="text" placeholder='Insurance'
                                        className="form-control"
                                        name="assets_insurance"
                                        value={form.assets_insurance}
                                        onChange={(e) => setForm({ ...form, assets_insurance: e.target.value })}
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="mb-3">
                            <label>Remark</label>
                            <textarea type="text" name="assets_remark"
                                value={form.assets_remark}
                                onChange={(e) => setForm({ ...form, assets_remark: e.target.value })} className="form-control" placeholder="Remark" />
                        </div>

                        <div className="text-start mb-4">
                            <button type="submit" className="btn btn-sm add-btn">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List All Assets</span>
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
                                    <p><strong>Assets Type:</strong> {selectedRow.assets_type_id}</p>
                                    <p><strong>Brand:</strong> {selectedRow.assets_brand}</p>
                                    <p><strong>Model Number:</strong> {selectedRow.assets_model_no}</p>
                                    <p><strong>Serial Number:</strong> {selectedRow.assets_serial_no}</p>
                                    <p><strong>Issue Date:</strong> {selectedRow.assets_issued_date ? new Date(selectedRow.assets_issued_date).toLocaleDateString()
                                        : "N/A"}</p>
                                    <p><strong>Cost:</strong> {selectedRow.assets_cost}</p>
                                    <p><strong>Quantity:</strong> {selectedRow.assets_quality}</p>
                                    <p><strong>Insurance:</strong> {selectedRow.assets_insurance}</p>
                                    <p><strong>Remark:</strong> {selectedRow.assets_remark}</p>
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
                                                        <label>Assets Type</label>
                                                        <select
                                                            name="assets_type_id"
                                                            className="form-select"
                                                            value={form.assets_type_id}
                                                            onChange={(e) => setForm({ ...form, assets_type_id: e.target.value })}
                                                        >
                                                            <option value="">Select One</option>
                                                            <option value="Mobile">Mobile</option>
                                                            <option value="Laptop">Laptop</option>
                                                        </select>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Model Number</label>
                                                        <input
                                                            type="text" placeholder='Model Number'
                                                            className="form-control"
                                                            name="assets_model_no"
                                                            value={form.assets_model_no}
                                                            onChange={(e) => setForm({ ...form, assets_model_no: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Issue Date</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="assets_issued_date"
                                                            value={form.assets_issued_date}
                                                            onChange={(e) => setForm({ ...form, assets_issued_date: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Quantity</label>
                                                        <input
                                                            type="text" placeholder='Quantity'
                                                            className="form-control"
                                                            name="assets_quality"
                                                            value={form.assets_quality}
                                                            onChange={(e) => setForm({ ...form, assets_quality: e.target.value })}
                                                        />
                                                    </div>
                                                </div>


                                                {/* Right Column */}
                                                <div className="col-md-6">

                                                    <div className="mb-3">
                                                        <label>Brand</label>
                                                        <input
                                                            type="text" placeholder='Brand'
                                                            className="form-control"
                                                            name="assets_brand"
                                                            value={form.assets_brand}
                                                            onChange={(e) => setForm({ ...form, assets_brand: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Serial No</label>
                                                        <input
                                                            type="text" placeholder='Serial No'
                                                            className="form-control"
                                                            name="assets_serial_no"
                                                            value={form.assets_serial_no}
                                                            onChange={(e) => setForm({ ...form, assets_serial_no: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Cost</label>
                                                        <input
                                                            type="text" placeholder='Cost'
                                                            className="form-control"
                                                            name="assets_cost"
                                                            value={form.assets_cost}
                                                            onChange={(e) => setForm({ ...form, assets_cost: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Insurance</label>
                                                        <input
                                                            type="text" placeholder='Insurance'
                                                            className="form-control"
                                                            name="assets_insurance"
                                                            value={form.assets_insurance}
                                                            onChange={(e) => setForm({ ...form, assets_insurance: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="mb-3">
                                                <label>Remark</label>
                                                <textarea type="text" name="assets_remark"
                                                    value={form.assets_remark}
                                                    onChange={(e) => setForm({ ...form, assets_remark: e.target.value })} className="form-control" placeholder="Remark" />
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
export default Assets;