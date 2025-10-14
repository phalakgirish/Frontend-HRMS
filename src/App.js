import './App.css';
import Sidebar from './components/sidebar';
import Topbar from './components/topbar';
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Location from './pages/organization/Location';
import Department from './pages/organization/Department';
import Policies from './pages/more/policies';
import Designation from './pages/organization/Designation';
import Announcements from './pages/organization/Announcements';
import OrgPolicies from './pages/organization/OrgPolicies';
import Expense from './pages/organization/Expense';
import EmailTemplates from './pages/more/email-templates.';
import DatabaseBackup from './pages/more/database-backup';
import Employees from './pages/employees/employees';
import Awards from './pages/employees/awards';
import Transfers from './pages/employees/transfers';
import Resignations from './pages/employees/resignations';
import Travels from './pages/employees/travels';
import Promotions from './pages/employees/promotions';
import Complaints from './pages/employees/complaints';
import Warnings from './pages/employees/warnings';
import Terminations from './pages/employees/terminations';
import EmployeeLastLogin from './pages/employees/employees-last-login';
import Employeeexit from './pages/employees/employees-exit';
import PerformanceIndicator from './pages/performance/performance-indicator';
import PerformanceAppraisal from './pages/performance/performance-appraisal';
import Attendance from './pages/timesheet/attendance';
import DatewiseAttendance from './pages/timesheet/datewise-attendance';
import UpdateAttendance from './pages/timesheet/update-attendance';
import ImportAttendance from './pages/timesheet/import-attendance';
import Leave from './pages/timesheet/leave';
import OfficeShifts from './pages/timesheet/office-shifts';
import Holidays from './pages/timesheet/holidays';
import ManageSalary from './pages/payroll/manage-salary';
import PaymentHistory from './pages/payroll/payment-history';
import Payslip from './pages/payroll/payslip';
import GeneratePayslip from './pages/payroll/generate-payslip';
import Projects from './pages/projects';
import SupportRequest from './pages/support-request';
import JobCandidates from './pages/recruitment/job-candidates';
import OfferLetter from './pages/recruitment/offer';
import AppointmentLetter from './pages/recruitment/appointment';
import AccountStatement from './pages/reports/account-statement';
import ExpenseReport from './pages/reports/expense-report';
import IncomeReport from './pages/reports/income-report';
import TransferReport from './pages/reports/transfer-report';
import TrainingList from './pages/training/training-list';
import TrainersList from './pages/training/trainers-list';
import TrainingType from './pages/training/training-type';
import SetRoles from './pages/more/setroles';
import FilesManager from './pages/filesmanager';
import EmpDetails from './pages/employees/empDetails';
import LeaveDetail from './pages/timesheet/leaveDetail';
import TicketDetail from './pages/ticketDetail';
import ProjectDetails from './pages/projectDetails';
import SettingPage from './pages/more/setting-page';
import Constants from './pages/more/constants';
import Login from './Login/Login-page';
import TrainingDetail from './pages/training/trainingDetail';
import PrivateRoute from './Login/privateRoute';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Qualification from './pages/employees/details.jsx/Qualification';
import WorkExperience from './pages/employees/details.jsx/WorkExperience';
import Document from './pages/employees/details.jsx/Document';
import BankAccount from './pages/employees/details.jsx/BankAccount';
import FamilyDetails from './pages/employees/details.jsx/FamilyDetails';
import Shift from './pages/employees/details.jsx/Shift';
import EmpLocation from './pages/employees/details.jsx/EmpLocation';
import Assets from './pages/employees/details.jsx/Assets';
import ProfilePicture from './pages/employees/details.jsx/ProfilePicture';
import BasicInformationForm from './pages/employees/details.jsx/BasicInformation';
import ChangePassword from './pages/employees/details.jsx/ChangePassword';
import PayrollMonthly from './pages/payroll/payroll-monthly';
import Directory from './pages/directory';

function Layout({ children, collapsed, toggleSidebar }) {
  const location = useLocation();
  const hideLayoutForPaths = ['/'];
  const shouldHideLayout = hideLayoutForPaths.includes(location.pathname);

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Topbar onToggleSidebar={toggleSidebar} />
      <div style={{ display: 'flex' }}>
        <Sidebar collapsed={collapsed} />
        <div
          className="main-content"
          style={{
            marginLeft: collapsed ? '90px' : '225px',
            padding: '20px',
            transition: 'margin-left 0.3s ease',
            width: '100%',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

function App() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const CustomToast = ({ message }) => (
    <div style={{
      backgroundColor: "#1e293b",
      color: "white",
      padding: "10px 15px",
      borderRadius: "8px",
      fontSize: "14px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
    }}>
      ✅ {message}
    </div>
  );

  const showCustomToast = () => {
    toast(<CustomToast message="Data saved successfully!" />, {
      icon: false, // disable default icon
    });
  };

  return (
    <Layout collapsed={collapsed} toggleSidebar={toggleSidebar}>
      <Routes>

        {/* <Route path="/" element={<Login />} /> */}

        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        <Route path="/" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Organization */}

          <Route path="/location" element={<Location />} />
          <Route path="/department" element={<Department />} />
          <Route path="/designation" element={<Designation />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/orgpolicies" element={<OrgPolicies />} />
          <Route path="/expense" element={<Expense />} />

          {/* Employees */}
          <Route path="/employees" element={<Employees />} />
          <Route path="/empDetails/:employeeId" element={<EmpDetails />} />
          <Route path="/empDetails/:employeeId/basicinfo" element={<BasicInformationForm />} />
          <Route path="/empDetails/:employeeId/familydetails" element={<FamilyDetails />} />
          <Route path="/empDetails/:employeeId/qualification" element={<Qualification />} />
          <Route path="/empDetails/:employeeId/experience" element={<WorkExperience />} />
          <Route path="/empDetails/:employeeId/document" element={<Document />} />
          <Route path="/empDetails/:employeeId/bankaccount" element={<BankAccount />} />
          <Route path="/empDetails/:employeeId/shift" element={<Shift />} />
          <Route path="/empDetails/:employeeId/location" element={<EmpLocation />} />
          <Route path="/empDetails/:employeeId/assets" element={<Assets />} />
          <Route path="/empDetails/:employeeId/profilepicture" element={<ProfilePicture />} />
          <Route path="/empDetails/:employeeId/changepassword" element={<ChangePassword />} />



          <Route path="/awards" element={<Awards />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/resignations" element={<Resignations />} />
          <Route path="/travels" element={<Travels />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/warnings" element={<Warnings />} />
          <Route path="/terminations" element={<Terminations />} />
          <Route path="/lastLogin" element={<EmployeeLastLogin />} />
          <Route path="/employeeExit" element={<Employeeexit />} />

          {/* Performance */}
          <Route path="/performanceIndicator" element={<PerformanceIndicator />} />
          <Route path="/performanceAppraisal" element={<PerformanceAppraisal />} />

          {/* Attendance */}
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/datewiseattendance" element={<DatewiseAttendance />} />
          <Route path="/updateattendance" element={<UpdateAttendance />} />
          <Route path="/importattendance" element={<ImportAttendance />} />
          <Route path="/leaves" element={<Leave />} />
          <Route path="/leaveDetail/:id" element={<LeaveDetail />} />
          <Route path="/officeshifts" element={<OfficeShifts />} />
          <Route path="/holidays" element={<Holidays />} />

          {/* Payroll */}
          <Route path="/managesalary" element={<ManageSalary />} />
          <Route path="/generatepayslip" element={<GeneratePayslip />} />
          <Route path="/payroll-monthly/:empId" element={<PayrollMonthly />} />
          <Route path="/paymenthistory" element={<PaymentHistory />} />
          <Route path="/payslip/:empId" element={<Payslip />} />

          {/* Projects */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/projectDetails/:id" element={<ProjectDetails />} />

          {/* Support */}
          <Route path="/supportrequest" element={<SupportRequest />} />
          <Route path="/ticketDetail/:employee" element={<TicketDetail />} />

          {/* Files */}
          <Route path="/filesmanager" element={<FilesManager />} />

          {/* Employees Dirrectory */}
          <Route path="/directory" element={<Directory />} />


          {/* Recruitment */}
          <Route path="/jobcandidates" element={<JobCandidates />} />
          <Route path="/offer/:id" element={<OfferLetter />} />
          <Route path="/appointment/:id" element={<AppointmentLetter />} />

          {/* Reports */}
          <Route path="/accountstatements" element={<AccountStatement />} />
          <Route path="/expensereport" element={<ExpenseReport />} />
          <Route path="/incomereport" element={<IncomeReport />} />
          <Route path="/transferreport" element={<TransferReport />} />

          {/* Training */}
          <Route path="/traininglist" element={<TrainingList />} />
          <Route path="/trainingDetail/:trainer" element={<TrainingDetail />} />
          <Route path="/trainingtype" element={<TrainingType />} />
          <Route path="/trainerslist" element={<TrainersList />} />

          {/* More */}
          <Route path="/settingPage" element={<SettingPage />} />
          <Route path="/constants" element={<Constants />} />
          <Route path="/databasebackup" element={<DatabaseBackup />} />
          <Route path="/emailtemplates" element={<EmailTemplates />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/setroles" element={<SetRoles />} />
        </Route>
      </Routes>


      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        draggable
        theme="dark"
      />

      {/* <ToastContainer position="top-right" autoClose={2000} /> */}

    </Layout>


  );
}

export default App;
