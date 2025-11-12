const main = () => {
    console.log("Inside main:", this); // ❌ `this` is still undefined
  };
  
  export default main;
  