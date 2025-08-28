import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getEmployee, createEmployee, updateEmployee, deleteEmployee } from '../../api/employeeApi';
import BasicInformationForm from './details.jsx/BasicInformation';
import ProfilePicture from './details.jsx/ProfilePicture';
import FamilyDetails from './details.jsx/FamilyDetails';
import Document from './details.jsx/Document';
import Qualification from './details.jsx/Qualification';
import WorkExperience from './details.jsx/WorkExperience';

const EmpDetails = () => {
    const location = useLocation();
    const [selectedDepartment, setSelectedDepartment] = useState('Basic Information');
    const { employee } = location.state || {};
    const [editId, setEditId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const [form, setForm] = useState({
        id: '',
        name: '',
        company: '',
        username: '',
        email: '',
        designation: '',
        role: '',
        employeeCtc: '',
        monthlyCtc: '',
        status: '',
        department: '',
        dateofBirth: '',
        joiningDate: '',
        gender: '',
        maritalStatus: '',
        contactNumber: '',
        employeeCategory: '',
        reportingTo: '',
        probationDate: '',
        confirmationDate: '',
        bloodGroup: '',
        religion: '',
        cast: '',
        address: '',
        grade: '',
    });

    useEffect(() => {
        if (employee) {
            setForm(prev => ({
                ...prev,
                ...employee
            }));
        }
    }, [employee]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await updateEmployee(editId, form);
                setEditId(null);
            } else {
                await createEmployee(form);
            }
            getEmployee();
            setForm({
                id: '',
                name: '',
                company: '',
                username: '',
                email: '',
                designation: '',
                role: '',
                employeeCtc: '',
                monthlyCtc: '',
                status: '',
                department: '',
                dateofBirth: '',
                joiningDate: '',
                gender: '',
                maritalStatus: '',
                contactNumber: '',
                employeeCategory: '',
                reportingTo: '',
                probationDate: '',
                confirmationDate: '',
                bloodGroup: '',
                religion: '',
                cast: '',
                address: '',
                grade: '',
            });
            setEditId("");
            setShowEditModal(false);
        } catch (err) {
            console.error("Error saving Employee:", err);
        }
    };

    if (!employee) {
        return <p>Employee data not found. Please go back and try again.</p>;
    }

    const renderContent = () => {
        switch (selectedDepartment) {
            case 'Basic Information':
                return <BasicInformationForm form={form} setForm={setForm} handleSubmit={handleSubmit} />;

            case 'Profile Picture':
                return <ProfilePicture form={form} setForm={setForm} handleSubmit={handleSubmit} />;

            case 'Family Details':
                return <FamilyDetails form={form} setForm={setForm} handleSubmit={handleSubmit} />;

            case 'Document':
                return <Document form={form} setForm={setForm} handleSubmit={handleSubmit} />;

            case 'Qualification':
                return <Qualification form={form} setForm={setForm} handleSubmit={handleSubmit} />;

                case 'Work Experience':
                return <WorkExperience form={form} setForm={setForm} handleSubmit={handleSubmit} />;


            case 'CTC':
                return (
                    <div>
                        <h5 className="mb-3">Monthly</h5>
                        <h6 className="mb-3">A. SALARY</h6>

                        <div className='row'>
                            <div className='col-md-3'>
                                <label>BASIC</label>
                                <input type="text" className='form-control' />
                            </div>
                        </div>
                        {/* <div className="container-fluid mt-4">
                            <form>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label>Name</label>
                                        <input type="text" className="form-control" value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Employee ID</label>
                                        <input type="text" className="form-control" value={form.id}
                                            onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="Employee ID" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Username</label>
                                        <input type="text" className="form-control" value={form.username}
                                            onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Email</label>
                                        <input type="text" className="form-control" value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Department</label>
                                        <input type="text" className="form-control" value={form.department}
                                            onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Department" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Designation</label>
                                        <input type="text" className="form-control" value={form.designation}
                                            onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="Designation" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Role</label>
                                        <input type="text" className="form-control" value={form.role}
                                            onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Date of Birth</label>
                                        <input type="text" className="form-control" value={form.dateofBirth}
                                            onChange={(e) => setForm({ ...form, dateofBirth: e.target.value })} placeholder="Date of Birth" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Date of Joining</label>
                                        <input type="text" className="form-control" value={form.joiningDate}
                                            onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} placeholder="Date of Joining" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Gender</label>
                                        <input type="text" className="form-control" value={form.gender}
                                            onChange={(e) => setForm({ ...form, gender: e.target.value })} placeholder="Gender" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Marital Status</label>
                                        <input type="text" className="form-control" value={form.maritalStatus}
                                            onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })} placeholder="Marital Status" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Contact Number</label>
                                        <input type="text" className="form-control" value={form.contactNumber}
                                            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} placeholder="Contact Number" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Employee Category</label>
                                        <input type="text" className="form-control" value={form.employeeCategory}
                                            onChange={(e) => setForm({ ...form, employeeCategory: e.target.value })} placeholder="Employee Category" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Reporting to</label>
                                        <input type="text" className="form-control" value={form.reportingTo}
                                            onChange={(e) => setForm({ ...form, reportingTo: e.target.value })} placeholder="Reporting to" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Approval By 1</label>
                                        <input type="text" className="form-control" placeholder="Approval By 1" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Approval By 2</label>
                                        <input type="text" className="form-control" placeholder="Approval By 2" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Status</label>
                                        <input type="text" className="form-control" value={form.status}
                                            onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder="Status" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Employee CTC</label>
                                        <input type="text" className="form-control" value={form.employeeCtc}
                                            onChange={(e) => setForm({ ...form, employeeCtc: e.target.value })} placeholder="Employee CTC" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Probation Date</label>
                                        <input type="text" className="form-control" value={form.probationDate}
                                            onChange={(e) => setForm({ ...form, probationDate: e.target.value })} placeholder="Probation Date" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Confirmation Date</label>
                                        <input type="text" className="form-control" value={form.confirmationDate}
                                            onChange={(e) => setForm({ ...form, confirmationDate: e.target.value })} placeholder="Confirmation Date" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Blood Group</label>
                                        <input type="text" className="form-control" value={form.bloodGroup}
                                            onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} placeholder="Blood Group" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Religion</label>
                                        <input type="text" className="form-control" value={form.relogion}
                                            onChange={(e) => setForm({ ...form, relogion: e.target.value })} placeholder="Religion" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Cast</label>
                                        <input type="text" className="form-control" value={form.cast}
                                            onChange={(e) => setForm({ ...form, cast: e.target.value })} placeholder="Cast" />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Address</label>
                                        <textarea
                                            placeholder="Address"
                                            className="form-control" value={form.address}
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                            rows={3}
                                        ></textarea>
                                    </div>


                                    <div className="col-md-6 mb-3">
                                        <label>Grade</label>
                                        <input type="text" className="form-control" value={form.grade}
                                            onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="Employee Grade" />
                                    </div>

                                </div>

                                <div className="text-start">
                                    <button type="submit" onClick={(e) => handleSubmit(e)} className="btn btn-sm add-btn mb-2">Save</button>
                                </div>

                            </form>
                        </div> */}
                    </div>
                );
            default:
                return <p>{selectedDepartment} Section Coming Soon...</p>;
        }
    };

    return (
        <div className="custom-container">
            <h5>Employee Details</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Employee Details
            </p>

            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 mb-3">
                    <div className="card h-100">
                        <div className="card-body p-2">
                            <ul className="list-group list-group-flush">
                                {[
                                    'Basic Information', 'Profile Picture', 'Family Details', 'Document',
                                    'Qualification', 'Work Experience', 'Bank Account', 'Leave', 'Shift', 'Location',
                                    'Assets', 'CTC', 'Form 16'
                                ].map((dept, index) => {
                                    const icons = {
                                        'Basic Information': 'fas fa-user',
                                        'Profile Picture': 'fas fa-image',
                                        'Family Details': 'fas fa-users',
                                        'Document': 'fas fa-file-alt',
                                        'Qualification': 'fas fa-graduation-cap',
                                        'Work Experience': 'fas fa-briefcase',
                                        'Bank Account': 'fas fa-university',
                                        'Leave': 'fas fa-calendar-alt',
                                        'Shift': 'fas fa-clock',
                                        'Location': 'fas fa-map-marker-alt',
                                        'Assets': 'fas fa-laptop',
                                        'CTC': 'fas fa-rupee-sign',
                                        'Form 16': 'fas fa-file-invoice-dollar'
                                    };

                                    return (
                                        <li
                                            key={index}
                                            className={`list-group-item department-item ${selectedDepartment === dept ? 'active' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setSelectedDepartment(dept)}
                                        >
                                            <i className={`${icons[dept]} me-2 fs-6 text-secondary`}></i>
                                            {dept}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-md-9">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center text-light new-emp-bg">
                            <span>{selectedDepartment}</span>
                        </div>
                        <div className="card-body p-3">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpDetails;
