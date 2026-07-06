import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {
  Enquiry,
  Project,
  Payment,
  Material,
  Worker,
  Activity,
} from '../modules/dashboard/dashboard.models.js';
import {
  ENQUIRY_STATUS,
  PROJECT_STATUS,
  PAYMENT_STATUS,
  WORKER_STATUS,
  ACTIVITY_TYPES,
} from '../modules/dashboard/dashboard.constants.js';

dotenv.config();

const seedDashboardData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingEnquiries = await Enquiry.countDocuments();
    if (existingEnquiries > 0) {
      console.log('Dashboard data already exists. Skipping seed.');
      process.exit(0);
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const enquiries = await Enquiry.insertMany([
      {
        enquiryNumber: 'ENQ-001',
        customerName: 'Rajesh Kumar',
        phone: '9876543210',
        email: 'rajesh@email.com',
        status: ENQUIRY_STATUS.NEW,
        source: 'Website',
        siteVisitDate: today,
        address: 'Anna Nagar, Chennai',
      },
      {
        enquiryNumber: 'ENQ-002',
        customerName: 'Priya Sharma',
        phone: '9876543211',
        status: ENQUIRY_STATUS.IN_PROGRESS,
        source: 'Referral',
        siteVisitDate: tomorrow,
      },
      {
        enquiryNumber: 'ENQ-003',
        customerName: 'Arun Menon',
        phone: '9876543212',
        status: ENQUIRY_STATUS.QUOTED,
        source: 'Walk-in',
      },
      {
        enquiryNumber: 'ENQ-004',
        customerName: 'Lakshmi Devi',
        phone: '9876543213',
        status: ENQUIRY_STATUS.CONVERTED,
        source: 'Phone',
      },
      {
        enquiryNumber: 'ENQ-005',
        customerName: 'Suresh Babu',
        phone: '9876543214',
        status: ENQUIRY_STATUS.NEW,
        source: 'Social Media',
        siteVisitDate: today,
      },
    ]);

    const projects = await Project.insertMany([
      {
        projectNumber: 'PRJ-001',
        title: 'Kitchen Renovation',
        customerName: 'Rajesh Kumar',
        status: PROJECT_STATUS.ACTIVE,
        estimatedValue: 450000,
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        enquiryId: enquiries[0]._id,
      },
      {
        projectNumber: 'PRJ-002',
        title: 'Bathroom Remodel',
        customerName: 'Priya Sharma',
        status: PROJECT_STATUS.ACTIVE,
        estimatedValue: 280000,
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 15),
        enquiryId: enquiries[1]._id,
      },
      {
        projectNumber: 'PRJ-003',
        title: 'Full Home Interior',
        customerName: 'Lakshmi Devi',
        status: PROJECT_STATUS.COMPLETED,
        estimatedValue: 1200000,
        startDate: new Date(today.getFullYear(), today.getMonth() - 3, 1),
        endDate: new Date(today.getFullYear(), today.getMonth() - 1, 28),
        enquiryId: enquiries[3]._id,
      },
      {
        projectNumber: 'PRJ-004',
        title: 'Living Room Design',
        customerName: 'Arun Menon',
        status: PROJECT_STATUS.PLANNING,
        estimatedValue: 350000,
        enquiryId: enquiries[2]._id,
      },
      {
        projectNumber: 'PRJ-005',
        title: 'Office Cabin Setup',
        customerName: 'Suresh Babu',
        status: PROJECT_STATUS.COMPLETED,
        estimatedValue: 520000,
        startDate: new Date(today.getFullYear(), today.getMonth() - 2, 1),
        endDate: new Date(today.getFullYear(), today.getMonth(), 5),
        enquiryId: enquiries[4]._id,
      },
    ]);

    const monthsAgo = (n) => new Date(today.getFullYear(), today.getMonth() - n, 15);

    await Payment.insertMany([
      {
        paymentNumber: 'PAY-001',
        projectId: projects[0]._id,
        projectTitle: projects[0].title,
        customerName: 'Rajesh Kumar',
        amount: 150000,
        paidAmount: 150000,
        status: PAYMENT_STATUS.PAID,
        paidDate: monthsAgo(0),
        dueDate: monthsAgo(0),
      },
      {
        paymentNumber: 'PAY-002',
        projectId: projects[1]._id,
        projectTitle: projects[1].title,
        customerName: 'Priya Sharma',
        amount: 100000,
        paidAmount: 50000,
        status: PAYMENT_STATUS.PARTIAL,
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
      },
      {
        paymentNumber: 'PAY-003',
        projectId: projects[2]._id,
        projectTitle: projects[2].title,
        customerName: 'Lakshmi Devi',
        amount: 400000,
        paidAmount: 400000,
        status: PAYMENT_STATUS.PAID,
        paidDate: monthsAgo(1),
        dueDate: monthsAgo(1),
      },
      {
        paymentNumber: 'PAY-004',
        projectId: projects[3]._id,
        projectTitle: projects[3].title,
        customerName: 'Arun Menon',
        amount: 175000,
        paidAmount: 0,
        status: PAYMENT_STATUS.PENDING,
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),
      },
      {
        paymentNumber: 'PAY-005',
        projectId: projects[4]._id,
        projectTitle: projects[4].title,
        customerName: 'Suresh Babu',
        amount: 260000,
        paidAmount: 260000,
        status: PAYMENT_STATUS.PAID,
        paidDate: monthsAgo(2),
        dueDate: monthsAgo(2),
      },
      {
        paymentNumber: 'PAY-006',
        projectId: projects[0]._id,
        projectTitle: projects[0].title,
        customerName: 'Rajesh Kumar',
        amount: 200000,
        paidAmount: 0,
        status: PAYMENT_STATUS.OVERDUE,
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
      },
      {
        paymentNumber: 'PAY-007',
        projectId: projects[2]._id,
        projectTitle: projects[2].title,
        customerName: 'Lakshmi Devi',
        amount: 300000,
        paidAmount: 300000,
        status: PAYMENT_STATUS.PAID,
        paidDate: monthsAgo(3),
        dueDate: monthsAgo(3),
      },
      {
        paymentNumber: 'PAY-008',
        projectId: projects[4]._id,
        projectTitle: projects[4].title,
        customerName: 'Suresh Babu',
        amount: 180000,
        paidAmount: 180000,
        status: PAYMENT_STATUS.PAID,
        paidDate: monthsAgo(4),
        dueDate: monthsAgo(4),
      },
    ]);

    await Material.insertMany([
      { name: 'Ceramic Tiles', sku: 'MAT-001', quantity: 5, minStockLevel: 20, unit: 'boxes', category: 'Flooring' },
      { name: 'PVC Pipes', sku: 'MAT-002', quantity: 50, minStockLevel: 30, unit: 'pcs', category: 'Plumbing' },
      { name: 'Emulsion Paint', sku: 'MAT-003', quantity: 8, minStockLevel: 15, unit: 'liters', category: 'Paint' },
      { name: 'Granite Slabs', sku: 'MAT-004', quantity: 3, minStockLevel: 10, unit: 'slabs', category: 'Countertop' },
      { name: 'Electrical Wire', sku: 'MAT-005', quantity: 100, minStockLevel: 50, unit: 'meters', category: 'Electrical' },
      { name: 'Door Handles', sku: 'MAT-006', quantity: 12, minStockLevel: 25, unit: 'pcs', category: 'Hardware' },
    ]);

    await Worker.insertMany([
      { name: 'Muthu', phone: '9000000001', trade: 'Carpenter', status: WORKER_STATUS.AVAILABLE },
      { name: 'Kannan', phone: '9000000002', trade: 'Electrician', status: WORKER_STATUS.ASSIGNED, projectId: projects[0]._id },
      { name: 'Ravi', phone: '9000000003', trade: 'Plumber', status: WORKER_STATUS.AVAILABLE },
      { name: 'Senthil', phone: '9000000004', trade: 'Painter', status: WORKER_STATUS.ASSIGNED, projectId: projects[1]._id },
      { name: 'Velu', phone: '9000000005', trade: 'Mason', status: WORKER_STATUS.ON_LEAVE },
      { name: 'Gopal', phone: '9000000006', trade: 'Carpenter', status: WORKER_STATUS.AVAILABLE },
    ]);

    await Activity.insertMany([
      {
        type: ACTIVITY_TYPES.ENQUIRY,
        title: 'New enquiry received',
        description: 'ENQ-001 from Rajesh Kumar',
        module: 'enquiry',
        referenceId: enquiries[0]._id,
      },
      {
        type: ACTIVITY_TYPES.PROJECT,
        title: 'Project started',
        description: 'PRJ-001 Kitchen Renovation is now active',
        module: 'project',
        referenceId: projects[0]._id,
      },
      {
        type: ACTIVITY_TYPES.PAYMENT,
        title: 'Payment received',
        description: '₹1,50,000 received for PRJ-001',
        module: 'payment',
      },
      {
        type: ACTIVITY_TYPES.MATERIAL,
        title: 'Low stock alert',
        description: 'Ceramic Tiles below minimum stock level',
        module: 'material',
      },
      {
        type: ACTIVITY_TYPES.WORKER,
        title: 'Worker assigned',
        description: 'Kannan assigned to PRJ-001',
        module: 'worker',
      },
    ]);

    console.log('Dashboard seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Dashboard seed failed:', error.message);
    process.exit(1);
  }
};

seedDashboardData();
