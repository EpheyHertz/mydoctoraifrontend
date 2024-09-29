'use client';
import { isAuthenticated } from '../utils/auth';
import { useEffect, useState, useLayoutEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/ProtectedRoute';

const AppointmentsPage = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/auth/login');
      }
    };
    checkAuth();
  }, [router]);

  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const handleViewAppointment = (id) => {
    router.push(`view-appointment/${id}`);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUser = async () => {
      try {
        const { data } = await axios.get('https://doctorai-cw25.onrender.com/apis/user/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data);
        if (data.role === 'doctor') {
          fetchPatients(token);
          fetchAppointments(token);
        } else if (data.role === 'patient') {
          fetchAppointments(token);
          fetchDoctors(token);
        }
      } catch (error) {
        console.log('Failed to fetch user data:');
      }
    };

    fetchUser();
  }, []);

  const fetchPatients = async (token) => {
    try {
      const { data } = await axios.get('http://127.0.0.1:8000/apis/patients/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(data);
    } catch (error) {
      console.error('Failed to fetch patients:');
    }
  };

  const fetchAppointments = async (token) => {
    try {
      const { data } = await axios.get('https://doctorai-cw25.onrender.com/apis/my-appointments/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:');
    }
  };

  const fetchDoctors = async (token) => {
    try {
      const { data } = await axios.get('https://doctorai-cw25.onrender.com/apis/doctors/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(data);
    } catch (error) {
      console.error('Failed to fetch doctors:');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`https://doctorai-cw25.onrender.com/apis/cancel-appointment/${appointmentId}/`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAppointments(token);
    } catch (error) {
      console.error('Failed to cancel appointment:');
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {user?.role === 'doctor' && (
            <>
              <div>
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Patients</h2>
                  {patients.map((patient) => (
                    <div key={patient.id} className="bg-gray-100 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-semibold">{patient.name}</h3>
                      <p className="text-gray-600">{patient.email}</p>
                      <p className="text-gray-600">{patient.phone_number}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Appointments</h2>
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`p-4 rounded-lg mb-4 ${getStatusColor(appointment.status)}`}
                    >
                      <h3 className="text-lg font-semibold">{appointment.patient.username}</h3>
                      <p className="text-gray-600">{appointment.patient.email}</p>
                      <p className="text-gray-600">{appointment.patient.phone_number}</p>
                      <p className="text-gray-600">{new Date(appointment.date).toLocaleString()}</p>
                      <p className="text-gray-600">{appointment.status}</p>
                      <div className="mt-4 flex space-x-4">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                          onClick={() => handleViewAppointment(appointment.id)}
                        >
                          View Appointment
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {user?.role === 'patient' && (
            <>
              <div>
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Appointments</h2>
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`p-4 rounded-lg mb-4 ${getStatusColor(appointment.status)}`}
                    >
                      <h3 className="text-lg font-semibold">{appointment.patient.username}</h3>
                      <p className="text-gray-600">{appointment.patient.email}</p>
                      <p className="text-gray-600">{appointment.patient.phone_number}</p>
                      <p className="text-lg">
  <span className="font-semibold text-gray-700">Date:</span> 
  {appointment?.date ? new Date(appointment.date).toLocaleString('en-US', { 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true, 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }) : 'Loading...'}
</p>
                      <p className="text-gray-600">{appointment.status}</p>
                      <div className="mt-4 flex space-x-4">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                          onClick={() => handleViewAppointment(appointment.id)}
                        >
                          View Appointment
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Available Doctors</h2>
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="bg-gray-100 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-semibold">{doctor.name}</h3>
                      <p className="text-gray-600">Specialty: {doctor.specialty}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .bg-gray-100 {
          background-color: #f3f4f6;
        }
        .bg-gray-600 {
          background-color: #4b5563;
        }
      `}</style>
    </ProtectedRoute>
  );
};

// Helper function to get background color based on status
const getStatusColor = (status) => {
  switch (status) {
    case 'expired':
      return 'bg-gray-200'; // Light gray for overdue
    case 'scheduled':
      return 'bg-green-100'; // Light green for pending
    case 'cancelled':
      return 'bg-red-100'; // Light red for cancelled
    default:
      return 'bg-white'; // Default white background
  }
};

export default AppointmentsPage;
