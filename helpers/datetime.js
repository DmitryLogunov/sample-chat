'use strict';

export default datetimeUnixStamp => {  
  const monthsNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ayg', 'Sep', 'Oct', 'Nov', 'Dec']; 
  
  const datetime = new Date(datetimeUnixStamp);    
  let date = datetime.getDate();  
  const month = datetime.getMonth();    
  const year = datetime.getFullYear();
  let hours = datetime.getHours();
  let minutes = datetime.getMinutes();
  let seconds = datetime.getSeconds();    

  date = date < 10 ? `0${date}` : `${date}`;
  hours = hours < 10 ? `0${hours}` : `${hours}`;
  minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${date} ${monthsNames[month]} ${year} ${hours}:${minutes}:${seconds}`;
}