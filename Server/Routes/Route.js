import express from "express";
import { createAppointment } from '../Controller/Appointment.js';
import { Login } from '../Controller/Login.js';
import { Register } from '../Controller/Register.js';
import { getAppointmentDetails , updatePaymentDetails } from '../Controller/DetailAppointment.js';
import { getAllAppointments } from '../Controller/AllAppointments.js';
import { deleteAppointment } from '../Controller/DeleteAppointment.js';
import { authenticate, requireAdmin, requireAccess } from "../Middleware/JWT.js";
import { getPendingUsers, approveUser, revokeUser } from "../Controller/admin.js";


const router = express.Router();

// 🔍 ADD THIS DEBUG CODE
console.log(' Routes file loaded');
console.log('Register function:', typeof Register);
console.log('Login function:', typeof Login);

router.post('/login', Login);

router.post('/register', Register);

router.post('/appointment', createAppointment);
router.post('/getAppointments', authenticate, requireAccess, getAppointmentDetails);
router.post('/updatePayment', authenticate, requireAccess, updatePaymentDetails);
router.get('/Allappointments', authenticate, requireAccess, getAllAppointments);
router.delete('/deleteAppointments', authenticate, requireAccess, deleteAppointment);

// GET /admin/users/pending — list users awaiting approval
router.get("/users/pending", authenticate, requireAdmin,getPendingUsers);

// PATCH /admin/users/:id/approve — grant dashboard access
router.patch("/users/:id/approve", authenticate, requireAdmin, approveUser);

// PATCH /admin/users/:id/revoke — remove access
router.patch("/users/:id/revoke", authenticate, requireAdmin, revokeUser);

export default router;