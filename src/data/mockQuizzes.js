export const mockQuizzes = [
  {
    id: 'QZ-101',
    courseId: 'CS101',
    courseName: 'Data Structures & Algorithms',
    title: 'Quiz 1: Time & Space Complexity Basics',
    durationMinutes: 15,
    totalPoints: 20,
    status: 'Completed', // Available | Completed
    userScore: 18,
    attemptsAllowed: 2,
    attemptsUsed: 1,
    questions: [
      {
        id: 1,
        question: 'What is the worst-case time complexity of QuickSort?',
        options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'],
        correctIndex: 2,
        explanation: 'QuickSort degenerates to O(n^2) when the pivot selection consistently chooses the smallest or largest element.'
      },
      {
        id: 2,
        question: 'Which data structure follows LIFO (Last In First Out)?',
        options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
        correctIndex: 1,
        explanation: 'Stack uses Push and Pop operations operating on the top element (LIFO).'
      },
      {
        id: 3,
        question: 'What is the time complexity to access an element by index in an array?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        correctIndex: 0,
        explanation: 'Array index access computes base address + offset in constant O(1) time.'
      },
      {
        id: 4,
        question: 'Floyd\'s Tortoise and Hare algorithm is used for:',
        options: ['Sorting Arrays', 'Cycle Detection in Linked List', 'Graph Coloring', 'String Matching'],
        correctIndex: 1,
        explanation: 'Two pointers moving at different speeds detect if a loop exists in a linked structure.'
      }
    ]
  },
  {
    id: 'QZ-102',
    courseId: 'CS101',
    courseName: 'Data Structures & Algorithms',
    title: 'Quiz 2: Trees & Graph Traversal Check',
    durationMinutes: 20,
    totalPoints: 25,
    status: 'Available',
    userScore: null,
    attemptsAllowed: 1,
    attemptsUsed: 0,
    questions: [
      {
        id: 1,
        question: 'Which traversal algorithm uses a Queue data structure?',
        options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'In-Order Traversal', 'Post-Order Traversal'],
        correctIndex: 1,
        explanation: 'BFS explores neighbor nodes level-by-level using a FIFO Queue.'
      },
      {
        id: 2,
        question: 'In a Binary Search Tree (BST), the left child node key is always:',
        options: ['Greater than the parent key', 'Equal to the right child key', 'Less than the parent key', 'Random'],
        correctIndex: 2,
        explanation: 'BST property dictates left subtree keys < parent key < right subtree keys.'
      },
      {
        id: 3,
        question: 'What is the height of a balanced Binary Search Tree with N nodes?',
        options: ['O(N)', 'O(log N)', 'O(N^2)', 'O(1)'],
        correctIndex: 1,
        explanation: 'Balanced tree height grows logarithmically with respect to node count N.'
      }
    ]
  },
  {
    id: 'QZ-201',
    courseId: 'CS202',
    courseName: 'Database Management Systems',
    title: 'Quiz 1: Relational Algebra & SQL Basics',
    durationMinutes: 15,
    totalPoints: 20,
    status: 'Available',
    userScore: null,
    attemptsAllowed: 2,
    attemptsUsed: 0,
    questions: [
      {
        id: 1,
        question: 'Which SQL clause is used to filter aggregated groups?',
        options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],
        correctIndex: 1,
        explanation: 'HAVING filters results AFTER aggregation performed by GROUP BY.'
      },
      {
        id: 2,
        question: 'A primary key must satisfy which two constraints?',
        options: ['FOREIGN KEY & UNIQUE', 'NOT NULL & UNIQUE', 'CHECK & DEFAULT', 'INDEXED & AUTO_INCREMENT'],
        correctIndex: 1,
        explanation: 'Primary keys uniquely identify rows and cannot contain null values.'
      }
    ]
  }
];
