"use strict";

document.getElementById("convert").addEventListener("click", convertSchedule);
document.getElementById("download").addEventListener("click", download);

function convertSchedule() {
  const schedule = document.getElementById("schedule");

  const namePattern = /^(.*)\s(Spring|Fall)/;
  const coursePattern = /(\w{4})\s(\d{3})\s(\d{3})/;
  const timePattern = /^(\d{2}:\d{2})\s-\s(\d{2}:\d{2})/;
  const daysPattern = /^((Monday|Tuesday|Wednesday|Thursday|Friday)(?:,?\s|$))+/;

  let lines = schedule.value.split("\n");
  let currDays = "";
  let newSchedule = "";

  // Extracts the relevant information from the old schedule, formats it, and places it into newSchedule
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    let ptName = line.match(namePattern);
    if (ptName) {
      newSchedule += "Schedule for " + ptName[1] + " - " + ptName[2] + "\n";
      continue;
    }

    let course = line.match(coursePattern);
    if (course) {
      newSchedule += "\n" + course.slice(1, course.length).join("-") + "\n";
      continue;
    }

    let daysMatch = line.match(daysPattern);
    if (daysMatch) {
      let daysList = daysMatch[0].split(", ");
      currDays = abbreviateDays(daysList);
      continue;
    }

    let time = line.match(timePattern);
    if (time) {
      newSchedule += convert12(time[1]) + " - " + convert12(time[2]) + "\n" + currDays + "\n";
    }
  }

  schedule.value = newSchedule;
}


// Function from: https://stackoverflow.com/a/48550997
// Downloads the contents of the #schedule textarea to a .txt file
function download() {
  let text = document.getElementById("schedule").value;
  text = text.replace(/\n/g, "\r\n"); // To retain the Line breaks.

  let filename = "schedule-converted.txt"
  const namePattern = /^Schedule for (.+) -/;
  let nameMatch = text.match(namePattern);
  if(nameMatch){
    filename = nameMatch[1].replace(/ /g, "_") + ".txt"; 
  }

  let blob = new Blob([text], {
    type: "text/plain"
  });
  let anchor = document.createElement("a");
  anchor.download = filename;
  anchor.href = window.URL.createObjectURL(blob);
  anchor.target = "_blank";
  anchor.style.display = "none"; // just to be safe!
  
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

// Turns an array of days into a string of their abbreviations
// Input: ["Monday", "Wednesday", "Friday"]
// Output: "MO,WE,FR"
function abbreviateDays(days) {
  let result = "";

  for (let i = 0; i < days.length; i++) {
    switch (days[i]) {
      case "Monday":
        result += "MO";
        break;
      case "Tuesday":
        result += "TU";
        break;
      case "Wednesday":
        result += "WE";
        break;
      case "Thursday":
        result += "TH";
        break;
      case "Friday":
        result += "FR";
        break;
    }

    if (i != days.length - 1) {
      result += ",";
    }
  }

  return result;
}

// Turns a string in the form "hh:mm" (24 hour time) to am/pm
// Input: "15:50"
// Output: "03:50 PM"
function convert12(time) {
  let result = "";

  let hour = time.slice(0, 2);
  let minute = time.slice(3, time.length);
  let suffix = "AM";

  if (parseInt(hour) >= 12) {
    hour = "0" + (parseInt(hour) - 12).toString();
    suffix = "PM";
  }

  if (hour === "00") {
    hour = "12";
  }

  return hour + time.slice(2, time.length) + " " + suffix;
}