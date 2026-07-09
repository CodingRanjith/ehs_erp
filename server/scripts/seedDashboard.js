import dotenv from 'dotenv';
import supabase from '../config/supabase.js';
import { TABLES as DASHBOARD_TABLES } from '../modules/dashboard/dashboard.models.js';
import {
  ENQUIRY_STATUS,
  PROJECT_STATUS,
  PAYMENT_STATUS,
  WORKER_STATUS,
  ACTIVITY_TYPES,
} from '../modules/dashboard/dashboard.constants.js';
import { throwIfSupabaseError } from '../utils/supabaseMapper.js';

dotenv.config();

const seedDashboardData = async () => {
  try {
    const { count, error: countError } = await supabase
      .from(DASHBOARD_TABLES.ENQUIRIES)
      .select('*', { count: 'exact', head: true });

    throwIfSupabaseError(countError, 'Failed to check existing enquiries');

    if (count > 0) {
      console.log('Dashboard data already exists. Skipping seed.');
      process.exit(0);
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: enquiries, error: enquiryError } = await supabase
      .from(DASHBOARD_TABLES.ENQUIRIES)
      .insert([
        {
          enquiry_number: 'ENQ-001',
          customer_name: 'Rajesh Kumar',
          phone: '9876543210',
          email: 'rajesh@email.com',
          status: ENQUIRY_STATUS.NEW,
          source: 'Website',
          site_visit_date: today.toISOString(),
          address: 'Anna Nagar, Chennai',
        },
        {
          enquiry_number: 'ENQ-002',
          customer_name: 'Priya Sharma',
          phone: '9876543211',
          status: ENQUIRY_STATUS.IN_PROGRESS,
          source: 'Referral',
          site_visit_date: tomorrow.toISOString(),
        },
        {
          enquiry_number: 'ENQ-003',
          customer_name: 'Arun Menon',
          phone: '9876543212',
          status: ENQUIRY_STATUS.QUOTED,
          source: 'Walk-in',
        },
        {
          enquiry_number: 'ENQ-004',
          customer_name: 'Lakshmi Devi',
          phone: '9876543213',
          status: ENQUIRY_STATUS.CONVERTED,
          source: 'Phone',
        },
        {
          enquiry_number: 'ENQ-005',
          customer_name: 'Suresh Babu',
          phone: '9876543214',
          status: ENQUIRY_STATUS.NEW,
          source: 'Social Media',
          site_visit_date: today.toISOString(),
        },
      ])
      .select();

    throwIfSupabaseError(enquiryError, 'Failed to seed enquiries');

    const { data: projects, error: projectError } = await supabase
      .from(DASHBOARD_TABLES.PROJECTS)
      .insert([
        {
          project_number: 'PRJ-001',
          title: 'Kitchen Renovation',
          customer_name: 'Rajesh Kumar',
          status: PROJECT_STATUS.ACTIVE,
          estimated_value: 450000,
          start_date: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
          enquiry_id: enquiries[0].id,
        },
        {
          project_number: 'PRJ-002',
          title: 'Bathroom Remodel',
          customer_name: 'Priya Sharma',
          status: PROJECT_STATUS.ACTIVE,
          estimated_value: 280000,
          start_date: new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString(),
          enquiry_id: enquiries[1].id,
        },
        {
          project_number: 'PRJ-003',
          title: 'Full Home Interior',
          customer_name: 'Lakshmi Devi',
          status: PROJECT_STATUS.COMPLETED,
          estimated_value: 1200000,
          start_date: new Date(today.getFullYear(), today.getMonth() - 3, 1).toISOString(),
          end_date: new Date(today.getFullYear(), today.getMonth() - 1, 28).toISOString(),
          enquiry_id: enquiries[3].id,
        },
        {
          project_number: 'PRJ-004',
          title: 'Living Room Design',
          customer_name: 'Arun Menon',
          status: PROJECT_STATUS.PLANNING,
          estimated_value: 350000,
          enquiry_id: enquiries[2].id,
        },
        {
          project_number: 'PRJ-005',
          title: 'Office Cabin Setup',
          customer_name: 'Suresh Babu',
          status: PROJECT_STATUS.COMPLETED,
          estimated_value: 520000,
          start_date: new Date(today.getFullYear(), today.getMonth() - 2, 1).toISOString(),
          end_date: new Date(today.getFullYear(), today.getMonth(), 5).toISOString(),
          enquiry_id: enquiries[4].id,
        },
      ])
      .select();

    throwIfSupabaseError(projectError, 'Failed to seed projects');

    const monthsAgo = (n) => new Date(today.getFullYear(), today.getMonth() - n, 15).toISOString();

    const { error: paymentError } = await supabase.from(DASHBOARD_TABLES.PAYMENTS).insert([
      {
        payment_number: 'PAY-001',
        project_id: projects[0].id,
        project_title: projects[0].title,
        customer_name: 'Rajesh Kumar',
        amount: 150000,
        paid_amount: 150000,
        status: PAYMENT_STATUS.PAID,
        paid_date: monthsAgo(0),
        due_date: monthsAgo(0),
      },
      {
        payment_number: 'PAY-002',
        project_id: projects[1].id,
        project_title: projects[1].title,
        customer_name: 'Priya Sharma',
        amount: 100000,
        paid_amount: 50000,
        status: PAYMENT_STATUS.PARTIAL,
        due_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).toISOString(),
      },
      {
        payment_number: 'PAY-003',
        project_id: projects[2].id,
        project_title: projects[2].title,
        customer_name: 'Lakshmi Devi',
        amount: 400000,
        paid_amount: 400000,
        status: PAYMENT_STATUS.PAID,
        paid_date: monthsAgo(1),
        due_date: monthsAgo(1),
      },
      {
        payment_number: 'PAY-004',
        project_id: projects[3].id,
        project_title: projects[3].title,
        customer_name: 'Arun Menon',
        amount: 175000,
        paid_amount: 0,
        status: PAYMENT_STATUS.PENDING,
        due_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14).toISOString(),
      },
      {
        payment_number: 'PAY-005',
        project_id: projects[4].id,
        project_title: projects[4].title,
        customer_name: 'Suresh Babu',
        amount: 260000,
        paid_amount: 260000,
        status: PAYMENT_STATUS.PAID,
        paid_date: monthsAgo(2),
        due_date: monthsAgo(2),
      },
      {
        payment_number: 'PAY-006',
        project_id: projects[0].id,
        project_title: projects[0].title,
        customer_name: 'Rajesh Kumar',
        amount: 200000,
        paid_amount: 0,
        status: PAYMENT_STATUS.OVERDUE,
        due_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5).toISOString(),
      },
      {
        payment_number: 'PAY-007',
        project_id: projects[2].id,
        project_title: projects[2].title,
        customer_name: 'Lakshmi Devi',
        amount: 300000,
        paid_amount: 300000,
        status: PAYMENT_STATUS.PAID,
        paid_date: monthsAgo(3),
        due_date: monthsAgo(3),
      },
      {
        payment_number: 'PAY-008',
        project_id: projects[4].id,
        project_title: projects[4].title,
        customer_name: 'Suresh Babu',
        amount: 180000,
        paid_amount: 180000,
        status: PAYMENT_STATUS.PAID,
        paid_date: monthsAgo(4),
        due_date: monthsAgo(4),
      },
    ]);

    throwIfSupabaseError(paymentError, 'Failed to seed payments');

    const { error: materialError } = await supabase.from(DASHBOARD_TABLES.MATERIALS).insert([
      { name: 'Ceramic Tiles', sku: 'MAT-001', quantity: 5, min_stock_level: 20, unit: 'boxes', category: 'Flooring' },
      { name: 'PVC Pipes', sku: 'MAT-002', quantity: 50, min_stock_level: 30, unit: 'pcs', category: 'Plumbing' },
      { name: 'Emulsion Paint', sku: 'MAT-003', quantity: 8, min_stock_level: 15, unit: 'liters', category: 'Paint' },
      { name: 'Granite Slabs', sku: 'MAT-004', quantity: 3, min_stock_level: 10, unit: 'slabs', category: 'Countertop' },
      { name: 'Electrical Wire', sku: 'MAT-005', quantity: 100, min_stock_level: 50, unit: 'meters', category: 'Electrical' },
      { name: 'Door Handles', sku: 'MAT-006', quantity: 12, min_stock_level: 25, unit: 'pcs', category: 'Hardware' },
    ]);

    throwIfSupabaseError(materialError, 'Failed to seed materials');

    const { error: workerError } = await supabase.from(DASHBOARD_TABLES.WORKERS).insert([
      { name: 'Muthu', phone: '9000000001', trade: 'Carpenter', status: WORKER_STATUS.AVAILABLE },
      { name: 'Kannan', phone: '9000000002', trade: 'Electrician', status: WORKER_STATUS.ASSIGNED, project_id: projects[0].id },
      { name: 'Ravi', phone: '9000000003', trade: 'Plumber', status: WORKER_STATUS.AVAILABLE },
      { name: 'Senthil', phone: '9000000004', trade: 'Painter', status: WORKER_STATUS.ASSIGNED, project_id: projects[1].id },
      { name: 'Velu', phone: '9000000005', trade: 'Mason', status: WORKER_STATUS.ON_LEAVE },
      { name: 'Gopal', phone: '9000000006', trade: 'Carpenter', status: WORKER_STATUS.AVAILABLE },
    ]);

    throwIfSupabaseError(workerError, 'Failed to seed workers');

    const { error: activityError } = await supabase.from(DASHBOARD_TABLES.ACTIVITIES).insert([
      {
        type: ACTIVITY_TYPES.ENQUIRY,
        title: 'New enquiry received',
        description: 'ENQ-001 from Rajesh Kumar',
        module: 'enquiry',
        reference_id: enquiries[0].id,
      },
      {
        type: ACTIVITY_TYPES.PROJECT,
        title: 'Project started',
        description: 'PRJ-001 Kitchen Renovation is now active',
        module: 'project',
        reference_id: projects[0].id,
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

    throwIfSupabaseError(activityError, 'Failed to seed activities');

    console.log('Dashboard seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Dashboard seed failed:', error.message);
    process.exit(1);
  }
};

seedDashboardData();
