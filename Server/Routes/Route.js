import express from "express";
import { createAppointment } from '../Controller/Appointment.js';
import { Login } from '../Controller/Login.js';
import { Register } from '../Controller/Register.js';
import { getAppointmentDetails , updatePaymentDetails } from '../Controller/DetailAppointment.js';
import { getAllAppointments } from '../Controller/AllAppointments.js';
//import { updatePaymentDetails } from '../Controller/DetailAppointment.js';

const router = express.Router();

// 🔍 ADD THIS DEBUG CODE
console.log(' Routes file loaded');
console.log('Register function:', typeof Register);
console.log('Login function:', typeof Login);

router.post('/login', (req, res, next) => {
  console.log(' Login route hit');
  Login(req, res, next);
});

router.post('/register', (req, res, next) => {
  console.log(' Register route hit');
  Register(req, res, next);
});

router.post('/appointment', createAppointment);
router.post('/getAppointments', getAppointmentDetails);
router.post('/updatePayment', updatePaymentDetails);
router.get('/Allappointments', getAllAppointments);

export default router;