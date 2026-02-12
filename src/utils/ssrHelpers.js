/**
 * Simulates server-side data injection.
 * In a real SSR setup the server would embed this into the HTML via a <script> tag.
 */

// BUG 10 – Missing data hydration:
// This data is injected but the BlogPage component ignores it and re-fetches.
window.__SSR_DATA__ = {
  articles: [
    {
      id: 1,
      slug: 'getting-started-with-react',
      title: 'Getting Started with React',
      excerpt: 'Learn the fundamentals of React including components, props, and state.',
      author: 'Jane Smith',
      date: 'February 12, 2026',
      readTime: '5 min read',
      category: 'Tutorial',
      views: 1042,
      content:
        'React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components". In this article we will cover the basics of React.',
    },
    {
      id: 2,
      slug: 'advanced-hooks-patterns',
      title: 'Advanced Hooks Patterns',
      excerpt: 'Explore custom hooks, composition patterns, and performance optimizations.',
      author: 'John Doe',
      date: 'February 10, 2026',
      readTime: '8 min read',
      category: 'Advanced',
      views: 876,
      content:
        'React Hooks let you use state and other React features without writing a class. Custom hooks let you extract component logic into reusable functions.',
    },
    {
      id: 3,
      slug: 'state-management-guide',
      title: 'Complete State Management Guide',
      excerpt: 'Compare Redux, Context API, Zustand, and other state management solutions.',
      author: 'Alice Johnson',
      date: 'February 8, 2026',
      readTime: '12 min read',
      category: 'Guide',
      views: 2103,
      content:
        'State management is one of the most important concepts in React. This guide compares the most popular state management libraries and when to use each.',
    },
    {
      id: 4,
      slug: 'testing-best-practices',
      title: 'React Testing Best Practices',
      excerpt: 'Write reliable tests with React Testing Library and Jest.',
      author: 'Bob Williams',
      date: 'February 5, 2026',
      readTime: '10 min read',
      category: 'Testing',
      views: 654,
      content:
        'Testing is crucial for building reliable React applications. Learn how to test components, hooks, and async logic using React Testing Library.',
    },
  ],
}
