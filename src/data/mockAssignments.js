export const mockAssignments = [
  {
    id: 'ASN-101',
    courseId: 'CS101',
    courseName: 'Data Structures & Algorithms',
    title: 'Assignment 1: Linked List Operations & Cycle Detection',
    description: 'Implement a generic Singly Linked List with methods: reverse(), detectCycle(), and findMiddle(). Write unit tests verifying edge cases.',
    dueDate: '2026-08-25T23:59:00',
    totalPoints: 100,
    status: 'Pending', // Pending | Submitted | Graded
    submittedDate: null,
    score: null,
    feedback: null,
    fileTypes: '.zip, .cpp, .py, .java',
    instructions: 'Submit a zipped repository containing source code and a brief PDF report explaining your time/space complexity analysis.'
  },
  {
    id: 'ASN-102',
    courseId: 'CS101',
    courseName: 'Data Structures & Algorithms',
    title: 'Assignment 2: Binary Search Tree Balancing',
    description: 'Construct an AVL Tree with automatic left/right rotations upon node insertion and deletion.',
    dueDate: '2026-08-18T23:59:00',
    totalPoints: 100,
    status: 'Graded',
    submittedDate: '2026-08-17T14:22:00',
    score: 92,
    feedback: 'Excellent implementation of double rotations. Minor issue in memory deallocation during tree clear.',
    submissionFileName: 'aarav_sharma_avl_trees.zip',
    fileTypes: '.zip, .pdf',
    instructions: 'Provide working code and benchmark analysis comparing BST vs AVL performance.'
  },
  {
    id: 'ASN-201',
    courseId: 'CS202',
    courseName: 'Database Management Systems',
    title: 'Assignment 1: E-Commerce DB Schema Design & SQL Queries',
    description: 'Design a 3NF relational schema for an online marketplace including orders, items, users, and payment logs.',
    dueDate: '2026-08-22T23:59:00',
    totalPoints: 50,
    status: 'Submitted',
    submittedDate: '2026-08-16T18:45:00',
    score: null,
    feedback: null,
    submissionFileName: 'ecommerce_schema_v2.sql',
    fileTypes: '.sql, .pdf',
    instructions: 'Submit both DDL SQL creation script and ER Diagram diagram.'
  },
  {
    id: 'ASN-301',
    courseId: 'AI301',
    courseName: 'Machine Learning Fundamentals',
    title: 'Assignment 1: Linear & Logistic Regression from Scratch',
    description: 'Implement gradient descent optimization without using scikit-learn. Evaluate on the Iris dataset.',
    dueDate: '2026-08-28T23:59:00',
    totalPoints: 100,
    status: 'Pending',
    submittedDate: null,
    score: null,
    feedback: null,
    fileTypes: '.ipynb, .py',
    instructions: 'Jupyter notebook with loss curve visualizations.'
  }
];
