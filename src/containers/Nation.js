import React, {useState, useEffect} from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {useQuery} from "@tanstack/react-query";

const fetchNationalPopulation = async () => {
  const response = await fetch(
    "https://datausa.io/api/data?drilldowns=Nation&measures=Population"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export default function Nation() {
  const [selectedYears, setSelectedYears] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [tempSelectedYears, setTempSelectedYears] = useState([]);

  const {data, isLoading, error} = useQuery({
    queryKey: ["nationalPopulation"],
    queryFn: fetchNationalPopulation,
  });

  useEffect(() => {
    if (data?.data) {
      // Get 5 most recent years
      const sortedData = [...data.data].sort(
        (a, b) => parseInt(b.Year) - parseInt(a.Year)
      );
      const recentYears = sortedData.slice(0, 5).map((item) => item.Year);
      setSelectedYears(recentYears);
      setTempSelectedYears(recentYears);
    }
  }, [data]);

  const handleOpenModal = () => {
    setTempSelectedYears([...selectedYears]);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = () => {
    setSelectedYears([...tempSelectedYears]);
    handleCloseModal();
  };

  const handleCheckboxChange = (year) => {
    if (tempSelectedYears.includes(year)) {
      setTempSelectedYears(tempSelectedYears.filter((y) => y !== year));
    } else {
      setTempSelectedYears([...tempSelectedYears, year]);
    }
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  // Sort data by year in descending order
  const sortedData = [...data.data].sort(
    (a, b) => parseInt(b.Year) - parseInt(a.Year)
  );

  // Filter data based on selected years
  const filteredData = sortedData.filter((item) =>
    selectedYears.includes(item.Year)
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}>
        <Typography variant="h5">Nation Statistics by Year</Typography>
        <Button
          variant="text"
          color="primary"
          onClick={handleOpenModal}
          sx={{fontWeight: "bold"}}>
          EDIT
        </Button>
      </Box>

      <Box sx={{borderBottom: 1, borderColor: "divider", py: 1}}>
        <Typography
          variant="h6"
          component="div"
          sx={{display: "inline-block", width: "50%"}}>
          Year
        </Typography>
        <Typography
          variant="h6"
          component="div"
          sx={{display: "inline-block", width: "50%"}}>
          Population
        </Typography>
      </Box>

      {filteredData.map((item) => (
        <Box
          key={item.Year}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            py: 1,
            display: "flex",
          }}>
          <Typography component="div" sx={{width: "50%"}}>
            {item.Year}
          </Typography>
          <Typography component="div" sx={{width: "50%"}}>
            {formatNumber(item.Population)}
          </Typography>
        </Box>
      ))}

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle sx={{textAlign: "center", fontWeight: "normal"}}>
          Select Year(s)
        </DialogTitle>
        <DialogContent>
          <FormGroup>
            {sortedData.map((item) => (
              <FormControlLabel
                key={item.Year}
                control={
                  <Checkbox
                    checked={tempSelectedYears.includes(item.Year)}
                    onChange={() => handleCheckboxChange(item.Year)}
                    sx={{"& .MuiSvgIcon-root": {fontSize: 28}}}
                  />
                }
                label={item.Year}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions sx={{justifyContent: "space-between", px: 2, pb: 2}}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{width: 120, borderRadius: 2, py: 1}}>
            ADD
          </Button>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            sx={{width: 120, borderRadius: 2, py: 1}}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
