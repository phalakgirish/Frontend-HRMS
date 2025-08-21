import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';



const TrainingDetail = () => {

    const location = useLocation();
    const employee = location.state?.employee;

    const [description, setDescription] = useState('Approved');
    const employeesList = location.state?.employeesList || [];

    useEffect(() => {
        console.log('Employee from location.state:', employee);
    }, [employee]);


    return (
        <div className="custom-container">
            <h5>Training Details</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Training Details
            </p>

            <div className="row">
                <div className="col-md-4 mb-3">
                    <div className="card no-radius">
                        <div className="card-header text-white new-emp-bg fw-bold">Training Details</div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <strong>Training Type: {employee?.trainingType}</strong>
                            </li>
                            <li className="list-group-item">
                                <strong>Trainer: {employee?.trainer}</strong>
                            </li>

                            <li className="list-group-item">
                                <strong>Training Cost: {employee?.trainingCost}</strong>
                            </li>

                            <li className="list-group-item">
                                <strong>Start Date: {employee?.startDate}</strong>
                            </li>

                            <li className="list-group-item">
                                <strong>End Date: {employee?.endDate}</strong>
                            </li>

                            <li className="list-group-item">
                                <strong>Description: {employee?.description}</strong>
                            </li>

                        </ul>
                    </div>
                </div>



                <div className="col-md-4 mb-3">
                    <div className="card no-radius">
                        <div className="card-header text-white new-emp-bg fw-bold">
                            Details
                        </div>
                       <div className="card-body">
  <h6 className="fw-bold mb-3 border-bottom pb-1">Training Employees</h6>

  {employee?.employee && employee.employee.length > 0 ? (
    employee.employee.map((emp, index) => (
      <div key={index} className="d-flex align-items-center mb-2">
        <img
          src="/avatar.png" // same avatar for all, unless you have employee-specific avatars
          alt="avatar"
          className="rounded-circle me-2"
          width="32"
          height="32"
        />
        <strong>{emp}</strong>
      </div>
    ))
  ) : (
    <p className="text-muted">No employees assigned</p>
  )}
</div>


                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card no-radius">
                        <div className="card-header text-white new-emp-bg fw-bold">
                            Details
                        </div>
                        <div className="card-body">
                            <h6 className="fw-bold mb-3 border-bottom pb-1">Update Status</h6>
                            <form>
                                <div className="mb-3">
                                    <label className="fw-semibold">Performance</label>
                                    <select id="performance" className="form-control">
                                        <option value="not-conclude">Not Concluded</option>
                                        <option value="satisfactory">Satisfactory</option>
                                        <option value="avg">Average</option>
                                        <option value="poor">Poor</option>
                                        <option value="excellent">Excellent</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="fw-semibold">Status</label>
                                    <select id="status" className="form-control">
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        placeholder="Remarks"
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="text-start">
                                    <button type="submit" className="btn btn-sm add-btn">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>


        </div>
    );
};

export default TrainingDetail;
