import mongoose from 'mongoose';
import {
  ENQUIRY_STATUS,
  PROJECT_STATUS,
  PAYMENT_STATUS,
  WORKER_STATUS,
  ACTIVITY_TYPES,
} from './dashboard.constants.js';

const enquirySchema = new mongoose.Schema(
  {
    enquiryNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    status: {
      type: String,
      enum: Object.values(ENQUIRY_STATUS),
      default: ENQUIRY_STATUS.NEW,
    },
    source: { type: String, trim: true },
    siteVisitDate: { type: Date, default: null },
    address: { type: String, trim: true },
    notes: { type: String },
  },
  { timestamps: true, collection: 'enquiries' }
);

const projectSchema = new mongoose.Schema(
  {
    projectNumber: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    customerName: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.PLANNING,
    },
    startDate: { type: Date },
    endDate: { type: Date },
    estimatedValue: { type: Number, default: 0 },
    enquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' },
  },
  { timestamps: true, collection: 'projects' }
);

const paymentSchema = new mongoose.Schema(
  {
    paymentNumber: { type: String, required: true, unique: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    projectTitle: { type: String, trim: true },
    customerName: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    dueDate: { type: Date },
    paidDate: { type: Date },
  },
  { timestamps: true, collection: 'payments' }
);

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, trim: true },
    quantity: { type: Number, default: 0, min: 0 },
    minStockLevel: { type: Number, default: 10, min: 0 },
    unit: { type: String, default: 'pcs', trim: true },
    category: { type: String, trim: true },
    unitPrice: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, collection: 'materials' }
);

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    trade: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(WORKER_STATUS),
      default: WORKER_STATUS.AVAILABLE,
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  },
  { timestamps: true, collection: 'workers' }
);

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(ACTIVITY_TYPES),
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    module: { type: String, trim: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, collection: 'activities' }
);

export const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export const Material = mongoose.models.Material || mongoose.model('Material', materialSchema);
export const Worker = mongoose.models.Worker || mongoose.model('Worker', workerSchema);
export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
