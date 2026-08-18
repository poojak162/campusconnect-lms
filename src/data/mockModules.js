export const mockModules = [
  {
    id: 'MOD-101',
    courseId: 'CS101',
    title: 'Module 1 — Introduction to Big-O & Complexity Analysis',
    duration: '45 mins',
    order: 1,
    isCompleted: true,
    objectives: [
      'Understand Asymptotic Notation (Big-O, Big-Omega, Big-Theta)',
      'Analyze linear vs quadratic vs logarithmic execution bounds',
      'Calculate memory allocation and space complexity tradeoffs'
    ],
    readingMaterial: `Complexity analysis allows software engineers to predict runtime scaling before deployment. 
Key concepts:
1. Time Complexity: Asymptotic upper bound O(f(n)).
2. Space Complexity: Auxiliary space required by dynamic stacks and arrays.
3. Best, Average, and Worst-Case bounds for core algorithms.`,
    videoUrl: 'https://www.youtube.com/embed/g2o22C3CRfU',
    videoDuration: '14:20',
    materials: [
      { id: 'mat-1', title: 'Big-O Cheat Sheet (PDF)', type: 'pdf', size: '1.2 MB', url: '#' },
      { id: 'mat-2', title: 'Complexity Analysis Code Examples', type: 'code', size: '340 KB', url: '#' }
    ]
  },
  {
    id: 'MOD-102',
    courseId: 'CS101',
    title: 'Module 2 — Core Concepts: Arrays, Dynamic Arrays & Memory Layout',
    duration: '50 mins',
    order: 2,
    isCompleted: true,
    objectives: [
      'Master contiguous memory indexing and pointer offset arithmetic',
      'Implement dynamic array doubling strategy for amortized O(1) inserts',
      'Solve sliding window array problems'
    ],
    readingMaterial: `Arrays form the foundational linear data structure stored sequentially in memory.
Dynamic arrays (e.g., std::vector in C++, ArrayList in Java) handle geometric resizing when capacity is exceeded.
Geometric doubling guarantees an amortized constant O(1) runtime per push operation.`,
    videoUrl: 'https://www.youtube.com/embed/PEnFFi557W8',
    videoDuration: '18:45',
    materials: [
      { id: 'mat-3', title: 'Dynamic Array Implementation in C++', type: 'code', size: '210 KB', url: '#' },
      { id: 'mat-4', title: 'Lecture Slides - Unit 1', type: 'ppt', size: '4.5 MB', url: '#' }
    ]
  },
  {
    id: 'MOD-103',
    courseId: 'CS101',
    title: 'Module 3 — Advanced Concepts: Singly & Doubly Linked Lists',
    duration: '60 mins',
    order: 3,
    isCompleted: true,
    objectives: [
      'Build node references and pointer manipulation algorithms',
      'Implement Floyd\'s Tortoise and Hare cycle detection algorithm',
      'Reverse singly linked lists iteratively and recursively'
    ],
    readingMaterial: `Linked lists store elements dynamically in non-contiguous heap nodes linked via pointers.
Pros: O(1) prepend and insertion at known node position.
Cons: O(n) linear access time due to lack of random memory index access.`,
    videoUrl: 'https://www.youtube.com/embed/njTh_OwMijA',
    videoDuration: '22:10',
    materials: [
      { id: 'mat-5', title: 'Linked List Boundary Cases Guide', type: 'pdf', size: '890 KB', url: '#' }
    ]
  },
  {
    id: 'MOD-104',
    courseId: 'CS101',
    title: 'Module 4 — Applications: Binary Search Trees & Traversal Techniques',
    duration: '75 mins',
    order: 4,
    isCompleted: false,
    objectives: [
      'Master tree node properties: Left < Parent < Right',
      'Implement In-order, Pre-order, Post-order, and BFS traversals',
      'Construct self-balancing BST rotation rules'
    ],
    readingMaterial: `Binary Search Trees provide O(log N) average lookup, insertion, and deletion.
Traversals:
- In-Order (Left, Root, Right): Yields elements in sorted order.
- Pre-Order (Root, Left, Right): Useful for tree cloning.
- Post-Order (Left, Right, Root): Ideal for tree deletion.`,
    videoUrl: 'https://www.youtube.com/embed/fAAZixBzIAI',
    videoDuration: '28:30',
    materials: [
      { id: 'mat-6', title: 'Tree Traversal Diagram Reference', type: 'image', size: '1.8 MB', url: '#' },
      { id: 'mat-7', title: 'Recursive Tree Traversal Starter Code', type: 'code', size: '150 KB', url: '#' }
    ]
  },
  {
    id: 'MOD-105',
    courseId: 'CS101',
    title: 'Module 5 — Applications: Graph Representation & BFS/DFS Traversal',
    duration: '80 mins',
    order: 5,
    isCompleted: false,
    objectives: [
      'Compare Adjacency Matrix vs Adjacency List representations',
      'Implement Queue-based Breadth-First Search (BFS)',
      'Implement Stack/Recursion-based Depth-First Search (DFS)'
    ],
    readingMaterial: `Graphs model pairwise relationships between objects using Vertices (V) and Edges (E).
BFS explores breadth level-by-level using a FIFO queue (shortest path in unweighted graphs).
DFS explores paths deeply using recursion or an explicit LIFO stack.`,
    videoUrl: 'https://www.youtube.com/embed/tWVWeAqZ0WU',
    videoDuration: '32:00',
    materials: [
      { id: 'mat-8', title: 'Graph Traversal Lab Guide', type: 'pdf', size: '2.1 MB', url: '#' }
    ]
  },
  // DB Modules
  {
    id: 'MOD-201',
    courseId: 'CS202',
    title: 'Module 1 — Introduction to Relational Algebra & ER Modeling',
    duration: '55 mins',
    order: 1,
    isCompleted: true,
    objectives: [
      'Identify entity sets, attributes, and relationships',
      'Design Entity-Relationship (ER) diagrams',
      'Translate ER diagrams into relational tables with primary/foreign keys'
    ],
    readingMaterial: `Relational database modeling structures data into normalized tables with strict schema constraints.`,
    videoUrl: 'https://www.youtube.com/embed/wR0jg0eQsZA',
    videoDuration: '19:15',
    materials: [
      { id: 'mat-9', title: 'ER Diagram Symbols Standard', type: 'pdf', size: '950 KB', url: '#' }
    ]
  },
  {
    id: 'MOD-202',
    courseId: 'CS202',
    title: 'Module 2 — Core Concepts: Advanced SQL Queries & Joins',
    duration: '70 mins',
    order: 2,
    isCompleted: false,
    objectives: [
      'Master INNER, LEFT, RIGHT, and FULL OUTER joins',
      'Use GROUP BY, HAVING, and aggregation functions',
      'Formulate complex nested subqueries'
    ],
    readingMaterial: `SQL queries allow declarative retrieval of records across normalized tables using joining operations.`,
    videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
    videoDuration: '25:40',
    materials: [
      { id: 'mat-10', title: 'SQL Joins Visual Reference', type: 'pdf', size: '1.4 MB', url: '#' }
    ]
  }
];
