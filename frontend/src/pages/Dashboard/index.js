import React from 'react';

const optionStyle = {
  paddingLeft: '10px', // Adjust the padding as needed
};

function CategoryDropdown({ data, depth = 0 }) {
  return (
    <select>
      {data.map((category) => (
        <option key={category.id} value={category.id} style={optionStyle}>
          {category.name}
        </option>
      ))}
      {data.map((category) => (
        <CategoryDropdown key={category.id} data={category.children} depth={depth + 1} />
      ))}
    </select>
  );
}

function App() {
  const categoryData = [
    {
      id: 1,
      name: 'Category 1',
      children: [
        {
          id: 2,
          name: 'Subcategory 1.1',
          children: [
            {
              id: 3,
              name: 'Subcategory 1.1.1',
              children: [],
            },
          ],
        },
        {
          id: 4,
          name: 'Subcategory 1.2',
          children: [],
        },
      ],
    },
    {
      id: 5,
      name: 'Category 2',
      children: [],
    },
  ];

  return (
    <div>
      <CategoryDropdown data={categoryData} />
    </div>
  );
}

export default App;
