'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ViewAppointment = () => {
  const router = useRouter();
  const {id} = useParams()
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchAppointment = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        try {
          const response = await fetch(`/api/view-appointment/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`, // Include 'Bearer ' if using JWT
            },
          });

          if (!response.ok) {
            router.push('/my-appointments')
            throw new Error('Failed to fetch appointment');
            
          }

          const data = await response.json();
          console.log(data)
          if (data.error) {
            setError(data.error);
          } else {
            setAppointment(data);
          }
        } catch (error) {
          console.error('Error fetching appointment:', error);
          setError('Failed to load appointment');
        } finally {
          setLoading(false);
        }
      };

      fetchAppointment();
    }
  },[id,router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Appointment Details</h1>
        <div className="space-y-4">
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Patient:</span> {appointment?.patient?.name}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Doctor Name:</span> {appointment?.doctor?.name}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Doctor Specialty:</span> {appointment?.doctor?.specialty}
          </p>
          <p className="text-lg">
  <span className="font-semibold text-gray-700">Date Scheduled:</span> 
  {appointment?.date ? new Date(appointment.date).toLocaleString('en-US', { 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true, 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : 'Loading...'}
</p>

          <p className="text-lg">
            <span className="font-semibold text-gray-700">Status:</span> {appointment?.status}
          </p>
        </div>
        <div className="relative">
  {/* Truncated text area */}
  <textarea
    style={{ height: "auto", cursor: "pointer" }} 
    className="w-full h-24 p-4 bg-gray-100 border border-gray-300 rounded-md resize-none focus:outline-none text-lg"
    readOnly
    value={appointment?.reason?.substring(0, 100) + (appointment?.reason.length > 100 ? "..." : "")}
    title="Reason for Appointment:"
    rows="4" // Larger height for truncated view
  />

  {/* Full text on hover */}
  <div className="absolute inset-0 w-full p-4 bg-white border border-gray-300 rounded-md shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out z-10 overflow-auto max-h-[50vh]" 
       style={{ whiteSpace: "pre-wrap" }}>
    <textarea
      className="w-full p-4 bg-transparent border-none resize-none overflow-auto focus:outline-none text-lg"
      readOnly
      value={appointment?.reason}
      rows="15" // Increased rows for more visible content
      style={{ height: "auto", cursor: "default" }}
    />
  </div>
</div>





        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/my-appointments')}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAppointment;
