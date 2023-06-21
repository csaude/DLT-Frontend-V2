import React, { useCallback, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Icon } from "native-base";
import { MaterialIcons } from "@native-base/icons";
import moment from "moment";
import PropTypes from "prop-types";

const MyDatePicker = ({
  onDateSelection,
  minDate,
  maxDate,
  currentDate,
  isEdit,
}) => {
  const [date, setDate] = useState(currentDate);
  const [show, setShow] = useState(false);

  const onChange = useCallback((event, selectedDate) => {
    if (event.type === "dismissed" && !isEdit) {
      setDate(new Date());
    } else {
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      setDate(selectedDate);
      onDateSelection(formattedDate);
    }
    setShow(false);
  }, []);

  return (
    <>
      <Icon
        as={MaterialIcons}
        name="mode-edit"
        size={6}
        color="gray.600"
        onPress={() => setShow(true)}
      />

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          is24Hour={true}
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={onChange}
        />
      )}
    </>
  );
};

MyDatePicker.propTypes = {
  onDateSelection: PropTypes.func.isRequired,
  minDate: PropTypes.instanceOf(Date).isRequired,
  maxDate: PropTypes.instanceOf(Date).isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired,
  isEdit: PropTypes.bool.isRequired,
};

export default MyDatePicker;
