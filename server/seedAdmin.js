/*----- FILE: seedAdmin.js | CONTENT: Admin account seed script. | PURPOSE: Creates a ready-to-use administrator account without deleting existing MovieMate users. -----*/

require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config/db");

const adminEmail = "admin@moviemate.com";
const adminPassword = "Admin@123";

/*----- CREATE ADMIN: Creates the default admin account or upgrades the same email to admin. -----*/
const seedAdmin = async () => {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      existingAdmin.role = "admin";
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
    } else {
      await User.create({
        name: "MovieMate Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
    }

    console.log("Admin account is ready.");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error("Admin seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
