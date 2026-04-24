 export const createLabelFormatter = (filter: any) => {
    return (label: any) => {
      if (!label || filter === "weekly") return label;
      const dayMap = {
        Monday: "Mon",
        Tuesday: "Tue",
        Wednesday: "Wed",
        Thursday: "Thu",
        Friday: "Fri",
        Saturday: "Sat",
        Sunday: "Sun",
      };
      const monthMap = {
        January: "Jan",
        February: "Feb",
        March: "Mar",
        April: "Apr",
        May: "May",
        June: "Jun",
        July: "Jul",
        August: "Aug",
        September: "Sep",
        October: "Oct",
        November: "Nov",
        December: "Dec",
      };
      return dayMap?.[label] || monthMap?.[label] || label;
    };
  };

