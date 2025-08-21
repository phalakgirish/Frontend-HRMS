import DataTable from 'react-data-table-component';
import React, { useState } from 'react';


const employees = [
  { name: 'Manoj Ghate', title: 'IT Manager' },
  { name: 'Aashita Solanki', title: 'Asst. Dealer' },
  { name: 'Eshanee Rongare', title: 'Senior Executive' },
  { name: 'Rutuja Pawar', title: 'HR Manager' },
];

const NewEmployees = () => {
  return (
    <div className="card no-radius">
      <div className="card-header text-white new-emp-bg">New Employees</div>
      <div className="card-body p-0">
        <ul className="list-group list-group-flush">
          {employees.map((emp, idx) => (
            <li className="list-group-item d-flex align-items-center" key={idx}>
              <img src="./avatar2.jpg" className="avatar-img2 me-3" alt="avatar" />
              <div>
                <strong>{emp.name}</strong>
                <div className="text-muted" style={{ fontSize: '14px' }}>{emp.title}</div>
              </div>
            </li>
          ))}
          <div className="p-2">
            <button className="btn btn-primary w-100 show-more-btn">Show More</button>
          </div>
        </ul>

      </div>
    </div>
  );
};

export default NewEmployees;




export const RecruitmentTimeline = () => {
  return (
    <div className="card no-radius">
      <div className="card-header new-emp-bg text-white">Recruitment Timeline</div>
      <div className="card-body d-flex align-items-start">
        <img src="avatar.webp" className="avatar-img me-3 mt-1" alt="avatar" />
        <div>
          <strong>Admin Admin</strong> applied for <strong>Software Engineer</strong> Position
          <div className="text-muted" style={{ fontSize: '13px' }}>
            August 12, 2021, 12:36 pm
          </div>
        </div>
      </div>
    </div>
  );
};




export const BirthdayList = () => {
  return (
    <div className="card no-radius">
      <div className="card-header text-white new-emp-bg">Birthday List</div>
      <div className="card-body d-flex align-items-start">
      </div>
    </div>
  )
}



export const WorkAnniversaryList = () => {
  return (
    <div className="card no-radius">
      <div className="card-header text-white new-emp-bg">Work Anniversary List</div>
      <div className="card-body d-flex align-items-start">
      </div>
    </div>
  )
}


const columns = [
  { name: 'Status', selector: row => row.status, sortable: true },
  { name: 'Employee', selector: row => row.employee, sortable: true },
  { name: 'Clock IN', selector: row => row.clockIn },
  { name: 'Clock Out', selector: row => row.clockOut },
  { name: 'Late', selector: row => row.late },
  { name: 'Early Leaving', selector: row => row.earlyLeaving },
  { name: 'Overtime', selector: row => row.overtime },
  { name: 'Total Work', selector: row => row.totalWork },
  { name: 'Total Rest', selector: row => row.totalRest },
];

const data = [
  {
    status: 'Absent',
    employee: 'Admin Admin',
    clockIn: '-',
    clockOut: '-',
    late: '00:00',
    earlyLeaving: '00:00',
    overtime: '00:00',
    totalWork: '00:00',
    totalRest: '00:00'
  },
  {
    status: 'Present',
    employee: 'Jane Doe',
    clockIn: '09:05',
    clockOut: '17:00',
    late: '00:05',
    earlyLeaving: '00:00',
    overtime: '00:30',
    totalWork: '07:55',
    totalRest: '01:00'
  },
  // Add more if needed
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


export const TodayAttendance = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalEntries = data.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);

  return (
    <div className="card no-radius">
      <div className="card-header text-white new-emp-bg">Today Attendance</div>


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
              <div className="d-flex">
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


    </div>
  );
};








export const CompanyWisesalaries = () => {
  return (
    <div className="card no-radius">
      <div className="card-header text-white new-emp-bg">Company Wise Salaries</div>
      <div className="card-body d-flex align-items-start">
        <ul className="list-group list-group-flush">
          <br /><br /><br /><br /><br /><br /><br /><br /><br />
        </ul>
      </div>
    </div>
  )
}


export const StationWisesalaries = () => {
  return (
    <div className="card no-radius">
      <div className="card-header text-white new-emp-bg">Station Wise Salaries</div>
      <div className="card-body d-flex align-items-start">
        <br /><br /><br /><br /><br /><br /><br /><br /><br />

      </div>
    </div>
  )
}

export const DepartmentWisesalaries = () => {
  return (
    <div className="card no-radius">
      <div className="card-header text-white new-emp-bg">Department Wise Salaries</div>
      <div className="card-body d-flex align-items-start">
        <br /><br /><br /><br /><br /><br /><br /><br /><br />

      </div>
    </div>
  )
}


export const DesignationWisesalaries = () => {
  return (
    <div className="card no-radius">
      <div className="card-header text-white new-emp-bg">Designation Wise Salaries</div>
      <div className="card-body d-flex align-items-start">
        <br /><br /><br /><br /><br /><br /><br /><br /><br />

      </div>
    </div>
  )
}