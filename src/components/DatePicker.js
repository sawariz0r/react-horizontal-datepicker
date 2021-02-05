/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styles from "./DatePicker.module.css";
import {
  addDays,
  addMonths,
  differenceInMonths,
  format,
  isSameDay,
  lastDayOfMonth,
  startOfMonth,
  subDays,
} from "date-fns";

export default function DatePicker({
  endDate,
  selectDate,
  getSelectedDay,
  color,
  labelFormat,
  onlyValidDays = false,
  sessionDates = [{ date: new Date(), dots: ["pink", "purple"] }],
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const firstSection = { marginLeft: "40px" };
  const startDate = subDays(new Date(), 3);
  const lastDate = addDays(startDate, endDate || 90);
  const primaryColor = color || "rgb(54, 105, 238)";
  const disabledStyle = { opacity: 0.2 };
  const selectedStyle = {
    fontWeight: "bold",
    width: "48px",
    height: "48px",
    borderRadius: "5px",
    zIndex: 0,
    background: primaryColor,
    color: "#f3f3f3",
  };
  const buttonColor = { background: primaryColor };
  const labelColor = { color: primaryColor };

  const getStyles = (day) => {
    if (
      sessionDates.length > 0 &&
      !sessionDates
        .map((x) => {
          return x.date;
        })
        .find((x) => isSameDay(x, day))
    ) {
      return disabledStyle;
    }
    if (isSameDay(day, selectedDate)) {
      return selectedStyle;
    }
    return null;
  };

  const getId = (day) => {
    if (isSameDay(day, selectedDate)) {
      return "selected";
    } else {
      return "";
    }
  };

  function renderDays() {
    const dayFormat = "E";
    const dateFormat = "d";
    const months = [];
    let days = [];
    for (let i = 0; i <= differenceInMonths(lastDate, startDate); i++) {
      let start, end;
      const month = startOfMonth(addMonths(startDate, i));
      start = i === 0 ? Number(format(startDate, dateFormat)) - 1 : 0;
      end =
        i === differenceInMonths(lastDate, startDate)
          ? Number(format(lastDate, "d"))
          : Number(format(lastDayOfMonth(month), "d"));
      for (let j = start; j < end; j++) {
        days.push(
          <div
            id={`${getId(addDays(startDate, j))}`}
            className={styles.dateDayItem}
            style={getStyles(addDays(month, j))}
            key={addDays(month, j)}
            onClick={() => onDateClick(addDays(month, j))}
          >
            <div className={styles.dayLabel}>
              {format(addDays(month, j), dayFormat)}
            </div>
            <div className={styles.dateLabel}>
              {format(addDays(month, j), dateFormat)}
            </div>
            <div className={styles.sessionDots}>
              {sessionDates
                .filter((x) => {
                  return isSameDay(x.date, addDays(month, j));
                })
                .flatMap((x) => {
                  return x.dots;
                })
                .map((x, i) => {
                  if (i < 3)
                    return (
                      <div
                        className={styles.sessionDot}
                        style={{ background: x }}
                      ></div>
                    );
                })}
            </div>
          </div>
        );
      }
      months.push(
        <div className={styles.monthContainer} key={month}>
          <span className={styles.monthYearLabel} style={labelColor}>
            {format(month, labelFormat || "MMMM yyyy")}
          </span>
          <div
            className={styles.daysContainer}
            style={i === 0 ? firstSection : null}
          >
            {days}
          </div>
        </div>
      );
      days = [];
    }
    return (
      <div id={"container"} className={styles.dateListScrollable}>
        {months}
      </div>
    );
  }

  const onDateClick = (day) => {
    if (
      onlyValidDays &&
      !sessionDates
        .map((x) => {
          return x.date;
        })
        .find((x) => isSameDay(x, day))
    ) {
      return;
    }
    setSelectedDate(day);
    if (getSelectedDay) {
      getSelectedDay(day);
    }
  };

  useEffect(() => {
    if (getSelectedDay) {
      if (selectDate) {
        getSelectedDay(selectDate);
      } else {
        getSelectedDay(startDate);
      }
    }
  }, []);

  useEffect(() => {
    if (selectDate) {
      if (!isSameDay(selectedDate, selectDate)) {
        setSelectedDate(selectDate);
        setTimeout(() => {
          let view = document.getElementById("selected");
          if (view) {
            view.scrollIntoView({
              behavior: "smooth",
              inline: "center",
              block: "nearest",
            });
          }
        }, 20);
      }
    }
  }, [selectDate]);

  const nextWeek = () => {
    const e = document.getElementById("container");
    const width = e ? e.getBoundingClientRect().width : null;
    e.scrollLeft += width - 60;
  };

  const prevWeek = () => {
    const e = document.getElementById("container");
    const width = e ? e.getBoundingClientRect().width : null;
    e.scrollLeft -= width - 60;
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonWrapper}>
        <button
          className={styles.button}
          style={buttonColor}
          onClick={prevWeek}
        >
          ←
        </button>
      </div>
      {renderDays()}
      <div className={styles.buttonWrapper}>
        <button
          className={styles.button}
          style={buttonColor}
          onClick={nextWeek}
        >
          →
        </button>
      </div>
    </div>
  );
}
