async function getTimeZone(userId) {
  console.log('Taking a break...');
  await sleep(2000);
   console.log('Two seconds later...');
  return +5; // Челябинск
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   

module.exports = {
   getTimeZone: getTimeZone
}