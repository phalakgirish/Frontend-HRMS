import StatCard from '../pages/cards/StatCard';
import NewEmployees, { BirthdayList, WorkAnniversaryList, RecruitmentTimeline, TodayAttendance, CompanyWisesalaries, StationWisesalaries, DepartmentWisesalaries, DesignationWisesalaries } from '../pages/cards/NewEmployees';
import './dashboard.css';


const Dashboard = () => {
    return (
        <div className="custom-container">
            <h5>Dashboard</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}><span style={{ color: 'red' }}>Home</span> / Dashboard</p>


            <div className="row g-3 mb-4">
                <StatCard value="32" label="TOTAL EMPLOYEES" icon="user" valueColor="#fff" labelColor="#fff" iconColor="rgba(219, 219, 219, 0.71)" index={0} />
                <StatCard value="Rs.50900" label="TOTAL EXPENSES" icon="chart-line" valueColor="#fff" labelColor="#fff" iconColor="rgba(219, 219, 219, 0.71)" index={1} />
                <StatCard value="Rs.335322" label="TOTAL SALARIES PAID" icon="wallet" valueColor="#fff" labelColor="#fff" iconColor="rgba(219, 219, 219, 0.71)" index={2} />
                <StatCard value="1" label="TOTAL JOBS" icon="file-invoice" valueColor="#fff" labelColor="#fff" iconColor="rgba(219, 219, 219, 0.71)" index={3} />
            </div>

            <div className="row g-3 mb-4">
                <StatCard value="11" label="TOTAL DEPARTMENTS" icon="th" valueColor="navy" labelColor="red" iconColor="rgba(189, 72, 72, 0.574)" />
                <StatCard value="1" label="TOTAL PROJECTS" icon="folder-open" valueColor="navy" labelColor="green" iconColor="rgba(189, 72, 72, 0.574)" />
                <StatCard value="2" label="TOTAL LOCATIONS" icon="map-marker-alt" valueColor="navy" labelColor="blue" iconColor="rgba(189, 72, 72, 0.574)" />
                <StatCard value="1" label="TOTAL COMPANIES" icon="building" valueColor="navy" labelColor="blue" iconColor="rgba(189, 72, 72, 0.574)" />
            </div>




            <div className="row g-3">
                <div className="col-md-6">
                    <NewEmployees />
                </div>

                <div className="col-md-6">
                    <RecruitmentTimeline />
                </div>

                <div className="col-md-6">
                    <BirthdayList />
                </div>

                 <div className="col-md-6">
                    <WorkAnniversaryList />
                </div>

                <div className="col-md-12">
                    <TodayAttendance />
                </div>

                <div className="col-md-6">
                    <CompanyWisesalaries />
                </div>

                <div className="col-md-6">
                    <StationWisesalaries />
                </div>

                <div className="col-md-6">
                    <DepartmentWisesalaries />
                </div>

                <div className="col-md-6">
                    <DesignationWisesalaries />
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
