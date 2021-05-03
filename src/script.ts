const DECEMBER = 11;
const SATURDAY = 6;
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

/**
 * Retrieves the day crate day will fall on for that year.
 *
 * @param year Year this crate day will occur on. If omitted, will assume current year.
 * @returns Date Crate Day falls on.
 */
function getCrateDay(year?: number): Date {
  year ??= new Date().getFullYear();

  // get day for 1st of December that year
  const decemberFirst = new Date(year, DECEMBER, 1);
  const offset = SATURDAY - decemberFirst.getDay();

  // find the first saturday
  const crateDay = new Date(year, DECEMBER, 1 + offset);
  return crateDay;
}

function getCrateDayAsString(year?: number): string {
  return getCrateDay(year).toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getBeerNumber(now?: Date): number | "before" | "morning" | "after" {
  now ??= new Date();
  const date = getCrateDay();
  const midday = date.valueOf() + 12 * HOUR;
  const end = date.valueOf() + 24 * HOUR;

  // if the date is before it begins, show the normal text
  if (now.valueOf() < getCrateDay().valueOf()) {
    const dateStr = date.toLocaleDateString("en-NZ", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    return "before";
  }

  // if the date falls before 12PM
  if (now.valueOf() < midday) {
    return "morning";
  }

  // if the date falls after 12AM
  if (now.valueOf() > end + HOUR) {
    return "after";
  }

  // get the beer number
  return now.getHours() - 11;
}

function getHeading(): string {
  const beerNumber = getBeerNumber();
  switch (beerNumber) {
    case "before":
      return `Crate Day will be on ${getCrateDayAsString()} this year`;
    case "morning":
      return "Crate Day will start today at 12 PM";
    case "after":
      return "Crate Day is over &middot; See you next year";
    default:
      break;
  }

  let extraString: string | undefined;
  switch (beerNumber) {
    case 1:
      extraString = "Let's get started. Cheers!";
    case 12:
      extraString = "Last one!";
  }
  if (extraString !== undefined) extraString = " &middot; " + extraString;
  return `Beer number <span class="beer-count">${beerNumber}</span>. ${
    12 - beerNumber
  } to go`;
}

const heading = document.getElementById("crate-day-sub");
function updateHeading() {
  // debugger;
  console.log("update !");
  heading.innerHTML = getHeading();
}
updateHeading();
setInterval(updateHeading, 1000);
