import { AppointmentModel } from "../Models/DB.js";


export const deleteAppointment = async (req, res) => {
try {
    await AppointmentModel.deleteMany({});
    return res.status(200).json({
        success: true,
        message: "All appointments deleted successfully"
    })
} catch (error) {
    res.status(500).json({ message: 'Error deleting appointments', error: error.message });
}
}