import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import './timesheet.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';



const ImportAttendance = () => {

    return (
        <div className="custom-container">
            <h5>Import Attendance</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Import Attendance
            </p>


            <div className="card no-radius">
                <div className="card-header text-dark">Import CSV File Only</div>
                <div className="card-body d-flex align-items-start">
                    <div style={{ color: 'grey', fontSize: '14px' }}>
                        <p>The first line in downloaded csv file should remain as it is. Please do not change the order of columns in csv file.</p>
                        <p> The correct column order is (Employee ID, Attendance Date, Clock In Time and Date, Clock Out Time and Date) and you must follow the csv file, otherwise you will get an error while importing the csv file.</p>
                    </div>
                </div>

                <div className='text-start'>
                    <button className='btn btn-sm down-btn mb-2 ms-2'>
                        <i className="fas fa-download me-1"></i> Download Sample File
                    </button>
                </div>

                <div className='cont'>
                    <p>Upload File</p>
                    <button type="submit" className="btn btn-sm add-btn">Browse</button>
                    <p style={{ fontSize: '10px' }}>Please select csv or excel file (allowed file size 500 KB)</p>
                    <button type="submit" className="btn btn-sm add-btn">Import</button>
                </div>

            </div>

        </div>
    );
};

export default ImportAttendance;
