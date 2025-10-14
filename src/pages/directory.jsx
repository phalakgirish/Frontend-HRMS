import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser } from 'react-icons/fa'; // for the black user icon

const Directory = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const empRes = await axios.get('http://localhost:3000/employee');
                setEmployees(empRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="p-4">
            <div className="custom-container mb-4">
                <h5 className="text-lg font-semibold">Employees Directory</h5>
                <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                    <span style={{ color: 'red' }}>Home</span> / Employees Directory
                </p>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                }}
            >
                {employees.map((emp) => (
                    <div
                        key={emp._id}
                        style={{
                            width: '400px',
                            height: '220px',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            padding: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                        }}
                        className="hover:shadow-md"
                    >
                        <div
                            style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                backgroundColor: '#e6e6e6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <img
                                src={
                                    emp.gender === 'male'
                                        ? 'maleavatar.png'
                                        : 'femaleavatar.png'
                                }
                                alt="avatar"
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>

                        <div
                            style={{
                                marginLeft: '10px',
                                flex: 1,
                                overflow: 'hidden',
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: '22px',
                                    fontWeight: '600',
                                    color: '#333',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {emp.name}
                            </h3>

                            <p style={{ fontSize: '15px', color: '#666' }}>
                                {emp.designation}
                            </p>
                            <p
                                style={{
                                    fontSize: '15px',
                                    color: '#777',
                                    whiteSpace: 'normal',
                                    wordWrap: 'break-word',
                                }}
                            >
                                {emp.address}
                            </p>

                            <p style={{ fontSize: '15px', color: '#555' }}>{emp.phone}</p>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '4px',
                                    gap: '6px',
                                }}
                            >
                                <FaUser size={10} color="black" />
                                <span
                                    style={{
                                        fontSize: '10px',
                                        padding: '2px 6px',
                                        borderRadius: '8px',
                                        color: 'white',
                                        backgroundColor:
                                            emp.status === 'Active' ? '#198754' : '#dc3545',
                                    }}
                                >
                                    {emp.status === 'Active' ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Directory;
