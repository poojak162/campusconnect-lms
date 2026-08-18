export const mockCourses = [
  {
    id: 'CS101',
    code: 'CS101',
    title: 'Data Structures & Algorithms',
    instructor: 'Dr. Elena Rostova',
    instructorId: 'FAC-2002',
    department: 'Computer Science',
    credits: 4,
    bannerColor: 'from-blue-600 to-indigo-700',
    icon: 'Code',
    progress: 68,
    totalModules: 8,
    completedModules: 5,
    enrolledStudents: 64,
    nextDeadline: '2026-08-25',
    schedule: 'Mon, Wed 10:00 AM - 11:30 AM',
    room: 'Lab 301',
    description: 'Fundamental concepts of data structures including linked lists, trees, graphs, sorting, and algorithmic complexity analysis.',
    syllabus: [
      { unit: 1, name: 'Introduction to Complexity & Arrays' },
      { unit: 2, name: 'Linked Lists & Dynamic Memory' },
      { unit: 3, name: 'Stacks, Queues & Hash Tables' },
      { unit: 4, name: 'Trees & Binary Search Trees' },
      { unit: 5, name: 'Graphs & Shortest Path Algorithms' }
    ],
    announcements: [
      {
        id: 'ann-1',
        title: 'Mid-term Quiz 2 Schedule Released',
        date: '2026-08-15',
        author: 'Dr. Elena Rostova',
        content: 'Please check the Quizzes tab for Mid-term Quiz 2. It will open this Friday at 9:00 AM.'
      },
      {
        id: 'ann-2',
        title: 'Lab Assignment 3 Extended',
        date: '2026-08-12',
        author: 'Dr. Elena Rostova',
        content: 'The deadline for Binary Trees assignment has been extended to August 25.'
      }
    ]
  },
  {
    id: 'CS202',
    code: 'CS202',
    title: 'Database Management Systems',
    instructor: 'Prof. Marcus Vance',
    instructorId: 'FAC-2003',
    department: 'Computer Science',
    credits: 3,
    bannerColor: 'from-purple-600 to-indigo-800',
    icon: 'Database',
    progress: 45,
    totalModules: 6,
    completedModules: 3,
    enrolledStudents: 52,
    nextDeadline: '2026-08-22',
    schedule: 'Tue, Thu 02:00 PM - 03:30 PM',
    room: 'Auditorium B',
    description: 'Relational database design, ER modeling, SQL queries, normalization, transaction management, and indexing methods.',
    syllabus: [
      { unit: 1, name: 'ER Modeling & Relational Algebra' },
      { unit: 2, name: 'Advanced SQL & Views' },
      { unit: 3, name: 'Normalization (1NF to BCNF)' },
      { unit: 4, name: 'Transactions & Concurrency Control' }
    ],
    announcements: [
      {
        id: 'ann-3',
        title: 'PostgreSQL Practice Lab Online',
        date: '2026-08-14',
        author: 'Prof. Marcus Vance',
        content: 'Check Module 3 for the new hands-on SQL query lab workbook.'
      }
    ]
  },
  {
    id: 'AI301',
    code: 'AI301',
    title: 'Machine Learning Fundamentals',
    instructor: 'Dr. Elena Rostova',
    instructorId: 'FAC-2002',
    department: 'Artificial Intelligence',
    credits: 4,
    bannerColor: 'from-violet-600 to-fuchsia-700',
    icon: 'Cpu',
    progress: 85,
    totalModules: 10,
    completedModules: 8,
    enrolledStudents: 48,
    nextDeadline: '2026-08-28',
    schedule: 'Fri 09:00 AM - 12:00 PM',
    room: 'AI Center Lab 1',
    description: 'Supervised and unsupervised learning, regression, classification, neural networks, decision trees, and model evaluation.',
    syllabus: [
      { unit: 1, name: 'Linear & Logistic Regression' },
      { unit: 2, name: 'Decision Trees & Random Forests' },
      { unit: 3, name: 'Neural Networks & Gradient Descent' },
      { unit: 4, name: 'Clustering & Principal Component Analysis' }
    ],
    announcements: [
      {
        id: 'ann-4',
        title: 'Scikit-Learn Notebook Template Uploaded',
        date: '2026-08-16',
        author: 'Dr. Elena Rostova',
        content: 'Download the Jupyter notebook from Module 4 resources before class.'
      }
    ]
  },
  {
    id: 'CS404',
    code: 'CS404',
    title: 'Web Architecture & Cloud Services',
    instructor: 'Prof. Sarah Jenkins',
    instructorId: 'FAC-2004',
    department: 'Software Engineering',
    credits: 3,
    bannerColor: 'from-indigo-600 to-cyan-700',
    icon: 'Globe',
    progress: 30,
    totalModules: 7,
    completedModules: 2,
    enrolledStudents: 58,
    nextDeadline: '2026-08-30',
    schedule: 'Mon, Wed 03:30 PM - 05:00 PM',
    room: 'Software Lab 2',
    description: 'Modern full-stack web applications, microservices, REST API design, frontend frameworks, and cloud deployment pipelines.',
    syllabus: [
      { unit: 1, name: 'HTTP/HTTPS Protocols & REST API Design' },
      { unit: 2, name: 'Frontend State Management & React' },
      { unit: 3, name: 'Backend Services & Database Integration' },
      { unit: 4, name: 'Docker Containerization & AWS Basics' }
    ],
    announcements: [
      {
        id: 'ann-5',
        title: 'API Design Standards Document',
        date: '2026-08-10',
        author: 'Prof. Sarah Jenkins',
        content: 'Read openAPI specs in Module 2 before submitting Project Proposal.'
      }
    ]
  }
];
