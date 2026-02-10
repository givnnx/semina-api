import db, { connectToDb } from "../app/db";
import { signup } from "../app/services/mongoose/auth";
import Organizers from "../app/api/v1/organizers/model";

const seedAdmin = async () => {
  try {
    await connectToDb();
    // 1. Create Organizer
    let organizer = await Organizers.findOne({ organizer: "Semina" });
    if (!organizer) {
      organizer = await Organizers.create({ organizer: "Semina" });
      console.log("Organizer 'Semina' created.");
    }

    // 2. Create User
    const payload = {
      email: "admin@gmail.com",
      password: "admin123",
      name: "Super Admin",
      role: "owner", // or 'admin' depending on desired role
      organizer: organizer._id,
    };

    console.log("Seeding admin...");
    const result = await signup(payload);
    console.log("Admin seeded successfully:", result.email);
    db.close();
  } catch (err) {
    console.error("Seed failed:");
    console.error(err);
    db.close();
  }
};

seedAdmin();
