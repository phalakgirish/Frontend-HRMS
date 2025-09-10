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
import BankAccount from './details.jsx/BankAccount';
import Leave from './details.jsx/Leave';
import Shift from './details.jsx/Shift';
// import Location from './details.jsx/Location';
import ChangePassword from './details.jsx/ChangePassword';
import Assets from './details.jsx/Assets';
import CTC from './details.jsx/CTC';
import Form16 from './details.jsx/Form16';
import EmpLocation from './details.jsx/EmpLocation';

const EmpDetails = () => {
    const location = useLocation();
    const [selectedDepartment, setSelectedDepartment] = useState('Basic Information');
    const { employee,mode="edit" } = location.state || {};
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
                return <BasicInformationForm employeeId={form._id} form={form} setForm={setForm} handleSubmit={handleSubmit} mode={mode} />;

            case 'Profile Picture':
                return <ProfilePicture employeeId={form._id} form={form} setForm={setForm} handleSubmit={handleSubmit} mode={mode} />;

            case 'Family Details':
                return <FamilyDetails employeeId={form._id} form={form} setForm={setForm} handleSubmit={handleSubmit} mode={mode} />;

            case 'Document':
                return <Document employeeId={form._id} form={form} setForm={setForm} handleSubmit={handleSubmit} mode={mode} />;

            case 'Qualification':
                return <Qualification employeeId={form._id}  form={form} setForm={setForm} handleSubmit={handleSubmit} mode={mode} />;

            case 'Work Experience':
                return <WorkExperience employeeId={form._id}  form={form} setForm={setForm} handleSubmit={handleSubmit} mode={mode} />;

            case 'Bank Account':
                return <BankAccount employeeId={form._id} form={form} setForm={setForm} handleSubmit={handleSubmit} mode={mode} />;

            case 'Leave':
                return <Leave form={form} setForm={setForm} handleSubmit={handleSubmit} mode={mode} />

            case 'Shift':
                return <Shift employeeId={form._id} form={form} setForm={setForm} handleSubmit={handleSubmit} mode={mode} />

            case 'EmpLocation':
                return <EmpLocation employeeId={form._id} form={form} setForm={setForm} handleSubmit={handleSubmit} mode={mode} />


            case 'Change Password':
                return <ChangePassword employeeId={form._id} form={form} setForm={setForm} handleSubmit={handleSubmit} mode={mode} />

            case 'Assets':
                return <Assets employeeId={form._id} form={form} setForm={setForm} handleSubmit={handleSubmit} mode={mode} />

            case 'CTC':
                return <CTC form={form} setForm={setForm} handleSubmit={handleSubmit} mode={mode} />

                 case 'Form 16':
                return <Form16 form={form} setForm={setForm} handleSubmit={handleSubmit} mode={mode} />

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
                                    'Qualification', 'Work Experience', 'Bank Account', 'Leave', 'Shift', 'EmpLocation',
                                    'Change Password', 'Assets', 'CTC', 'Form 16'
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
                                        'EmpLocation': 'fas fa-map-marker-alt',
                                        'Change Password': 'fas fa-key',
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
