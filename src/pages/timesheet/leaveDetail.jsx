import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useLocation } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const LeaveDetail = () => {

    const location = useLocation();
    //    const [selectedDepartment, setSelectedDepartment] = useState('Basic Information');
    const employee = location.state?.employee;
    const [description, setDescription] = useState('Approved');
    const leaveStats = [
        { type: 'Casual Leave', taken: 0, total: 15 },
        { type: 'Medical Leave', taken: 1, total: 2 },
        { type: 'Maternity Leave', taken: 50, total: 90 },
        { type: 'Half Day', taken: 2, total: 5 },
        { type: 'COM OFF', taken: 4, total: 10 },
        { type: 'Casual Leave', taken: 0, total: 10 },
        { type: 'Sick Leave', taken: 6, total: 10 },
        { type: 'Medical Leave', taken: 0, total: 5 },
        { type: 'Earning Leave', taken: 0, total: 57.75 },
    ];

    return (
        <div className="custom-container">
            <h5>Leave Detail</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Leave Detail
            </p>

            <div className="row">
                <div className="col-md-4 mb-3">
                    <div className="card no-radius">
                        <div className="card-header text-white new-emp-bg fw-bold">Leave Detail</div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <strong>Employee: {employee?.employee || 'N/A'}</strong>
                            </li>
                            <li className="list-group-item">
                                <strong>Leave Type: {employee?.leaveType || 'N/A'}</strong>
                            </li>

                            <li className="list-group-item">
                                <strong>Applied On: {employee?.requestDuration || 'N/A'}</strong>
                            </li>

                            <li className="list-group-item">
                                <strong>Start Date: {employee?.appliedOn || 'N/A'}</strong>
                            </li>

                            <li className="list-group-item">
                                <strong>End Date: {employee?.endDate || 'N/A'}</strong>
                            </li>

                            <li className="list-group-item">
                                <strong>No. of Days: {employee?.days || 'N/A'}</strong>
                            </li>
                        </ul>
                    </div>
                </div>


                <div className="col-md-4 mb-3">
                    <div className="card no-radius">
                        <div className="card-header text-white new-emp-bg fw-bold">Update Status</div>
                        <div className="card-body">
                            <form>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label>Status</label>
                                            <select id="status" className="form-control">
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label>Remarks</label>
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={description}
                                                onChange={(event, editor) => {
                                                    const newData = editor.getData();
                                                    setDescription(newData);
                                                }}
                                            />
                                        </div>

                                        <div className="text-start mb-2">
                                            <button type="submit" className="btn btn-sm add-btn">Save</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card no-radius">
                        <div className="card-header text-white new-emp-bg fw-bold">Leave Statistics of</div>
                        <div className="card-body mt-2">
                            {leaveStats.map((item, index) => {
                                const percent = (item.taken / item.total) * 100;
                                return (
                                    <div key={index} className="mb-3">
                                        <div className="fw-semibold small">{item.type} ({item.taken}/{item.total})</div>
                                        <div className="progress mt-2" style={{ height: '8px' }}>
                                            <div
                                                className="progress-bar bg-secondary"
                                                role="progressbar"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default LeaveDetail;
