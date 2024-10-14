import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AppointmentChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // Step 1: Fetch appointments from the backend route
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("https://health-care-system-csse.vercel.app/appointmentRoute/appointments");
        const appointments = await response.json();

        // Step 2: Process the data to group by hour (using the `time` field)
        const hourlyCounts = processAppointmentsByHour(appointments);

        // Step 3: Prepare the data for the chart
        const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`); // 0:00 to 23:00
        const data = labels.map((hour) => hourlyCounts[hour] || 0); // Fill missing hours with 0

        setChartData({
          labels,
          datasets: [
            {
              label: "Number of Appointments",
              data: data,
              borderColor: "blue",
              fill: false,
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Helper function to group appointments by hour using the `time` field
  const processAppointmentsByHour = (appointments) => {
    const counts = {};

    appointments.forEach((appointment) => {
      const [hour] = appointment.time.split(":"); // Extract hour from `time` (e.g., "08:30" -> "08")
      const parsedHour = parseInt(hour, 10); // Convert to integer
      counts[`${parsedHour}:00`] = (counts[`${parsedHour}:00`] || 0) + 1; // Increment the count for the hour
    });

    return counts;
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Hour of the Day",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Appointments",
        },
        ticks: {
          stepSize: 1, // Customize this if needed
        },
      },
    },
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-center text-2xl font-bold mb-4">Appointments by Hour</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AppointmentChart;
