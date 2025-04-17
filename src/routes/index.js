import Nation from "../containers/Nation";
import States from "../containers/States";

const routes = [
  {
    path: "/nation",
    exact: true,
    component: Nation,
  },
  {
    path: "/states",
    component: States,
  },
];

export default routes;
