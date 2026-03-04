import { UserModel } from "../Models/DB.js"

export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await UserModel.find({ role: "pending" }).select("-password");
    res.status(200).json({ success: true, data: pendingUsers });
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  } 
};

export const approveUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { role: "user", approvedAt: new Date(), approvedBy: req.user._id },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "User approved", data: user });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const revokeUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { role: "pending", approvedAt: null, approvedBy: null },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "User access revoked", data: user });
  } catch (error) {
    console.error("Error revoking user access:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};