async function getTimeZone(isAuthenticated) {
  console.log('Taking a break...');
  await sleep(2000);
   console.log('Two seconds later...');
   
   if (isAuthenticated) 
  		return +5; // Челябинск
  	return 0; // Гринвич
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   

module.exports = {
   getTimeZone: getTimeZone
}