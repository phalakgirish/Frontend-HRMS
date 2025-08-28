import React from "react";

const BasicInformationForm = ({ form, setForm, handleSubmit }) => {

    return (
        <div>
            <h6 className="mb-3">Basic Information</h6>
            <div className="container-fluid mt-4">
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
            </div>
        </div>

    );
};

export default BasicInformationForm;
