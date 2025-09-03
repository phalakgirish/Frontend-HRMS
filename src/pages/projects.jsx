import React, { useState, useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { getProjects, createProjects, updateProjects, deleteProjects } from '../api/projectsApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Projects = () => {

  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [description, setDescription] = useState();
  const [progress, setProgress] = useState(0);
  const [remarks, setRemarks] = useState();
  const editorRef = useRef(null);
  const [editorKey, setEditorKey] = useState(0);

  const getBarColor = () => {
    if (progress >= 75) return "bg-success"; // green
    if (progress >= 50) return "bg-warning"; // yellow
    return "bg-danger"; // red
  };

  const options = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Anjali Patle ', label: 'Anjali Patle' },
    { value: 'Amit Kumar ', label: 'Amit Kumar ' },
    { value: 'Aniket Rane ', label: 'Aniket Rane ' },
    { value: 'Shubham Kadam ', label: 'Shubham Kadam ' },
    { value: 'Abhijieet Tawate ', label: 'Abhijieet Tawate ' },
    { value: 'Pravin Bildlan ', label: 'Pravin Bildlan ' },
    { value: 'Amit Pednekar ', label: 'Amit Pednekar ' },
    { value: 'Mahendra Chaudhary ', label: 'Mahendra Chaudhary ' },
    { value: 'Hamsa Dhwjaa ', label: 'Hamsa Dhwjaa ' },
    { value: 'Manoj Kumar Sinha ', label: 'Manoj Kumar Sinha ' },
  ];

  const [Projects, setProjects] = useState([]);
  const [paginated, setPaginated] = useState([]);
  const [data, setData] = useState([]); // initialize as empty array

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    projectSummary: '',
    projectManager: [],
    startDate: '',
    endDate: '',
    progress: 0,
    assignedUsers: '',
    priority: '',
    title: '',
    clientName: '',
    company: '',
    remarks: '',
    status: ''
  });

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let newErrors = {};

    Object.keys(form).forEach((field) => {
      const value = form[field];

      if (
        value === "" ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0) // check arrays
      ) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
      paginate(response.data, currentPage);
    } catch (error) {
      console.error('Error fetching Projects:', error);
    }
  };

  const validateField = (fieldName, value = "") => {
    let error = "";

    if (
      value === "" ||
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0)
    ) {
      error = "This field is required";
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return !error; // true if valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formToSubmit = {
      ...form,
      progress: Number(form.progress) || 0,
      projectManager: form.projectManager || [],
      assignedUsers: form.assignedUsers || [],
    };

    if (validateForm()) {

      try {
        if (editId) {
          await updateProjects(editId, formToSubmit);
          toast.success("Projects updated successfully!");
        } else {
          await createProjects(formToSubmit);
          toast.success("Projects saved successfully!");
        }

        fetchProjects();

        setForm({
          projectSummary: '',
          projectManager: [],
          startDate: '',
          endDate: '',
          progress: 0,
          assignedUsers: '',
          priority: '',
          title: '',
          clientName: '',
          company: '',
          remarks: '',
          status: ''
        });
        setEditId("");
        setShowEditModal(false);
      } catch (err) {
        console.error("Error saving Projects:", err);
        toast.error("Projects failed to save!");
      }
    } else {
      console.log("Form validation failed");
    }
  };



  const handleEdit = (row) => {
    setForm({
      projectSummary: row.projectSummary || '',
      projectManager: row.projectManager || [],
      startDate: row.startDate || '',
      endDate: row.endDate || '',
      progress: row.progress || 0,
      assignedUsers: row.assignedUsers || [],
      priority: row.priority || '',
      title: row.title || '',
      clientName: row.clientName || '',
      company: row.company || '',
      remarks: row.remarks || '',
      status: row.status || ''
    });

    setEditId(row._id);
    setShowEditModal(true);
    setSelectedRow(row);
  };


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Projects?");
    if (!confirmDelete) return;
    try {
      await deleteProjects(id);
      fetchProjects();
    } catch (err) {
      console.error("Error deleting Projects:", err);
    }
  };

  const emptyForm = {
    projectSummary: '',
    projectManager: [],
    startDate: '',
    endDate: '',
    progress: 0,
    assignedUsers: '',
    priority: '',
    title: '',
    clientName: '',
    company: '',
    remarks: '',
    status: ''
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowEditModal(false);
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
            onClick={() => handleEdit(row)}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(row._id)}          >
            <i className="fas fa-trash-alt text-white"></i>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    { name: 'Project Summary', selector: row => row.projectSummary },
    {
      name: 'Priority',
      cell: (row) => (
        <span
          className={`badge 
        ${row.priority === 'Lowest'
              ? 'bg-success'
              : row.priority === 'Medium'
                ? 'bg-warning'
                : 'bg-danger'}`}
        >
          {row.priority}
        </span>
      ),
      selector: row => row.priority,
    },
    { name: 'End Date', selector: row => row.endDate },
    { name: 'Progress', selector: row => row.progress },
    {
      name: 'Assigned Users',
      cell: (row) => {
        const hasAvatars = Array.isArray(row.assignedUsers) && row.assignedUsers.length > 0;
        const names = row.employeeNames || [];

        return hasAvatars ? (
          <div
            className="d-flex align-items-center"
            title={names.length > 0 ? names.join(', ') : 'Assigned Users'}
          >
            <div className="d-flex">
              {row.assignedUsers && row.assignedUsers.map((userName, idx) => (
                <div key={idx} className="position-relative" style={{ zIndex: 10 - idx }}>
                  <img
                    src="/avatar.png" // single avatar for all users
                    alt={userName}
                    title={userName}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: '-10px',
                      border: '2px solid white',
                      boxShadow: '0 0 3px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
              ))}
            </div>


          </div>
        ) : (
          <span className="text-muted">No users</span>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
    }

  ];

  const navigate = useNavigate();

  // const data = [
  //   {
  //     action: '-',
  //     projectSummaryText: 'Project 1',
  //     priority: 'Highest',
  //     endDate: '19-May-2022',
  //     progress: 'Completed 0%',
  //     assignedUsers: ['/avatar2.jpg', '/avatar2.jpg'],
  //   },
  //   {
  //     action: '-',
  //     projectSummaryText: 'Project 2',
  //     priority: 'Lowest',
  //     endDate: '19-May-2022',
  //     progress: 'Completed 0%',
  //     assignedUsers: [],
  //   },
  // ];

  data.forEach((item, index) => {
    item.projectSummary = (
      <span
        style={{ color: 'blue', cursor: 'pointer' }}
        onClick={() =>
          navigate(`/projectDetails/${index + 1}`, {
            state: {
              employee: {
                projectSummaryText: item.projectSummaryText,
                priority: item.priority,
                endDate: item.endDate,
                progress: item.progress,
                assignedUsers: item.assignedUsers,
              },
            },
          })
        }
      >
        {item.projectSummaryText}
      </span>
    );
  });



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

  const totalEntries = Projects.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  console.log('Paginated data:', paginated);

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

  return (
    <div className="custom-container">
      <h5>Projects</h5>
      <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
        <span style={{ color: 'red' }}>Home</span> / Projects
      </p>

      {showAddForm && (
        <div className="card mb-3 form-slide-container">
          <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
            <span>New Project</span>
            <button className="btn btn-sm add-btn" onClick={toggleAddForm}>
              - Hide
            </button>
          </div>

          <div className="container mt-4">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Left Column */}
                <div className="col-md-6">
                  <div className=" mb-3">
                    <label>Title</label>
                    <input type="text" value={form.title}
                      onChange={(e) => {
                        const { value } = e.target;
                        setForm({ ...form, title: value });
                        validateField("title", value);
                      }}
                      className={`form-control ${errors.title ? "is-invalid" : ""}`}
                      placeholder="Title"
                      onBlur={(e) => validateField("title", e.target.value)}

                    />
                    {errors.title && (
                      <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.title}</p>)}
                  </div>

                  <div className='row'>
                    <div className="col-md-6 mb-3">
                      <label>Client Name</label>
                      <input type="text" value={form.clientName}
                        onChange={(e) => {
                          const { value } = e.target;
                          setForm({ ...form, clientName: value });
                          validateField("clientName", value);
                        }}
                        className={`form-control ${errors.clientName ? "is-invalid" : ""}`}
                        placeholder="Client Name"
                        onBlur={(e) => validateField("clientName", e.target.value)}

                      />
                      {errors.clientName && (
                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.clientName}</p>)}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label>Company</label>
                      <select id="company" value={form.company}
                        onChange={(e) => {
                          const { value } = e.target;
                          setForm({ ...form, company: value });
                          validateField("company", value);
                        }}
                        className={`form-control ${errors.company ? "is-invalid" : ""}`}
                        onBlur={(e) => validateField("company", e.target.value)}
                      >
                        <option value="">Select Company</option>
                        <option value="UBI Services LTD.">UBI Services LTD.</option>
                      </select>
                      {errors.company && (
                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.company}</p>)}
                    </div>
                  </div>

                  <div className='row'>
                    <div className="col-md-6 mb-3">
                      <label>Start Date</label>
                      <input type="date" value={form.startDate}
                        onChange={(e) => {
                          const { value } = e.target;
                          setForm({ ...form, startDate: value });
                          validateField("startDate", value);
                        }}
                        className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                        placeholder="startDate"
                        onBlur={(e) => validateField("startDate", e.target.value)}

                      />
                      {errors.startDate && (
                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.startDate}</p>)}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label>End Date</label>
                      <input type="date" value={form.endDate}
                        onChange={(e) => {
                          const { value } = e.target;
                          setForm({ ...form, endDate: value });
                          validateField("endDate", value);
                        }}
                        className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                        placeholder="endDate"
                        onBlur={(e) => validateField("endDate", e.target.value)}

                      />
                      {errors.endDate && (
                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.endDate}</p>)}
                    </div>
                  </div>

                  <div className='col-md-12 mb-3'>
                    <label>Project Manager(s)</label>
                    <Select
                      isMulti
                      options={options}
                      value={options.filter(o => (form.projectManager || []).includes(o.value))}
                      onChange={(selectedOptions) => {
                        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                        setForm({ ...form, projectManager: values });
                        validateField("projectManager", values);
                      }}


                      className={errors.projectManager ? "is-invalid" : ""}
                      onBlur={() => validateField("projectManager", form.projectManager)}
                    />
                    {errors.projectManager && (
                      <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                        Complaint Against is required!
                      </p>
                    )}
                  </div>

                  <div className='col-md-12 mb-3'>
                    <label>Assigned User(s)</label>
                    <Select
                      isMulti
                      options={options}
                      value={options.filter(o => (form.assignedUsers || []).includes(o.value))}
                      onChange={(selectedOptions) => {
                        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                        setForm({
                          ...form,
                          assignedUsers: values
                        });
                        validateField("assignedUsers", values);
                      }}

                      className={errors.assignedUsers ? "is-invalid" : ""}
                      onBlur={() => validateField("assignedUsers", form.assignedUsers)}
                    />
                    {errors.assignedUsers && (
                      <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                        Complaint Against is required!
                      </p>
                    )}
                  </div>

                  <div className=" mb-3">
                    <label>Priority</label>
                    <select id="priority" value={form.priority}
                      onChange={(e) => {
                        const { value } = e.target;
                        setForm({ ...form, priority: value });
                        validateField("priority", value);
                      }}
                      className={`form-control ${errors.priority ? "is-invalid" : ""}`}
                      onBlur={(e) => validateField("priority", e.target.value)}
                    >
                      <option value="">Priority</option>
                      <option value="Highest">Highest</option>
                      <option value="High">High</option>
                      <option value="Low">Low</option>
                      <option value="Lowest">Lowest</option>

                    </select>
                    {errors.priority && (
                      <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.priority}</p>)}
                  </div>

                  <div className="mb-3">
                    <label>Project Completion: {form.progress}%</label>

                    <div
                      className="progress mb-2"
                      style={{
                        height: "20px",
                        cursor: "pointer",
                        position: "relative",
                        borderRadius: "5px",
                      }}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const newProgress = Math.round((clickX / rect.width) * 100);
                        setForm({ ...form, progress: newProgress });
                      }}
                    >
                      {/* Colored progress bar */}
                      <div
                        className={`progress-bar ${getBarColor(form.progress)}`}
                        role="progressbar"
                        style={{
                          width: `${form.progress}%`,
                          transition: "width 0.2s ease",
                        }}
                        aria-valuenow={form.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        {form.progress}%
                      </div>

                      {/* Transparent range slider on top */}
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={form.progress}
                        onChange={(e) =>
                          setForm({ ...form, progress: Number(e.target.value) })
                        }
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          opacity: 0, // make slider invisible but still draggable
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>



                </div>

                {/* Right Column */}
                <div className="col-md-6">
                  <div className="col-md-12 mb-3">
                    <label>Remarks</label>

                    <CKEditor
                      key={editorKey}
                      editor={ClassicEditor}
                      data={form.remarks}
                      onReady={(editor) => {
                        editorRef.current = editor;
                      }}
                      onChange={(event, editor) => {
                        const newData = editor.getData();
                        setForm(prev => ({ ...prev, remarks: newData }));
                      }}
                    />
                    {errors.remarks && (
                      <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                        Remarks is Required
                      </p>
                    )}
                  </div>

                  <div className=" mb-3">
                    <label>Status</label>
                    <select id="status" value={form.status}
                      onChange={(e) => {
                        const { value } = e.target;
                        setForm({ ...form, status: value });
                        validateField("status", value);
                      }}
                      className={`form-control ${errors.status ? "is-invalid" : ""}`}
                      onBlur={(e) => validateField("status", e.target.value)}
                    >
                      <option value="">Status</option>
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Deferred">Deferred</option>
                    </select>
                    {errors.status && (
                      <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.status}</p>)}
                  </div>

                  <div className=" mb-3">
                    <label htmlFor="projectSummary">Summary</label>
                    <textarea
                      id="projectSummary"
                      rows="3"
                      value={form.projectSummary || ""}
                      onChange={(e) => {
                        const { value } = e.target;
                        setForm({ ...form, projectSummary: value });
                        validateField("projectSummary", value);
                      }}
                      className={`form-control mb-2 ${errors.projectSummary ? "is-invalid" : ""}`}
                      placeholder="Project Summary"
                      onBlur={(e) => validateField("projectSummary", e.target.value)}

                    />
                    {errors.projectSummary && (
                      <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.projectSummary}</p>
                    )}
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
          <span>List All Projects</span>
          <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add New'}</button>
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


        {showEditModal && selectedRow && (
          <>

            <div className="custom-backdrop"></div>
            <div className="modal show fade d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered edit-modal">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Email Template</h5>
                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        {/* Left Column */}
                        <div className="col-md-6">
                          <div className=" mb-3">
                            <label>Title</label>
                            <input type="text" value={form.title}
                              onChange={(e) => {
                                const { value } = e.target;
                                setForm({ ...form, title: value });
                                validateField("title", value);
                              }}
                              className={`form-control ${errors.title ? "is-invalid" : ""}`}
                              placeholder="Title"
                              onBlur={(e) => validateField("title", e.target.value)}

                            />
                            {errors.title && (
                              <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.title}</p>)}
                          </div>

                          <div className='row'>
                            <div className="col-md-6 mb-3">
                              <label>Client Name</label>
                              <input type="text" value={form.clientName}
                                onChange={(e) => {
                                  const { value } = e.target;
                                  setForm({ ...form, clientName: value });
                                  validateField("clientName", value);
                                }}
                                className={`form-control ${errors.clientName ? "is-invalid" : ""}`}
                                placeholder="Client Name"
                                onBlur={(e) => validateField("clientName", e.target.value)}

                              />
                              {errors.clientName && (
                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.clientName}</p>)}
                            </div>

                            <div className="col-md-6 mb-3">
                              <label>Company</label>
                              <select id="company" value={form.company}
                                onChange={(e) => {
                                  const { value } = e.target;
                                  setForm({ ...form, company: value });
                                  validateField("company", value);
                                }}
                                className={`form-control ${errors.company ? "is-invalid" : ""}`}
                                onBlur={(e) => validateField("company", e.target.value)}
                              >
                                <option value="">Select Company</option>
                                <option value="UBI Services LTD.">UBI Services LTD.</option>
                              </select>
                              {errors.company && (
                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.company}</p>)}
                            </div>
                          </div>

                          <div className='row'>
                            <div className="col-md-6 mb-3">
                              <label>Start Date</label>
                              <input type="date" value={form.startDate}
                                onChange={(e) => {
                                  const { value } = e.target;
                                  setForm({ ...form, startDate: value });
                                  validateField("startDate", value);
                                }}
                                className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                                placeholder="startDate"
                                onBlur={(e) => validateField("startDate", e.target.value)}

                              />
                              {errors.startDate && (
                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.startDate}</p>)}
                            </div>

                            <div className="col-md-6 mb-3">
                              <label>End Date</label>
                              <input type="date" value={form.endDate}
                                onChange={(e) => {
                                  const { value } = e.target;
                                  setForm({ ...form, endDate: value });
                                  validateField("endDate", value);
                                }}
                                className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                                placeholder="endDate"
                                onBlur={(e) => validateField("endDate", e.target.value)}

                              />
                              {errors.endDate && (
                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.endDate}</p>)}
                            </div>
                          </div>

                          <div className='col-md-12 mb-3'>
                            <label>Project Manager(s)</label>
                            <Select
                              isMulti
                              options={options}
                              value={options.filter(o => (form.projectManager || []).includes(o.value))}
                              onChange={(selectedOptions) => {
                                const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                setForm({ ...form, projectManager: values });
                                validateField("projectManager", values);
                              }}


                              className={errors.projectManager ? "is-invalid" : ""}
                              onBlur={() => validateField("projectManager", form.projectManager)}
                            />
                            {errors.projectManager && (
                              <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                Complaint Against is required!
                              </p>
                            )}
                          </div>

                          <div className='col-md-12 mb-3'>
                            <label>Assigned User(s)</label>
                            <Select
                              isMulti
                              options={options}
                              value={options.filter(o => (form.assignedUsers || []).includes(o.value))}
                              onChange={(selectedOptions) => {
                                const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                setForm({
                                  ...form,
                                  assignedUsers: values
                                });
                                validateField("assignedUsers", values);
                              }}

                              className={errors.assignedUsers ? "is-invalid" : ""}
                              onBlur={() => validateField("assignedUsers", form.assignedUsers)}
                            />
                            {errors.assignedUsers && (
                              <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                Complaint Against is required!
                              </p>
                            )}
                          </div>

                          <div className=" mb-3">
                            <label>Priority</label>
                            <select id="priority" value={form.priority}
                              onChange={(e) => {
                                const { value } = e.target;
                                setForm({ ...form, priority: value });
                                validateField("priority", value);
                              }}
                              className={`form-control ${errors.priority ? "is-invalid" : ""}`}
                              onBlur={(e) => validateField("priority", e.target.value)}
                            >
                              <option value="">Priority</option>
                              <option value="Highest">Highest</option>
                              <option value="High">High</option>
                              <option value="Low">Low</option>
                              <option value="Lowest">Lowest</option>

                            </select>
                            {errors.priority && (
                              <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.priority}</p>)}
                          </div>

                          <div className="mb-3">
                            <label>Project Completion: {form.progress}%</label>

                            <div
                              className="progress mb-2"
                              style={{
                                height: "20px",
                                cursor: "pointer",
                                position: "relative",
                                borderRadius: "5px",
                              }}
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickX = e.clientX - rect.left;
                                const newProgress = Math.round((clickX / rect.width) * 100);
                                setForm({ ...form, progress: newProgress });
                              }}
                            >
                              {/* Colored progress bar */}
                              <div
                                className={`progress-bar ${getBarColor(form.progress)}`}
                                role="progressbar"
                                style={{
                                  width: `${form.progress}%`,
                                  transition: "width 0.2s ease",
                                }}
                                aria-valuenow={form.progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                {form.progress}%
                              </div>

                              {/* Transparent range slider on top */}
                              <input
                                type="range"
                                min={0}
                                max={100}
                                value={form.progress}
                                onChange={(e) =>
                                  setForm({ ...form, progress: Number(e.target.value) })
                                }
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  opacity: 0, // make slider invisible but still draggable
                                  cursor: "pointer",
                                }}
                              />
                            </div>
                          </div>



                        </div>

                        {/* Right Column */}
                        <div className="col-md-6">
                          <div className="col-md-12 mb-3">
                            <label>Remarks</label>

                            <CKEditor
                              editor={ClassicEditor}
                              data={form.remarks || ""}
                              onChange={(event, editor) => {
                                const newData = editor.getData();
                                setForm({ ...form, remarks: newData });
                              }}
                              onBlur={() => validateField("remarks", form.remarks)}
                            />
                            {errors.remarks && (
                              <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                Remarks is Required
                              </p>
                            )}
                          </div>

                          <div className=" mb-3">
                            <label>Status</label>
                            <select id="status" value={form.status}
                              onChange={(e) => {
                                const { value } = e.target;
                                setForm({ ...form, status: value });
                                validateField("status", value);
                              }}
                              className={`form-control ${errors.status ? "is-invalid" : ""}`}
                              onBlur={(e) => validateField("status", e.target.value)}
                            >
                              <option value="">Status</option>
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Deferred">Deferred</option>
                            </select>
                            {errors.status && (
                              <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.status}</p>)}
                          </div>

                          <div className=" mb-3">
                            <label htmlFor="projectSummary">Summary</label>
                            <textarea
                              id="projectSummary"
                              rows="3"
                              value={form.projectSummary || ""}
                              onChange={(e) => {
                                const { value } = e.target;
                                setForm({ ...form, projectSummary: value });
                                validateField("projectSummary", value);
                              }}
                              className={`form-control mb-2 ${errors.projectSummary ? "is-invalid" : ""}`}
                              placeholder="Project Summary"
                              onBlur={(e) => validateField("projectSummary", e.target.value)}

                            />
                            {errors.projectSummary && (
                              <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.projectSummary}</p>
                            )}
                          </div>


                        </div>
                      </div>

                      <div className="text-end mt-3">
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

export default Projects;
