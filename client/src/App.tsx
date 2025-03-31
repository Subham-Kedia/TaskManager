import { Routes, Route, Navigate } from "react-router";
import Dashboard from "@pages/Dashboard";
import TaskTable from "@pages/Table";

import Layout from "@components/Layout";
import { ApplicationContainer } from "@styles/common";
import { PATHS } from "./config/path";

function App() {
  return (
    <ApplicationContainer>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to={PATHS.DASHBOARD} replace />} />
          <Route path={PATHS.DASHBOARD} element={<Dashboard />} />
          <Route path={PATHS.TABLE} element={<TaskTable />} />
          <Route path="*" element={<Navigate to={PATHS.DASHBOARD} replace />} />
        </Route>
      </Routes>
    </ApplicationContainer>
  );
}

export default App;
