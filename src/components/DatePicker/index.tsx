import React, { useCallback, useState } from "react";
import { Icon } from "native-base";
import { MaterialIcons } from "@native-base/icons";
import moment from "moment";
import PropTypes from "prop-types";
import DatePicker from "react-native-date-picker";
import "moment/locale/pt"; // Import Portuguese locale for moment

const MyDatePicker = ({ onDateSelection, minDate, maxDate, currentDate }) => {
  const [date, setDate] = useState(currentDate);
  const [open, setOpen] = useState(false);
  moment.locale("pt"); // Set Portuguese locale

  const handleOnConfirm = useCallback((selectedDate) => {
    setOpen(false);
    setDate(selectedDate);
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    onDateSelection(formattedDate);
  }, []);

  return (
    <>
      <Icon
        as={MaterialIcons}
        name="mode-edit"
        size={6}
        color="gray.600"
        onPress={() => setOpen(true)}
      />

      <DatePicker
        title={"Selecione a data"}
        locale="pt"
        mode="date"
        minimumDate={minDate}
        maximumDate={maxDate}
        modal
        open={open}
        date={date}
        onConfirm={(date) => handleOnConfirm(date)}
        onCancel={() => {
          setOpen(false);
          setDate(new Date());
        }}
      />
    </>
  );
};

MyDatePicker.propTypes = {
  onDateSelection: PropTypes.func.isRequired,
  minDate: PropTypes.instanceOf(Date).isRequired,
  maxDate: PropTypes.instanceOf(Date).isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired,
};

export default MyDatePicker;
