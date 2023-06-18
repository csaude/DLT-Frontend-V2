import React, { memo, useCallback, useState } from "react";
import { Platform } from "react-native";
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
  const defaultDate =
    currentDate != null && currentDate != "" && currentDate != undefined
      ? currentDate
      : new Date();
  const [date, setDate] = useState(new Date(defaultDate));
  const [mode, setMode] = useState<any>("date");
  const [show, setShow] = useState(false);

  const onChange = useCallback(
    (event, selectedDate) => {
      console.log("---show---", show);
      if (event.type === "dismissed" && !isEdit) {
        setDate(new Date());
      } else {
        const formatedDate = moment(selectedDate).format("YYYY-MM-DD");
        setDate(selectedDate);
        onDateSelection(formatedDate);
      }
      setShow(false);
    },
    [isEdit, onDateSelection, show]
  );

  const showMode = useCallback(
    (currentMode) => {
      console.log("---show---", show);
      if (Platform.OS === "android") {
        setShow(false);
        // for iOS, add a button that closes the picker
      }
      setMode(currentMode);
    },
    [show]
  );

  const showDatepicker = useCallback(() => {
    showMode("date");
    setShow(true);
  }, [showMode]);

  return (
    <>
      <Icon
        as={MaterialIcons}
        name="mode-edit"
        size={6}
        color="gray.600"
        onPress={showDatepicker}
      />

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
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
  minDate: PropTypes.object.isRequired,
  maxDate: PropTypes.object.isRequired,
  currentDate: PropTypes.object.isRequired,
  isEdit: PropTypes.bool.isRequired,
};

export default memo(MyDatePicker);
