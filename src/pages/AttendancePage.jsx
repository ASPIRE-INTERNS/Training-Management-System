// client/src/pages/AttendancePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AttendancePage = () => {
  const { currentUser } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Different views based on role
  const isTrainee = currentUser?.role === 'trainee';
  const isTrainer = currentUser?.role === 'trainer';

  useEffect(() => {
    // Simulate fetching attendance data
    const fetchAttendanceData = async () => {
      try {
        // In a real app, you would call an API here
        setTimeout(() => {
          const mockData = [
            {
              id: 1,
              courseTitle: 'Introduction to React',
              date: '2025-05-02',
              status: 'Present',
              traineeName: isTrainer ? 'John Doe' : undefined
            },
            {
              id: 2,
              courseTitle: 'Advanced JavaScript',
              date: '2025-05-05',
              status: 'Absent',
              traineeName: isTrainer ? 'Jane Smith' : undefined
            },
            {
              id: 3,
              courseTitle: 'Node.js Fundamentals',
              date: '2025-05-08',
              status: 'Present',
              traineeName: isTrainer ? 'Mike Johnson' : undefined
            }
          ];
          setAttendanceData(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setError('Failed to load attendance data. Please try again later.');
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [isTrainer]);

  const renderTraineeView = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Attendance</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceData.map(record => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {record.courseTitle}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    record.status === 'Present' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Attendance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <span className="block text-3xl font-bold text-green-600">
              {attendanceData.filter(r => r.status === 'Present').length}
            </span>
            <span className="text-gray-600">Present</span>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <span className="block text-3xl font-bold text-red-600">
              {attendanceData.filter(r => r.status === 'Absent').length}
            </span>
            <span className="text-gray-600">Absent</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <span className="block text-3xl font-bold text-blue-600">
              {attendanceData.length > 0 
                ? Math.round((attendanceData.filter(r => r.status === 'Present').length / attendanceData.length) * 100) 
                : 0}%
            </span>
            <span className="text-gray-600">Attendance Rate</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrainerView = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>
      
      <div className="mb-6 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Record Attendance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Select Course</option>
              <option value="1">Introduction to React</option>
              <option value="2">Advanced JavaScript</option>
              <option value="3">Node.js Fundamentals</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
              Take Attendance
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Attendance Records</h2>
          <select className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="all">All Courses</option>
            <option value="1">Introduction to React</option>
            <option value="2">Advanced JavaScript</option>
            <option value="3">Node.js Fundamentals</option>
          </select>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trainee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceData.map(record => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {record.traineeName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {record.courseTitle}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    record.status === 'Present' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Loading attendance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {isTrainee ? renderTraineeView() : renderTrainerView()}
    </div>
  );
};

export default AttendancePage;