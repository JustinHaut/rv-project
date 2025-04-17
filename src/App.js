import React from "react";
import {Box, Button} from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useLocation,
} from "react-router-dom";
import routes from "./routes";
import "./styles.css";

function NavigationButtons() {
  const location = useLocation();
  return (
    <Box sx={{display: "flex", gap: 2, mb: 4}}>
      <Button
        component={Link}
        to="/nation"
        variant={
          location.pathname === "/nation" || location.pathname === "/"
            ? "contained"
            : "outlined"
        }
        color="primary"
        sx={{borderRadius: 28, width: 140}}>
        NATION
      </Button>
      <Button
        component={Link}
        to="/states"
        variant={location.pathname === "/states" ? "contained" : "outlined"}
        color="primary"
        sx={{borderRadius: 28, width: 140}}>
        STATES
      </Button>
    </Box>
  );
}

function App() {
  return (
    <Box p={4}>
      <Router>
        <NavigationButtons />
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ))}
          <Route exact path="/" component={routes[0].component} />
        </Switch>
      </Router>
    </Box>
  );
}

export default App;
