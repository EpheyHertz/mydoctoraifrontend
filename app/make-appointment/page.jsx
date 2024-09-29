'use client';
import { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../utils/auth';
import ProtectedRoute from '../components/ProtectedRoute';

const BookAppointmentPage = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/auth/login');
      }
    };
    checkAuth();
  }, [router]);

  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(''); // Set initial state as empty string
  const [appointmentTime, setAppointmentTime] = useState(''); // State for time input
  const [reason, setReason] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get('https://doctorai-cw25.onrender.com/apis/doctors/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDoctors(data);
        const uniqueSpecialties = [...new Set(data.map(doctor => doctor.specialty))];
        setSpecialties(uniqueSpecialties);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };

    fetchDoctors();
  }, [token]);

  useEffect(() => {
    if (selectedSpecialty) {
      const filtered = doctors.filter(doctor => doctor.specialty === selectedSpecialty);
      setFilteredDoctors(filtered);
    }
  }, [selectedSpecialty, doctors]);

  const handleDateChange = (e) => {
    setAppointmentDate(e.target.value); // Store date as a string
  };

  const handleTimeChange = (e) => {
    setAppointmentTime(e.target.value); // Store time as a string
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (reason.length < 30) {
      alert('Reason must be at least 30 words long.');
      return;
    }
    if (!appointmentDate || !appointmentTime) {
      alert('Please select both date and time for the appointment.');
      return;
    }

    // Combine date and time
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    console.log('Selected Date:', appointmentDate);
    console.log('Selected Time:', appointmentTime);
    console.log('Combined DateTime:', appointmentDateTime.toISOString());

    try {
      await axios.post(
        'https://doctorai-cw25.onrender.com/apis/book-appointment/',
        {
          doctor_username: selectedDoctor,
          date: appointmentDateTime.toISOString(),
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Appointment booked successfully!');
      setSelectedSpecialty('');
      setSelectedDoctor('');
      setAppointmentDate('');
      setAppointmentTime('');
      setReason('');
      router.push('/my-appointment')
    } catch (error) {
      console.error('Failed to book appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="container">
        <div className="form-card">
          <h2>Book an Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="specialty">Specialty</label>
              <select
                id="specialty"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                required
              >
                <option value="">Select Specialty</option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="doctor">Doctor</label>
              <select
                id="doctor"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
                disabled={!selectedSpecialty}
              >
                <option value="">Select Doctor</option>
                {filteredDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="appointmentDate">Appointment Date</label>
              <input
                type="date"
                id="appointmentDate"
                value={appointmentDate}
                onChange={handleDateChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="appointmentTime">Appointment Time</label>
              <input
                type="time"
                id="appointmentTime"
                value={appointmentTime}
                onChange={handleTimeChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason for Appointment</label>
              <textarea
                id="reason"
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please describe your symptoms, include your age and other medical details if possible. Minimum 30 words."
                required
              />
            </div>

            <button className="submit-btn" type="submit">Book Appointment</button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .form-card {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        h2 {
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          font-size: 16px;
          margin-bottom: 8px;
        }

        select,
        input[type="date"],
        input[type="time"],
        textarea {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border-radius: 4px;
          border: 1px solid #ccc;
          outline: none;
          transition: border-color 0.3s ease;
        }

        select:focus,
        input[type="date"]:focus,
        input[type="time"]:focus,
        textarea:focus {
          border-color: #0070f3;
        }

        textarea {
          resize: vertical;
        }

        .submit-btn {
          display: block;
          width: 100%;
          padding: 12px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
          background-color: #005bb5;
        }
      `}</style>
    </ProtectedRoute>
  );
};

export default BookAppointmentPage;
