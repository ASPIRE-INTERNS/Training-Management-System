export const calculateAttendanceSummary = (records) => {
  const presentCount = records.filter(r => r.status === 'Present').length;
  const absentCount = records.filter(r => r.status === 'Absent').length;
  const total = records.length;
  const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return {
    presentCount,
    absentCount,
    total,
    percentage
  };
};
