import React, {useState, useEffect} from "react";
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import YearSelect from "../components/YearSelect";

const fetchStatePopulation = async () => {
  const response = await fetch(
    "https://datausa.io/api/data?drilldowns=State&measures=Population"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch state data");
  }
  return response.json();
};

export default function States() {
  const [selectedYear, setSelectedYear] = useState("");
  const [sortDirection, setSortDirection] = useState(null); // null, 'asc', or 'desc'

  const {data, isLoading, error} = useQuery({
    queryKey: ["statePopulation"],
    queryFn: fetchStatePopulation,
  });

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      // Get unique years and sort them
      const years = [...new Set(data.data.map((item) => item.Year))];
      years.sort((a, b) => b - a); // Sort descending

      // Set the most recent year as default
      setSelectedYear(years[0]);
    }
  }, [data]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleSort = () => {
    if (sortDirection === null) {
      setSortDirection("asc");
    } else if (sortDirection === "asc") {
      setSortDirection("desc");
    } else {
      setSortDirection(null);
    }
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  // Get unique years for dropdown
  const years = [...new Set(data.data.map((item) => item.Year))];
  years.sort((a, b) => b - a); // Sort descending

  // Filter data for selected year
  let filteredData = data.data.filter((item) => item.Year === selectedYear);

  // Sort data if needed
  if (sortDirection) {
    filteredData = [...filteredData].sort((a, b) => {
      if (sortDirection === "asc") {
        return a.Population - b.Population;
      } else {
        return b.Population - a.Population;
      }
    });
  }

  return (
    <Box>
      <Typography variant="h5" sx={{mb: 3}}>
        State Statistics by Year
      </Typography>

      <Box sx={{mb: 4}}>
        <YearSelect
          years={years}
          selectedYear={selectedYear}
          onChange={handleYearChange}
        />
      </Box>

      <TableContainer component={Paper} sx={{boxShadow: "none"}}>
        <Table>
          <TableHead>
            <TableRow
              sx={{"& th": {borderBottom: "1px solid rgba(0, 0, 0, 0.12)"}}}>
              <TableCell>
                <Typography variant="h6">State</Typography>
              </TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={handleSort}>
                  <Typography variant="h6">Population</Typography>
                  {sortDirection && (
                    <span style={{marginLeft: "5px"}}>
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow
                key={item.State}
                sx={{"& td": {borderBottom: "1px solid rgba(0, 0, 0, 0.12)"}}}>
                <TableCell>
                  <Typography>{item.State}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{formatNumber(item.Population)}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
