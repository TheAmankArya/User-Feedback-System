const Feedback = require('../models/Feedback');
const connectDB = require('../config/database');

const seedData = [
  {
    userName: 'John Doe',
    email: 'john.doe@example.com',
    feedbackText: 'The application is really intuitive and easy to use. I especially love the clean design and smooth navigation. However, it would be great if you could add dark mode support.',
    category: 'suggestion',
    status: 'pending'
  },
  {
    userName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    feedbackText: 'I encountered a bug where the form submission fails when the feedback text is longer than 500 characters. The error message is not very helpful either.',
    category: 'bug-report',
    status: 'reviewed'
  },
  {
    userName: 'Mike Chen',
    email: 'mike.chen@example.com',
    feedbackText: 'Please add a feature to export feedback data as CSV or PDF. This would be very helpful for generating reports and analysis.',
    category: 'feature-request',
    status: 'pending'
  },
  {
    userName: 'Emily Davis',
    email: 'emily.davis@example.com',
    feedbackText: 'Great work on this feedback system! The interface is clean and the filtering options are very useful. Keep up the good work!',
    category: 'general',
    status: 'resolved'
  },
  {
    userName: 'Alex Rodriguez',
    email: 'alex.rodriguez@example.com',
    feedbackText: 'The sorting functionality seems to be broken. When I try to sort by category, it doesn\'t work as expected. Please fix this issue.',
    category: 'bug-report',
    status: 'reviewed'
  },
  {
    userName: 'Lisa Wang',
    email: 'lisa.wang@example.com',
    feedbackText: 'It would be nice to have email notifications when someone responds to feedback. Also, a rating system would be a great addition.',
    category: 'suggestion',
    status: 'pending'
  },
  {
    userName: 'David Brown',
    email: 'david.brown@example.com',
    feedbackText: 'The mobile responsiveness could be improved. Some buttons are too small to tap easily on mobile devices.',
    category: 'suggestion',
    status: 'resolved'
  },
  {
    userName: 'Jennifer Wilson',
    email: 'jennifer.wilson@example.com',
    feedbackText: 'Please add support for file attachments in feedback submissions. Sometimes a screenshot or document would help explain the issue better.',
    category: 'feature-request',
    status: 'pending'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Feedback.deleteMany({});
    console.log('🗑️  Cleared existing feedback data');
    
    // Insert seed data
    const insertedData = await Feedback.insertMany(seedData);
    console.log(`✅ Inserted ${insertedData.length} feedback records`);
    
    console.log('🌱 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedData, seedDatabase }; 