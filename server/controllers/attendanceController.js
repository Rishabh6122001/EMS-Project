import Attendance from '../models/Attendance.js';

const getAttendance = async (req, res) => {
  try {
    const date = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.find({ date }).populate({
      path: "employeeId",
      populate: [
        "department",
        "userId" 
      ]
    });

    res.status(200).json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



const updateAttendance = async (req, res) => {
  try {
    const { employeeld } = req.params;
    const { status } = req.body;
    const date = new Date().toISOString().split('T')[0];

    const employee = await Employee.findOne({employeeld });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const attendance = await Attendance.findOneAndUpdate(
      { employeeld, date },
      { status },
      { new: true }
    );

    return res.status(200).json({ success: true, attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



const attendanceReport = async (req, res) => {
  try {
    const { date, limit = 5, skip = 0 } = req.query;
    const query = {};

    if (date) {
      query.date = date;
    }


    // Assuming attendanceData has already been fetched
    const attendanceData = await Attendance.find(query)
       .populate({
           path: 'employeeld',
           populate: [
               'department',
               'userId'
  ]
})
    .sort({ date: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

// Grouping the attendance data by date
    const groupData = attendanceData.reduce((result, record) => {
        if (!result[record.date]) {
             result[record.date] = [];
        }

        result[record.date].push({
            employeeId: record.employeeld._id,
            employeeName: record.employeeld.userId.name,
            departmentName: record.employeeld.department.dep_name,
            status: record.status || "Not Marked"
        });
        return result;
    }, {});

    return res.status(200).json({ success: true, groupData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};





export { getAttendance, updateAttendance, attendanceReport };
