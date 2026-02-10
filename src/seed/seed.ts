import db, { connectToDb } from "../app/db";
import Organizers from "../app/api/v1/organizers/model";
import Users from "../app/api/v1/users/model";
import Categories from "../app/api/v1/categories/model";
import Images from "../app/api/v1/images/model";
import Talents from "../app/api/v1/talents/model";
import Events from "../app/api/v1/events/model";
import Payments from "../app/api/v1/payments/model";
import Participants from "../app/api/v1/participants/model";
import Orders from "../app/api/v1/orders/model";

const seed = async () => {
  try {
    await connectToDb();
    console.log("Connected to DB for seeding...");

    // 1. Organizer
    console.log("Seeding Organizer...");
    let organizer = await Organizers.findOne({ organizer: "Semina" });
    if (!organizer) {
      organizer = await Organizers.create({ organizer: "Semina" });
      console.log("- Organizer 'Semina' created.");
    } else {
      console.log("- Organizer 'Semina' already exists.");
    }

    // 2. User (Admin)
    console.log("Seeding User (Admin)...");
    const adminEmail = "admin@gmail.com";
    let user = await Users.findOne({ email: adminEmail });
    if (!user) {
      user = await Users.create({
        email: adminEmail,
        password: "admin123",
        name: "Super Admin",
        role: "owner",
        organizer: organizer._id,
      });
      console.log("- User 'admin@gmail.com' created.");
    } else {
      console.log("- User 'admin@gmail.com' already exists.");
    }

    // 3. Image
    console.log("Seeding Image...");
    let image = await Images.findOne({ name: "default.jpg" });
    if (!image) {
      image = await Images.create({ name: "default.jpg" });
      console.log("- Image 'default.jpg' created.");
    } else {
      console.log("- Image 'default.jpg' already exists.");
    }

    // 4. Category
    console.log("Seeding Category...");
    let category = await Categories.findOne({
      name: "Webinar",
      organizer: organizer._id,
    });
    if (!category) {
      category = await Categories.create({
        name: "Webinar",
        organizer: organizer._id,
      });
      console.log("- Category 'Webinar' created.");
    } else {
      console.log("- Category 'Webinar' already exists.");
    }

    // 5. Talent
    console.log("Seeding Talent...");
    let talent = await Talents.findOne({
      name: "John Doe",
      organizer: organizer._id,
    });
    if (!talent) {
      talent = await Talents.create({
        name: "John Doe",
        role: "Speaker",
        image: image._id,
        organizer: organizer._id,
      });
      console.log("- Talent 'John Doe' created.");
    } else {
      console.log("- Talent 'John Doe' already exists.");
    }

    // 6. Event
    console.log("Seeding Event...");
    let event = await Events.findOne({
      title: "MERN Stack Masterclass",
      organizer: organizer._id,
    });
    if (!event) {
      event = await Events.create({
        title: "MERN Stack Masterclass",
        date: new Date("2025-12-31"),
        about: "Learn MERN Stack from scratch.",
        tagline: "Be a Fullstack Developer",
        venueName: "Online",
        keyPoint: ["MongoDB", "Express", "React", "Node"],
        statusEvent: "Published",
        tickets: [
          {
            type: "Regular",
            price: 0,
            stock: 100,
            statusTicketCategories: true,
            expired: new Date("2025-12-30"),
          },
        ],
        image: image._id,
        category: category._id,
        talent: talent._id,
        organizer: organizer._id,
      });
      console.log("- Event 'MERN Stack Masterclass' created.");
    } else {
      console.log("- Event 'MERN Stack Masterclass' already exists.");
    }

    // 7. Payment
    console.log("Seeding Payment...");
    let payment = await Payments.findOne({
      type: "Bank Transfer",
      organizer: organizer._id,
    });
    if (!payment) {
      payment = await Payments.create({
        type: "Bank Transfer",
        image: image._id,
        status: true,
        organizer: organizer._id,
      });
      console.log("- Payment 'Bank Transfer' created.");
    } else {
      console.log("- Payment 'Bank Transfer' already exists.");
    }

    // 8. Participant
    console.log("Seeding Participant...");
    const participantEmail = "user@gmail.com";
    let participant = await Participants.findOne({ email: participantEmail });
    if (!participant) {
      participant = await Participants.create({
        firstName: "User",
        lastName: "Demo",
        email: participantEmail,
        password: "user123",
        role: "Designer",
        status: "aktif",
        otp: "1234",
      });
      console.log("- Participant 'user@gmail.com' created.");
    } else {
      console.log("- Participant 'user@gmail.com' already exists.");
    }

    // 9. Order
    console.log("Seeding Order...");
    // Check if order exists for this participant and event to avoid duplicates
    let order = await Orders.findOne({
      participant: participant._id,
      event: event._id,
    });
    if (!order) {
      order = await Orders.create({
        date: new Date(),
        personalDetail: {
          firstName: participant.firstName,
          lastName: participant.lastName || "",
          email: participant.email,
          role: participant.role,
        },
        status: "paid",
        totalPay: 0,
        totalOrderTicket: 1,
        orderItems: [
          {
            ticketCategories: {
              type: event.tickets[0].type,
              price: event.tickets[0].price,
            },
            sumTicket: 1,
          },
        ],
        participant: participant._id,
        payment: payment._id,
        event: event._id,
        historyEvent: {
          title: event.title,
          date: event.date,
          about: event.about,
          tagline: event.tagline,
          keyPoint: event.keyPoint,
          venueName: event.venueName,
          image: event.image,
          category: event.category,
          talent: event.talent,
          organizer: event.organizer,
        },
      });
      console.log("- Order created.");
    } else {
      console.log("- Order already exists.");
    }

    console.log("Seeding completed successfully.");
    db.close();
  } catch (err) {
    console.error("Seed failed:", err);
    db.close();
  }
};

seed();
