import TextEditor from "./components/TextEditor";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to={`/documents/${uuidV4()}`} replace />,
    },
    {
      path: "/documents/:id",
      element: <TextEditor />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
