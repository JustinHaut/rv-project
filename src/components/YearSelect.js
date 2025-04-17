import React from "react";
import {FormControl, InputLabel, Select, MenuItem} from "@mui/material";

const YearSelect = ({years, selectedYear, onChange}) => {
  const createOptions = () => {
    return years.map((year) => (
      <MenuItem key={year} value={year}>
        {year}
      </MenuItem>
    ));
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="state-stats-by-year-select">Year</InputLabel>
      <Select
        labelId="state-stats-by-year-select"
        value={selectedYear}
        label="Year"
        onChange={(e) => onChange(e.target.value)}>
        {createOptions()}
      </Select>
    </FormControl>
  );
};

export default YearSelect;
