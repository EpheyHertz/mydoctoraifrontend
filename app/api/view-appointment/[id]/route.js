// pages/api/appointments/[id].js

import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;
  const token = request.headers.get('Authorization')?.replace('Bearer ', ''); // Extract token from headers

  try {
    // Fetch all appointments for the user
    const appointmentsResponse = await fetch('http://localhost:8000/apis/my-appointments/', {
      headers: {
        'Authorization': `Bearer ${token}`, // Include 'Bearer ' if using JWT
      },
    });

    if (!appointmentsResponse.ok) {
      throw new Error('Failed to fetch appointments');
    }

    const appointments = await appointmentsResponse.json();

    // Find the appointment with the given ID
    const appointment = appointments.find(app => app.id === parseInt(id));

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json({ error: 'Failed to load appointment' }, { status: 500 });
  }
}
