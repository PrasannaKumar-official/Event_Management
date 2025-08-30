import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventFrom: { type: Date, required: true },
  eventTo: { type: Date, required: true },
  numberOfDays: Number,
  timeFrom: String,
  timeTo: String,

  organizerName: String,
  department: String,
  mobile: String,

  participantsInternal: Number,
  participantsExternal: Number,

  guestCount: Number,
  guestName: String,
  guestDesignation: String,
  guestOrg: String,
  venueName: { type: String, required: true },
  vehicleRequired: { type: String, default: 'No' },
  accommodationRequired: { type: String, default: 'No' },
  audioRequired: { type: String, default: 'No' },
  photographyRequired: { type: String, default: 'No' },
  accessoriesRequired: { type: String, default: 'No' },
  financialRequired: { type: String, default: 'No' },
  rewardPoints: { type: String, default: 'No' },

  // 🔹 Approval fields
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
