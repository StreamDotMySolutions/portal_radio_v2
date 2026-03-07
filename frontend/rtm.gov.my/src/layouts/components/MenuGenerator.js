import React from "react";

const MenuGenerator = ({ items }) => {

  return (
<>
      {items.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
</>
  );
};

const MenuItem = ({ item }) => {
  return (
<>
    { item.children.length > 0 &&
    <li>
      {item.title} 
      {item.children && item.children.length > 0 &&  (
        <ul>
          {item.children.map((child) => (
            <MenuItem key={child.id} item={child} />
          ))}
        </ul>
      )}
    </li>
    }
    </>
  );
};



export default MenuGenerator;
