// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

$(function () {
  var schedule = JSON.parse(localStorage.getItem("schedule"));
  var timeBlocks = $(".time-block");
  var resetCssOnTheHour;

  //displays the current day
  $("#currentDay").text(dayjs().format("MMM DD, YYYY"));

  //checks if schedule does not exist and creates it in local storage if not. 
  if (schedule == null || schedule == "") {
    schedule = {};
    // create schedule object attribute key to match timeblock id
    timeBlocks.each(function () {
      schedule[this.id] = "";
    });

    localStorage.setItem("schedule", JSON.stringify(schedule));
  }
  //if the schedule does exist it runs the setTimeBlocks function. 
  else {
    setTimeBlocks();
  }

  //For each timeblock, get the child of the text block and set it to the value of that hour in local storage. 
  function setTimeBlocks() {
    timeBlocks.each(function () {
      $(this).children("textarea").val(schedule[this.id]);
    });
  }

  //called the settimeBasedCssClass function.
  setTimeBasedCssClass();

  //dayjs to add css classes to the timeblocks.
  function setTimeBasedCssClass() {
    updateHourlyTimeInterval();
    var currentHour = parseInt(dayjs().format("H"));

    timeBlocks.each(function () {
      //looks at the id of the timeblock and splits on the dash to identify each one numerically.
      $(this).removeClass("past").removeClass("present").removeClass("future");

      var timeBlockHour = parseInt(this.id.split('-')[1]);
      if (timeBlockHour < currentHour) {
        $(this).addClass("past");
      }
      else if (timeBlockHour == currentHour) {
        $(this).addClass("present");
      }
      else {
        $(this).addClass("future");
      }
    });

  }

  //function to update the time interval before running the setTimeBasedCssClass function again
  function updateHourlyTimeInterval() {
    if (resetCssOnTheHour != null) {
      clearInterval(resetCssOnTheHour);
    }

    var nextHour = dayjs().minute(0).second(0).millisecond(0).add(1, "hour");
    var nextHourDelay = nextHour.diff(dayjs());

    //refreshes every hour to update time
    resetCssOnTheHour = setInterval(setTimeBasedCssClass, nextHourDelay);
  }

  //event listener for the save button. Saves text to local storage.
  $(".saveBtn").click(function () {
    var hourElement = $(this).parent();
    var hour = $(hourElement).attr("id");
    var text = $(hourElement).children('textarea').val();
    schedule[hour] = text;
    localStorage.setItem("schedule", JSON.stringify(schedule));
  });

  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
});
