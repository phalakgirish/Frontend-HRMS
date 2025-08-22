import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './dashboard.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const FilesManager = () => {

    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('<div class="mb-3"><label>Hello, Your Payslip is generated</label></div>');
    const BASE_URL = 'http://localhost:3000/files-manager';
    const [allData, setAllData] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('Accounts');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [newDepartment, setNewDepartment] = useState('');
    const [newFile, setNewFile] = useState(null);
const [files, setFiles] = useState(null);


    const departments = [
        'All Departments',
        'Accounts',
        'Administrator',
        'Human Resource',
        'Dealing',
        'Digital Marketing',
        'IT',
        'Sales',
        'Admin',
        'Management',
        'Operation'
    ];

    // const handleDownload = (row) => {
    //     setSelectedRow(row);
    // };


    // const handleEdit = (row) => {
    //     setSelectedRow(row);
    //     setShowEditModal(true);
    // };

    //   const handleDelete = (row) => {
    //     setSelectedRow(row);
    //     setShowEditModal(true);
    // };




    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:3000/files-manager");
            setAllData(res.data);  // 👈 update the table data
        } catch (err) {
            console.error("Error fetching files:", err);
        }
    };

    const createFile = async (data) => {
        try {
            await axios.post(BASE_URL, data);
            fetchData();
        } catch (err) {
            console.error('Error creating file:', err);
        }
    };

    const updateFile = async (id, data) => {
        try {
            await axios.put(`${BASE_URL}/${id}`, data);
            fetchData();
        } catch (err) {
            console.error('Error updating file:', err);
        }
    };

    const deleteFile = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            fetchData();
        } catch (err) {
            console.error('Error deleting file:', err);
        }
    };


  const fetchFiles = async () => {
    const response = await fetch("http://localhost:3000/files-manager/list");
    const data = await response.json();
    setFiles(data);
  };

    const [uploadedFile, setUploadedFile] = useState(null);

   const handleUpload = async (e) => {
      e.preventDefault(); 

    if (!newFile) return alert("No file selected!");

    const formData = new FormData();
    formData.append("file", newFile);
      formData.append("department", selectedDepartment); 


    const response = await fetch("http://localhost:3000/files-manager/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    fetchData();
      setNewFile(null); 
//   e.target.reset();
  };




    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = allData.filter(item => {
        if (selectedDepartment === 'All Departments') return true;
        return item.department === selectedDepartment;
    });

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedDepartment, rowsPerPage]);

   const handleDownload = async (row) => {
    const filename = row.storedFileName || row.fileName || row.file; 

    const response = await fetch(`http://localhost:3000/files-manager/download/${filename}`);

    if (!response.ok) return alert("Download failed!");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = row.originalFileName || filename; 
    a.click();
};





    const handleEdit = (row) => {
        setSelectedRow(row);
        console.log('Edit:', row);
    };

    const handleDelete = (row) => {
        if (window.confirm('Are you sure to delete this file?')) {
            deleteFile(row._id);
        }

    };

    const handleFileChange = (e) => {
        setNewFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newDepartment || !newFile) {
            toast.error("Please select department & file !");
            return;
        }

        const formData = new FormData();
        formData.append("file", newFile);
        formData.append("department", newDepartment);
        formData.append("uploadedDate", new Date().toISOString());

        try {
            const res = await axios.post("http://localhost:3000/files-manager/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.success("File uploaded successfully!");
            setAllData(prev => [...prev, res.data]);
            setNewDepartment('');
            setNewFile(null);

        } catch (err) {
            console.error(err);
            toast.error("Upload failed!");
        }
    };


    const columns = [
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">
                    <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleDownload(row)}
                    >
                        <i className="fas fa-download text-white"></i>
                    </button>

                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleEdit(row)}
                    >
                        <i className="fas fa-edit"></i>
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(row)}
                    >
                        <i className="fas fa-trash-alt text-white"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        { name: 'File', selector: row => row.file },
        { name: 'Department', selector: row => row.department },
        { name: 'Size', selector: row => row.size },
        { name: 'Extension', selector: row => row.extension },
        { name: 'Uploaded Date', selector: row => row.uploadedDate },
    ];

    // const [data, setData] = useState([
    //     {
    //         action: '-',
    //         file: 'sample.png',
    //         department: 'Administrator',
    //         size: '372.08 KB',
    //         extension: 'png',
    //         uploadedDate: '19-May-2022 01:40 am'
    //     }
    // ]);

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

    // const [currentPage, setCurrentPage] = useState(1);
    // const [rowsPerPage, setRowsPerPage] = useState(10);

    // const totalEntries = data.length;
    // const totalPages = Math.ceil(totalEntries / rowsPerPage);

    // const paginatedData = data.slice(
    //     (currentPage - 1) * rowsPerPage,
    //     currentPage * rowsPerPage
    // );
    // const [selectedDepartment, setSelectedDepartment] = useState('Accounts');

    // const [allData, setAllData] = useState([
    //     {
    //         file: 'salary.pdf',
    //         department: 'Accounts',
    //         size: '250 KB',
    //         extension: 'pdf',
    //         uploadedDate: '10-Jun-2023',
    //     }
    // ]);

    // const filteredData = allData.filter((item) => {
    //     if (selectedDepartment === 'All Departments') return true;
    //     return item.department === selectedDepartment;
    // });


    // const totalEntries = filteredData.length;
    // const totalPages = Math.ceil(totalEntries / rowsPerPage);

    // const paginatedData = filteredData.slice(
    //     (currentPage - 1) * rowsPerPage,
    //     currentPage * rowsPerPage
    // );

    // const startEntry = (currentPage - 1) * rowsPerPage + 1;
    // const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);



    // const startEntry = (currentPage - 1) * rowsPerPage + 1;
    // const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedDepartment]);


    // const [showAddForm, setShowAddForm] = useState(false);

    // const toggleAddForm = () => {
    //     setShowAddForm((prev) => !prev);
    // };

    return (
        <div className="custom-container">
            <h5>Files Manager</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Files Manager
            </p>

            <div className='d-flex gap-3'>
                <div className="card no-radius mb-3 col-md-3">
                    <div className="card-header text-white new-emp-bg fw-bold">Departments</div>
                    <div className="card-body">
                        <ul className="list-group list-group-flush">
                            {[
                                'All Departments', 'Accounts', 'Administrator', 'Human Resource',
                                'Dealing', 'Digital Marketing', 'IT', 'Sales', 'Admin', 'Management', 'Operation'
                            ].map((dept, index) => {
                                const isHeading = dept === 'All Departments';
                                return (
                                    <li
                                        key={index}
                                        className={`list-group-item department-item ${!isHeading && selectedDepartment === dept ? 'active' : ''}`}
                                        style={{
                                            cursor: isHeading ? 'default' : 'pointer',
                                            fontWeight: isHeading ? 'bold' : 'normal',
                                            backgroundColor: isHeading ? '#f0f0f0' : 'transparent'
                                        }}
                                        onClick={() => !isHeading && setSelectedDepartment(dept)}
                                    >
                                        {dept}
                                    </li>
                                );
                            })}
                        </ul>

                    </div>

                </div>


                <div className="card no-radius col-md-9">
                    <div className="card-header d-flex justify-content-between align-items-center text-dark">
                        <span>All Files</span>
                        {/* <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add New'}</button> */}
                    </div>

                    <form className="p-3" onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Department</label>
                                    <select
                                        id="department"
                                        value={newDepartment}
                                        onChange={(e) => setNewDepartment(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="">
                                            {"Select Department"}
                                        </option>

                                        {/* Show only the selected department */}
                                        {selectedDepartment && (
                                            <option value={selectedDepartment}>{selectedDepartment}</option>
                                        )}
                                    </select>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-5">
                                <div className="mb-3">
                                    <label className="form-label">Document File</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setNewFile(file);       
                                            // handleUpload(e);        
                                        }}
                                    />



                                    <small className="form-text text-muted">
                                        Upload files only: gif, png, pdf, txt, mp3, mp4, flv, doc, docx, xls, jpg, jpeg
                                    </small>


                                </div>
                            </div>
                        </div>
                        <button className="btn btn-sm add-btn mt-2" onClick={handleUpload}>
                            Upload
                        </button>

                        {/* <div className="text-start mt-2">
                            <button type="submit"  onClick={handleUpload} className="btn btn-sm add-btn">Save</button>
                        </div> */}
                    </form>




                    <div className="px-3 mt-4">
                        {/* <div className="d-flex justify-content-between align-items-center mb-2">
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
                        </div> */}

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
                                <div className="d-flex justify-content-between align-items-center w-100">
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
                                    {/* <div className="d-flex">
                                        <button className="btn btn-sm btn-outline-dark">Copy</button>
                                        <button className="btn btn-sm btn-outline-dark">CSV</button>
                                        <button className="btn btn-sm btn-outline-dark">PDF</button>
                                        <button className="btn btn-sm btn-outline-dark">Print</button>
                                    </div> */}

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
        </div>
    );
};

export default FilesManager;
