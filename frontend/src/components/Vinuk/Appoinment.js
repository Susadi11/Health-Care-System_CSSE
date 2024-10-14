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
        const response = await fetch("http://localhost:5555/appointmentRoute/appointments");
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
              borderColor: "#3b82f6", // Tailwind's blue-500 color
              backgroundColor: "rgba(59, 130, 246, 0.2)", // Slight background fill
              pointBackgroundColor: "#3b82f6", // Blue points
              pointBorderColor: "#fff",
              pointRadius: 5,
              pointHoverRadius: 7,
              borderWidth: 2,
              tension: 0.3, // Smooth curve
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
    maintainAspectRatio: false, // Allow custom height and width
    scales: {
      x: {
        title: {
          display: true,
          text: "Hour of the Day",
          font: { size: 16, weight: "bold" },
          color: "#1f2937", // Tailwind's gray-800 color
        },
        grid: {
          display: false, // Remove vertical grid lines
        },
        ticks: {
          color: "#1f2937", // Tailwind's gray-800 color
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Appointments",
          font: { size: 16, weight: "bold" },
          color: "#1f2937", // Tailwind's gray-800 color
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)", // Light grid lines for Y-axis
        },
        ticks: {
          stepSize: 1,
          color: "#1f2937", // Tailwind's gray-800 color
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: { size: 14 },
          color: "#1f2937", // Tailwind's gray-800 color
        },
      },
      tooltip: {
        backgroundColor: "#3b82f6", // Tailwind's blue-500 color
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Appointments by Hour</h2>
      <div className="h-[500px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AppointmentChart;
